import Link from "next/link";
import Image from "next/image";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectMongo } from "../../lib/mongodb";
import { Property } from "../../models/Property";
import { User } from "../../models/User";
import { pickHeroImage, pickPropertyImage } from "../../lib/unsplash";
import NewsletterForm from "../_components/NewsletterForm";
import WishlistButton from "../_components/WishlistButton";
import { parseSessionCookie } from "../auth/_lib/session";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const revalidate = 30;

function fallbackCoverUrl(slug: string) {
  return pickPropertyImage(slug);
}

function formatMoneyNGN(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
}

function cookieHeaderFromStore(store: Awaited<ReturnType<typeof cookies>>) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const pageNum = Math.max(1, Number(page ?? "1") || 1);
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  const filter: Record<string, unknown> = { status: "AVAILABLE" };
  if (query) {
    const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: safe, $options: "i" } },
      { city: { $regex: safe, $options: "i" } },
      { state: { $regex: safe, $options: "i" } },
    ];
  }

  let items: any[] = [];
  let total = 0;
  let dbError = false;
  try {
    await connectMongo();
    const res = await Promise.all([
      Property.find(filter, null, { sort: { createdAt: -1 }, limit, skip }).lean(),
      Property.countDocuments(filter),
    ]);
    items = res[0];
    total = res[1];
  } catch {
    dbError = true;
  }

  let wishSet = new Set<string>();
  try {
    const store = await cookies();
    const session = await parseSessionCookie(cookieHeaderFromStore(store));
    if (session?.role === "user" && mongoose.isValidObjectId(session.subject)) {
      await connectMongo();
      const user = await User.findById(session.subject, { wishlist: 1 }).lean();
      const raw = Array.isArray((user as any)?.wishlist) ? (user as any).wishlist : [];
      wishSet = new Set(raw.map((id: any) => String(id)).filter(Boolean));
    }
  } catch { }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const nextPage = pageNum < totalPages ? pageNum + 1 : null;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="relative overflow-hidden">
        <div className="relative h-[240px] w-full bg-zinc-200 sm:h-[320px]">
          <img
            src={pickHeroImage("properties-hero")}
            alt="Properties"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-x-0 top-0">
            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-10 lg:px-16">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-white">
                  <Image src="/logo/logo1.png" alt="HAY Property" width={140} height={72} />
                </Link>
                <nav className="hidden items-center gap-7 text-xs font-semibold text-white/85 md:flex">
                  <Link className="hover:text-white" href="/">
                    Home
                  </Link>
                  <Link className="hover:text-white" href="/about">
                    About
                  </Link>
                  <Link className="text-white" href="/properties">
                    Properties
                  </Link>
                  <Link className="hover:text-white" href="/blog">
                    Blog
                  </Link>
                  <Link className="hover:text-white" href="/contact">
                    Contact
                  </Link>
                </nav>
              </div>
              <div className="mt-10 max-w-2xl text-white">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Our Properties</h1>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Browse available listings with clear pricing, location and verified details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-10 sm:px-10 lg:px-16">
        <section className="flex flex-wrap items-center justify-between gap-4">
          <form className="flex w-full max-w-md items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm" action="/properties" method="GET">
            <IconSearch className="text-zinc-400" />
            <input
              name="q"
              defaultValue={query}
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
              placeholder="Search by title, city, or state"
            />
          </form>

          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
          >
            Book inspection
          </Link>
        </section>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-700">
            {dbError ? "Property service is temporarily unavailable. Please start MongoDB and refresh." : `No properties found${query ? ` for “${query}”.` : "."}`}
          </div>
        ) : (
          <section className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => {
              const id = String((p as any)._id ?? "");
              const slug = String((p as any).slug ?? "");
              const title = String((p as any).title ?? "");
              const city = String((p as any).city ?? "");
              const state = String((p as any).state ?? "");
              const location = [city, state].filter(Boolean).join(", ");
              const price = Number((p as any).price ?? 0);
              const coverUrl = String((p as any).images?.[0]?.url ?? "").trim() || fallbackCoverUrl(slug);

              return (
                <Link
                  key={String((p as any)._id)}
                  href={`/properties/${slug}`}
                  className="group overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-[16/11] bg-zinc-200">
                    <img
                      src={coverUrl}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/35 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                      AVAILABLE
                    </div>
                    {id ? (
                      <div className="absolute right-4 top-4">
                        <WishlistButton propertyId={id} initialActive={wishSet.has(id)} />
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="text-base font-semibold tracking-tight text-zinc-900">{title}</div>
                    <div className="text-sm text-zinc-600">{location || "—"}</div>
                    <div className="pt-1 text-sm font-semibold text-zinc-900">{formatMoneyNGN(price)}</div>
                    <div className="pt-2 text-sm font-semibold" style={{ color: ACCENT }}>
                      View details →
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}

        {nextPage ? (
          <div className="mt-12 flex justify-center">
            <Link
              href={{
                pathname: "/properties",
                query: { ...(query ? { q: query } : {}), page: String(nextPage) },
              }}
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-7 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-800 shadow-sm transition hover:border-zinc-300"
            >
              Load more
            </Link>
          </div>
        ) : null}
      </main>

      <footer className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="/logo/logo1.png" alt="HAY Property" width={140} height={72} />
            </div>
            <div className="text-sm text-white/75">© {new Date().getFullYear()} HAY Property</div>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <NewsletterForm source="footer-properties" className="w-full max-w-md" />
            <div className="flex items-center gap-4 text-xs text-white/70">
              <Link className="hover:text-white" href="/privacy-policy">
                Privacy policy
              </Link>
              <Link className="hover:text-white" href="/terms">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.2 21 21.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
