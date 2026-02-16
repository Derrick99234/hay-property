import Link from "next/link";
import HeroCarousel from "./_components/HeroCarousel";
import { pickLandImage, pickPropertyImage } from "../lib/unsplash";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";
import CategoryPill from "./_components/home/CategoryPill";
import { PropertyCard, WidePropertyCard } from "./_components/home/PropertyCards";
import { IconShield, IconSpark, IconStar } from "./_components/icons";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="pb-16">
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

          <section id="latest" className="mt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Latest property
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Latest property: Harvest Grove
                </h2>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm">
                <div className="text-sm font-semibold" style={{ color: ACCENT }}>
                  4.95
                </div>
                <div className="flex items-center gap-0.5">
                  <IconStar style={{ color: ACCENT }} />
                  <IconStar style={{ color: ACCENT }} />
                  <IconStar style={{ color: ACCENT }} />
                  <IconStar style={{ color: ACCENT }} />
                  <IconStar style={{ color: ACCENT }} />
                </div>
                <div className="text-xs font-semibold text-zinc-500">100%</div>
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
              <PropertyCard
                title="Sekemangni village"
                location="Ibeju-Lekki, Lagos"
                price="$963.85"
                showBrand
                imageUrl={pickPropertyImage("home-sekemangni")}
                accent={ACCENT}
              />
              <PropertyCard
                title="Isewupine house savings"
                location="Epe, Lagos"
                price="$576.29"
                imageUrl={pickPropertyImage("home-isewupine-house")}
                accent={ACCENT}
              />
              <PropertyCard
                title="Isewupine village"
                location="Ibeju-Lekki, Lagos"
                price="$418.55"
                imageUrl={pickPropertyImage("home-isewupine-village")}
                accent={ACCENT}
              />
            </div>
          </section>

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
                  <CategoryPill href={{ pathname: "/properties", query: { q: "land" } }} accent={ACCENT}>
                    Land
                  </CategoryPill>
                  <CategoryPill href={{ pathname: "/properties", query: { q: "estate" } }} accent={ACCENT}>
                    Estate
                  </CategoryPill>
                  <CategoryPill href={{ pathname: "/properties", query: { q: "house" } }} accent={ACCENT}>
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
              <WidePropertyCard
                title="Pride Rock"
                location="Epe, Lagos"
                price="$943.65"
                imageUrl={pickPropertyImage("home-pride-rock")}
                accent={ACCENT}
              />
              <WidePropertyCard
                title="Iro Phase II"
                location="Ibeju-Lekki, Lagos"
                price="$813.65"
                imageUrl={pickPropertyImage("home-iro-phase-2")}
                accent={ACCENT}
              />
              <WidePropertyCard
                title="Yati Femmex"
                location="Epe, Lagos"
                price="$943.35"
                imageUrl={pickPropertyImage("home-yati-femmex")}
                accent={ACCENT}
              />
              <WidePropertyCard
                title="Property house"
                location="Ibeju-Lekki, Lagos"
                price="$943.65"
                imageUrl={pickPropertyImage("home-property-house")}
                accent={ACCENT}
              />
            </div>
          </section>

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
                      boxShadow:
                        "0 14px 28px -18px rgba(242,85,93,0.85)",
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
                  <img
                    src={pickLandImage("home-land")}
                    alt="Land"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}
