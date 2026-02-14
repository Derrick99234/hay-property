import Link from "next/link";
import { notFound } from "next/navigation";
import { connectMongo } from "../../../lib/mongodb";
import { Blog } from "../../../models/Blog";
import { pickBlogImage } from "../../../lib/unsplash";

export const revalidate = 30;

function formatDateLabel(value: Date) {
  return value.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function fallbackCoverUrl(slug: string) {
  return pickBlogImage(slug);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: any | null = null;
  let dbError = false;
  try {
    await connectMongo();
    doc = await Blog.findOne({ slug: slug.toLowerCase(), published: true }).lean();
  } catch {
    dbError = true;
  }
  if (dbError) {
    return (
      <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
        <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
          >
            <span aria-hidden="true">←</span>
            Back to blog
          </Link>
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
            Blog service is temporarily unavailable. Please start MongoDB and refresh.
          </div>
        </div>
      </div>
    );
  }
  if (!doc) notFound();

  const title = String((doc as any).title ?? "");
  const excerpt = String((doc as any).excerpt ?? "");
  const content = String((doc as any).content ?? "");
  const category = String((doc as any).category ?? "Insights");
  const dateSrc = (doc as any).publishedAt ?? (doc as any).createdAt;
  const date = formatDateLabel(new Date(dateSrc));
  const coverUrl = String((doc as any).coverUrl ?? "").trim() || fallbackCoverUrl(slug);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
        >
          <span aria-hidden="true">←</span>
          Back to blog
        </Link>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-100">
          <div className="relative aspect-[16/9] bg-zinc-200">
            <img
              src={coverUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
              {category}
            </div>
          </div>

          <div className="space-y-5 p-7 sm:p-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{date}</div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
            {excerpt ? <p className="text-sm leading-7 text-zinc-600">{excerpt}</p> : null}

            <div className="h-px bg-zinc-100" />

            <div className="space-y-4 text-sm leading-7 text-zinc-700">
              {content
                .split(/\n{2,}/)
                .map((block) => block.trim())
                .filter(Boolean)
                .map((block, idx) => (
                  <p key={idx}>{block}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
