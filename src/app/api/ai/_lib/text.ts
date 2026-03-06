import crypto from "crypto";

export function hashText(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function normalizeText(input: string) {
  return input
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .replaceAll("\t", " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

export function chunkText(input: string, { maxChars = 1400, overlap = 180 }: { maxChars?: number; overlap?: number } = {}) {
  const text = normalizeText(input);
  if (!text) return [];

  const paras = text.split("\n\n").map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  let buf = "";

  const flush = () => {
    const out = buf.trim();
    if (out) chunks.push(out);
    buf = "";
  };

  for (const p of paras) {
    if (!buf) {
      buf = p;
      continue;
    }
    if ((buf + "\n\n" + p).length <= maxChars) {
      buf = buf + "\n\n" + p;
      continue;
    }
    flush();
    buf = p;
  }
  flush();

  if (overlap > 0 && chunks.length > 1) {
    const withOverlap: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const prev = i > 0 ? chunks[i - 1] : "";
      const cur = chunks[i];
      const tail = prev ? prev.slice(Math.max(0, prev.length - overlap)) : "";
      const merged = tail ? normalizeText(`${tail}\n\n${cur}`) : cur;
      withOverlap.push(merged);
    }
    return withOverlap;
  }

  return chunks;
}

export function htmlToText(html: string) {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, " ");
  out = out.replace(/<style[\s\S]*?<\/style>/gi, " ");
  out = out.replace(/<br\s*\/?>/gi, "\n");
  out = out.replace(/<\/(p|div|section|article|header|footer|li|h1|h2|h3|h4|h5|h6)>/gi, "\n\n");
  out = out.replace(/<li[^>]*>/gi, "- ");
  out = out.replace(/<[^>]+>/g, " ");
  out = out
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
  return normalizeText(out);
}

