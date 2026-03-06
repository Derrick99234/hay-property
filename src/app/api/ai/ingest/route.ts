import type { NextRequest } from "next/server";
import { connectMongo } from "../../../../lib/mongodb";
import { Blog } from "../../../../models/Blog";
import { KnowledgeChunk } from "../../../../models/KnowledgeChunk";
import { Property } from "../../../../models/Property";
import { isAdmin } from "../../_lib/auth";
import { jsonError, jsonOk } from "../../_lib/http";
import { embedTextWithFallback } from "../_lib/gemini";
import { chunkText, hashText, htmlToText, normalizeText } from "../_lib/text";

export const runtime = "nodejs";

async function upsertSourceChunks(args: { sourceType: string; sourceId: string; title: string; url: string; content: string }) {
  const normalized = normalizeText(args.content);
  if (!normalized) return { upserted: 0, skipped: 0, embedded: 0, embedSkipped: 0 };

  const chunks = chunkText(normalized);
  let upserted = 0;
  let skipped = 0;
  let embedded = 0;
  let embedSkipped = 0;

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i] ?? "";
    const contentHash = hashText(content);

    const existing = await KnowledgeChunk.findOne(
      { sourceType: args.sourceType, sourceId: args.sourceId, chunkIndex: i },
      { contentHash: 1 }
    ).lean();

    if (existing && String((existing as any).contentHash ?? "") === contentHash) {
      skipped++;
      continue;
    }

    let embeddingModel = "none";
    let embedding: number[] = [];
    try {
      const r = await embedTextWithFallback(content);
      embeddingModel = r.model;
      embedding = r.embedding;
      embedded++;
    } catch {
      embedSkipped++;
    }

    await KnowledgeChunk.updateOne(
      { sourceType: args.sourceType, sourceId: args.sourceId, chunkIndex: i },
      {
        $set: {
          title: args.title,
          url: args.url,
          content,
          contentHash,
          embeddingModel,
          embedding,
        },
      },
      { upsert: true }
    );
    upserted++;
  }

  return { upserted, skipped, embedded, embedSkipped };
}

async function fetchPageText(origin: string, path: string) {
  const url = `${origin}${path}`;
  const res = await fetch(url, { method: "GET" });
  const html = await res.text();
  const text = htmlToText(html);
  return { url, text };
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  const apiKey = (process.env.GEMINI_API_KEY ?? "").trim();
  if (!apiKey) return jsonError("Missing GEMINI_API_KEY.", { status: 500 });

  await connectMongo();

  const origin = req.nextUrl.origin;
  const staticPages = [
    { id: "home", title: "Home", path: "/" },
    { id: "about", title: "About", path: "/about" },
    { id: "properties", title: "Properties", path: "/properties" },
    { id: "blog", title: "Blog", path: "/blog" },
    { id: "contact", title: "Contact", path: "/contact" },
    { id: "terms", title: "Terms", path: "/terms" },
    { id: "privacy", title: "Privacy Policy", path: "/privacy-policy" },
  ];

  let upserted = 0;
  let skipped = 0;
  let embedded = 0;
  let embedSkipped = 0;
  const errors: Array<{ source: string; message: string }> = [];

  for (const p of staticPages) {
    try {
      const { url, text } = await fetchPageText(origin, p.path);
      const r = await upsertSourceChunks({ sourceType: "page", sourceId: p.id, title: p.title, url, content: text });
      upserted += r.upserted;
      skipped += r.skipped;
      embedded += r.embedded;
      embedSkipped += r.embedSkipped;
    } catch (err) {
      errors.push({ source: `page:${p.path}`, message: err instanceof Error ? err.message : "Failed" });
    }
  }

  const props = await Property.find({}, { _id: 1, title: 1, slug: 1, description: 1, price: 1, currency: 1, status: 1, city: 1, state: 1 }).lean();
  for (const p of props) {
    try {
      const id = String((p as any)._id ?? "");
      const title = String((p as any).title ?? "Property");
      const slug = String((p as any).slug ?? "");
      const location = [String((p as any).city ?? ""), String((p as any).state ?? "")].filter(Boolean).join(", ");
      const price = typeof (p as any).price === "number" ? String((p as any).price) : "";
      const currency = String((p as any).currency ?? "NGN");
      const status = String((p as any).status ?? "");
      const desc = String((p as any).description ?? "");
      const url = `${origin}/properties/${encodeURIComponent(slug)}`;
      const content = normalizeText(
        [
          `Property: ${title}`,
          slug ? `Slug: ${slug}` : "",
          location ? `Location: ${location}` : "",
          price ? `Price: ${price} ${currency}` : "",
          status ? `Status: ${status}` : "",
          desc ? `Description: ${desc}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );
      const r = await upsertSourceChunks({ sourceType: "property", sourceId: id, title, url, content });
      upserted += r.upserted;
      skipped += r.skipped;
      embedded += r.embedded;
      embedSkipped += r.embedSkipped;
    } catch (err) {
      errors.push({ source: `property`, message: err instanceof Error ? err.message : "Failed" });
    }
  }

  const blogs = await Blog.find({ published: true }, { _id: 1, title: 1, slug: 1, excerpt: 1, content: 1, category: 1 }).lean();
  for (const b of blogs) {
    try {
      const id = String((b as any)._id ?? "");
      const title = String((b as any).title ?? "Blog");
      const slug = String((b as any).slug ?? "");
      const category = String((b as any).category ?? "");
      const excerpt = String((b as any).excerpt ?? "");
      const contentText = String((b as any).content ?? "");
      const url = `${origin}/blog/${encodeURIComponent(slug)}`;
      const content = normalizeText(
        [`Blog: ${title}`, category ? `Category: ${category}` : "", excerpt ? `Excerpt: ${excerpt}` : "", contentText ? `Content: ${contentText}` : ""]
          .filter(Boolean)
          .join("\n\n")
      );
      const r = await upsertSourceChunks({ sourceType: "blog", sourceId: id, title, url, content });
      upserted += r.upserted;
      skipped += r.skipped;
      embedded += r.embedded;
      embedSkipped += r.embedSkipped;
    } catch (err) {
      errors.push({ source: `blog`, message: err instanceof Error ? err.message : "Failed" });
    }
  }

  return jsonOk({ upserted, skipped, embedded, embedSkipped, errors });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();
  await KnowledgeChunk.deleteMany({});
  return jsonOk({ ok: true });
}
