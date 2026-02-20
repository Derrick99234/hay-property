import Link from "next/link";
import { connectMongo } from "../../lib/mongodb";
import { Blog } from "../../models/Blog";
import { pickBlogImage } from "../../lib/unsplash";
import SiteHeader from "../_components/SiteHeader";
import Image from "next/image";
import SiteFooter from "../_components/SiteFooter";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
  coverUrl: string;
};

export const revalidate = 30;

function formatDateLabel(value: Date) {
  return value.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function estimateReadTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 200));
  return `${minutes} min read`;
}

function fallbackCoverUrl(slug: string) {
  return pickBlogImage(slug);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = (category ?? "").trim();
  let docs: any[] = [];
  try {
    await connectMongo();
    const filter: Record<string, unknown> = { published: true };
    if (activeCategory) filter.category = activeCategory;
    docs = await Blog.find(filter, null, {
      sort: { publishedAt: -1, createdAt: -1 },
      limit: 30,
    }).lean();
  } catch {
    docs = [];
  }
  const posts: Post[] = docs.map((d) => {
    const title = String((d as any).title ?? "");
    const excerpt =
      String((d as any).excerpt ?? "").trim() ||
      String((d as any).content ?? "")
        .slice(0, 160)
        .trim();
    const category = String((d as any).category ?? "Insights");
    const dateSrc = (d as any).publishedAt ?? (d as any).createdAt;
    const date = formatDateLabel(new Date(dateSrc));
    const coverUrl =
      String((d as any).coverUrl ?? "").trim() ||
      fallbackCoverUrl(String((d as any).slug ?? ""));
    const readTime = estimateReadTime(String((d as any).content ?? excerpt));
    return {
      slug: String((d as any).slug ?? ""),
      title,
      excerpt,
      category,
      date,
      readTime,
      coverUrl,
    };
  });

  const featured = posts[0];
  const rest = posts.slice(1);

  const categories = ["All", "Investing", "Market", "Guides", "Tips"];

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="pb-16">
          <section className="relative overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-100">
            <div className="absolute inset-0 transform-gpu will-change-transform">
              <Image
                src={
                  "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="Blog Page"
                className="h-full w-full object-cover"
                width={2000}
                height={1200}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_80%_50%,rgba(242,85,93,0.10),transparent),radial-gradient(900px_520px_at_85%_70%,rgba(29,43,86,0.10))]" />
            <div className="relative grid gap-10 px-7 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                    aria-hidden="true"
                  />
                  Latest articles
                </div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                  Simple insights for smarter property decisions.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white sm:text-base">
                  Learn how to buy land, understand documents, and invest with
                  confidence—clear explanations, practical tips, and short
                  guides.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="#posts"
                    className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                    }}
                  >
                    Browse posts
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                  >
                    Ask a question
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-zinc-100">
                    Land buying
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-zinc-100">
                    Documents
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-zinc-100">
                    Investing
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[22px] bg-zinc-200">
                {featured ? (
                  <Media src={featured.coverUrl} alt={featured.title} />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/85 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-500">
                        Featured
                      </div>
                      <div className="mt-1 truncate text-sm font-semibold text-zinc-900">
                        {featured?.title ?? "No posts yet"}
                      </div>
                    </div>
                    <Link
                      href={featured ? `/blog/${featured.slug}` : "#posts"}
                      className="grid size-10 shrink-0 place-items-center rounded-full text-white shadow-sm transition hover:opacity-95"
                      style={{
                        backgroundColor: ACCENT,
                        boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                      }}
                      aria-label="View posts"
                    >
                      <IconArrow />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="posts" className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Blog
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Latest posts
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm ring-1 ring-zinc-100">
                  {categories.map((c) => (
                    <CategoryPill
                      key={c}
                      category={c}
                      active={
                        c === "All" ? !activeCategory : activeCategory === c
                      }
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {featured ? <FeaturedCard post={featured} /> : <EmptyCard />}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                {rest.slice(0, 4).map((p) => (
                  <CompactCard key={p.slug} post={p} />
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.slice(4).map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}

function CategoryPill({
  category,
  active,
}: {
  category: string;
  active?: boolean;
}) {
  const href =
    category === "All" ? "/blog" : { pathname: "/blog", query: { category } };
  return (
    <Link
      href={href}
      className={[
        "h-9 flex justify-center items-center rounded-full px-4 text-xs font-semibold transition",
        active ? "text-white" : "text-zinc-700 hover:text-zinc-900",
      ].join(" ")}
      style={
        active
          ? {
              backgroundColor: ACCENT,
              boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
            }
          : undefined
      }
    >
      {category}
    </Link>
  );
}

function FeaturedCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="relative aspect-[16/10] bg-zinc-200">
        <Media src={post.coverUrl} alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/25 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur">
          {post.category}
        </div>
      </div>
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500">
          <span>{post.date}</span>
          <span
            className="size-1 rounded-full bg-zinc-300"
            aria-hidden="true"
          />
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-zinc-900">
          {post.title}
        </h3>
        <p className="text-sm leading-7 text-zinc-600">{post.excerpt}</p>
        <div className="pt-1">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: ACCENT }}
          >
            Read article
            <IconArrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-zinc-500">
            <span
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: "rgba(242,85,93,0.12)", color: ACCENT }}
            >
              {post.category}
            </span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="truncate text-sm font-semibold text-zinc-900">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-zinc-600">
            {post.excerpt}
          </p>
        </div>
        <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-zinc-200">
          <Media src={post.coverUrl} alt={post.title} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs font-semibold text-zinc-500">
        <span>{post.date}</span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 transition group-hover:opacity-95"
          style={{ color: ACCENT }}
        >
          Read
          <IconArrow />
        </Link>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[16/10] bg-zinc-200">
        <Media src={post.coverUrl} alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/15 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur">
          {post.category}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500">
          <span>{post.date}</span>
          <span
            className="size-1 rounded-full bg-zinc-300"
            aria-hidden="true"
          />
          <span>{post.readTime}</span>
        </div>
        <h3 className="text-base font-semibold tracking-tight text-zinc-900">
          {post.title}
        </h3>
        <p className="text-sm leading-7 text-zinc-600">{post.excerpt}</p>
        <div className="pt-1">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: ACCENT }}
          >
            Read article
            <IconArrow />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyCard() {
  return (
    <div className="grid place-items-center rounded-[22px] bg-white p-10 text-sm text-zinc-600 shadow-sm ring-1 ring-zinc-100">
      No blog posts yet. Publish your first post in the admin dashboard.
    </div>
  );
}

function Media({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}

function LogoMark({ inverted }: { inverted?: boolean }) {
  return (
    <div
      className={[
        "grid size-9 place-items-center rounded-xl",
        inverted ? "bg-white/10" : "bg-[rgba(242,85,93,0.12)]",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2 5.4 12 2l5.8 3.4v6.2L12 15 6.2 11.6V5.4Z"
          stroke={inverted ? "rgba(255,255,255,0.9)" : ACCENT}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7"
          stroke={inverted ? "rgba(255,255,255,0.9)" : ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/65">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="block text-sm text-white/80 hover:text-white">
      {children}
    </Link>
  );
}

function SocialIcon({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
    >
      {children}
    </Link>
  );
}

function IconArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 4h3l2 5-2 1c1 3 3 5 6 6l1-2 5 2v3c0 1.1-.9 2-2 2C10.8 21 3 13.2 3 4c0-1.1.9-2 2-2h2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 22s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9v12M6 5v.5M10 9v12m0-7c0-2 1.5-3.5 3.5-3.5S17 12 17 14v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
