import Link from "next/link";
import type { Metadata } from "next";
import HeroCarousel from "./_components/HeroCarousel";
import { connectMongo } from "../lib/mongodb";
import {
  pickBlogImage,
  pickLandImage,
  pickPropertyImage,
} from "../lib/unsplash";
import { Blog } from "../models/Blog";
import { Property } from "../models/Property";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import CategoryPill from "./_components/home/CategoryPill";
import {
  PropertyCard,
  WidePropertyCard,
} from "./_components/home/PropertyCards";
import { Parallax, Reveal } from "./_components/Motion";
import { IconShield, IconSpark, IconStar } from "./_components/icons";
import Image from "next/image";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "HAY Property • Verified Land & Property Listings",
  description:
    "Explore verified land and property listings in Nigeria with transparent pricing, trusted documentation, and a support team from inquiry to allocation.",
  openGraph: {
    title: "HAY Property",
    description:
      "Explore verified land and property listings in Nigeria with transparent pricing, trusted documentation, and a support team from inquiry to allocation.",
    images: [
      {
        url: pickLandImage("og-home"),
        width: 1400,
        height: 800,
        alt: "HAY Property",
      },
    ],
    type: "website",
  },
};

function formatMoney(value: number, currency: string) {
  const safe = Number.isFinite(value) ? value : 0;
  const cur = currency || "NGN";
  return safe.toLocaleString(undefined, {
    style: "currency",
    currency: cur,
    maximumFractionDigits: 0,
  });
}

export default async function Home() {
  let latestProperties: any[] = [];
  let featuredProperties: any[] = [];
  let latestPosts: any[] = [];
  let dbError = false;

  try {
    await connectMongo();
    const res = await Promise.all([
      Property.find({ status: "AVAILABLE" }, null, {
        sort: { createdAt: -1 },
        limit: 6,
      }).lean(),
      Property.find({ status: "AVAILABLE" }, null, {
        sort: { createdAt: -1 },
        limit: 4,
      }).lean(),
      Blog.find({ published: true }, null, {
        sort: { publishedAt: -1, createdAt: -1 },
        limit: 3,
      }).lean(),
    ]);
    latestProperties = res[0];
    featuredProperties = res[1];
    latestPosts = res[2];
  } catch {
    dbError = true;
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HAY Property",
    url: "https://hayproperty.com",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HAY Property",
    url: "https://hayproperty.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://hayproperty.com/properties?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd)}
      </script>
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="pb-16">
          <Reveal>
            <section className="relative">
              <HeroCarousel accent={ACCENT} />

              <div className="absolute -bottom-10 right-6 hidden w-[260px] rounded-2xl bg-white px-4 py-4 shadow-lg shadow-black/10 sm:block">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-500">
                      Trust score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-semibold leading-none">
                        4.95
                      </div>
                      <div className="flex items-center gap-0.5">
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.12)]">
                    <IconShield accent={ACCENT} />
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={80}>
            <section id="latest" className="mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Latest property
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Latest listings
                  </h2>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: ACCENT }}
                  >
                    4.95
                  </div>
                  <div className="flex items-center gap-0.5">
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                  </div>
                  <div className="text-xs font-semibold text-zinc-500">
                    100%
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Real estate investments shouldn’t feel complicated. Explore
                  vetted land opportunities with clear pricing, verified
                  locations, and the documentation you need to buy with
                  confidence.
                </p>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl bg-[rgba(242,85,93,0.12)]">
                        <IconSpark accent={ACCENT} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Verified documents
                        </div>
                        <div className="text-xs text-zinc-500">
                          Purchase-ready listings
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      New
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestProperties.length > 0
                  ? latestProperties.slice(0, 3).map((p) => {
                      const id = String((p as any)._id ?? "");
                      const slug = String((p as any).slug ?? "");
                      const title = String((p as any).title ?? "");
                      const city = String((p as any).city ?? "");
                      const state = String((p as any).state ?? "");
                      const location = [city, state].filter(Boolean).join(", ");
                      const coverUrl =
                        String((p as any).images?.[0]?.url ?? "").trim() ||
                        pickPropertyImage(slug);
                      const price = formatMoney(
                        Number((p as any).price ?? 0),
                        String((p as any).currency ?? "NGN"),
                      );
                      return (
                        <div key={id} className="relative">
                          <PropertyCard
                            title={title}
                            location={location || "—"}
                            price={price}
                            showBrand
                            imageUrl={coverUrl}
                            accent={ACCENT}
                            href={slug ? `/properties/${slug}` : "/properties"}
                          />
                        </div>
                      );
                    })
                  : [
                      <PropertyCard
                        key="fallback-a"
                        title="Pride Rock Estate"
                        location="Ibeju-Lekki, Lagos"
                        price={formatMoney(12750000, "NGN")}
                        showBrand
                        imageUrl={pickPropertyImage("home-pride-rock")}
                        accent={ACCENT}
                        href="/properties"
                      />,
                      <PropertyCard
                        key="fallback-b"
                        title="Emerald Gardens Residence"
                        location="Lekki, Lagos"
                        price={formatMoney(38500000, "NGN")}
                        imageUrl={pickPropertyImage("home-emerald")}
                        accent={ACCENT}
                        href="/properties"
                      />,
                      <PropertyCard
                        key="fallback-c"
                        title="Cedarview Apartments"
                        location="Wuse 2, Abuja"
                        price={formatMoney(22000000, "NGN")}
                        imageUrl={pickPropertyImage("home-cedarview")}
                        accent={ACCENT}
                        href="/properties"
                      />,
                    ]}
              </div>
              {dbError ? (
                <div className="mt-6 text-xs text-zinc-500">
                  Live listings are temporarily unavailable. Showing featured
                  examples.
                </div>
              ) : null}
            </section>
          </Reveal>

          <Reveal delayMs={120}>
            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Property Category
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Find property by category
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
                    <CategoryPill href="/properties" active accent={ACCENT}>
                      All
                    </CategoryPill>
                    <CategoryPill
                      href={{ pathname: "/properties", query: { q: "land" } }}
                      accent={ACCENT}
                    >
                      Land
                    </CategoryPill>
                    <CategoryPill
                      href={{ pathname: "/properties", query: { q: "estate" } }}
                      accent={ACCENT}
                    >
                      Estate
                    </CategoryPill>
                    <CategoryPill
                      href={{ pathname: "/properties", query: { q: "house" } }}
                      accent={ACCENT}
                    >
                      Housing
                    </CategoryPill>
                  </div>

                  <Link
                    href="/properties"
                    className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                    }}
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {(featuredProperties.length > 0
                  ? featuredProperties
                  : latestProperties
                )
                  .slice(0, 4)
                  .map((p, idx) => {
                    const id = String((p as any)._id ?? `fallback_${idx}`);
                    const slug = String((p as any).slug ?? "");
                    const title = String((p as any).title ?? "Property");
                    const city = String((p as any).city ?? "");
                    const state = String((p as any).state ?? "");
                    const location = [city, state].filter(Boolean).join(", ");
                    const coverUrl =
                      String((p as any).images?.[0]?.url ?? "").trim() ||
                      pickPropertyImage(slug || `home-wide-${idx}`);
                    const price = formatMoney(
                      Number((p as any).price ?? 0),
                      String((p as any).currency ?? "NGN"),
                    );
                    return (
                      <WidePropertyCard
                        key={id}
                        title={title}
                        location={location || "—"}
                        price={price}
                        imageUrl={coverUrl}
                        accent={ACCENT}
                        href={slug ? `/properties/${slug}` : "/properties"}
                      />
                    );
                  })}
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={160}>
            <section className="relative mt-16 overflow-hidden rounded-[28px] bg-[#f6f0dd] shadow-sm">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Ready to own land
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                    Ready to Own Land
                    <br />
                    That Works for You
                  </h2>
                  <p className="max-w-md text-sm leading-7 text-zinc-600 sm:text-base">
                    Start your journey with curated plots, transparent pricing,
                    and a support team that stays with you from inquiry to
                    allocation.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/properties"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{
                        backgroundColor: ACCENT,
                        boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                      }}
                    >
                      Get started
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 -top-10 size-48 rounded-full bg-[rgba(242,85,93,0.12)] blur-2xl" />
                  <div className="absolute -bottom-14 -right-14 size-60 rounded-full bg-amber-400/10 blur-2xl" />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[radial-gradient(900px_500px_at_40%_40%,rgba(0,0,0,0.08),transparent),radial-gradient(900px_500px_at_90%_70%,rgba(0,0,0,0.06),transparent)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 via-transparent to-transparent" />
                    <Parallax className="absolute inset-0" strength={18}>
                      <Image
                        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80"
                        alt="Land"
                        width={1400}
                        height={933}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </Parallax>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={220}>
            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Insights
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Latest from the blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                >
                  View all posts
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {(latestPosts.length ? latestPosts : []).map((b) => {
                  const id = String((b as any)._id ?? "");
                  const slug = String((b as any).slug ?? "");
                  const title = String((b as any).title ?? "");
                  const category = String((b as any).category ?? "");
                  const excerpt = String((b as any).excerpt ?? "");
                  const cover =
                    String((b as any).coverUrl ?? "").trim() ||
                    pickBlogImage(slug);
                  return (
                    <Link
                      key={id}
                      href={slug ? `/blog/${slug}` : "/blog"}
                      className="group overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] bg-zinc-200">
                        <Image
                          src={cover}
                          alt={title}
                          fill
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-70" />
                        {category ? (
                          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                            {category}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-2 p-5">
                        <div className="text-base font-semibold tracking-tight text-zinc-900">
                          {title}
                        </div>
                        <div className="text-sm leading-7 text-zinc-600 line-clamp-3">
                          {excerpt}
                        </div>
                        <div
                          className="pt-1 text-sm font-semibold"
                          style={{ color: ACCENT }}
                        >
                          Read more →
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {latestPosts.length === 0 ? (
                  <div className="md:col-span-3 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
                    No blog posts yet. Publish your first post in the admin to
                    show it here.
                  </div>
                ) : null}
              </div>
            </section>
          </Reveal>
        </main>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}
