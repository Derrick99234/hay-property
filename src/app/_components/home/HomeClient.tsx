"use client";

import HeroCarousel from "../HeroCarousel";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import CategoryPill from "./CategoryPill";
import { PropertyCard, WidePropertyCard } from "./PropertyCards";
import {
  HoverLift,
  ImageReveal,
  InView,
  Parallax,
  Reveal,
  Stagger,
} from "../Motion";
import { IconArrowUpRight, IconPin, IconSpark } from "../icons";
import Image from "next/image";
import FaqAccordion, { type FaqItem } from "../FaqAccordion";
import Link from "next/link";
import FlyerPortfolioSection, {
  type FlyerPortfolioItem,
} from "./FlyerPortfolioSection";

export type HomePropertyCard = {
  id: string;
  href: string;
  title: string;
  location: string;
  price: string;
  imageUrl?: string;
  showBrand?: boolean;
};

export type HomeBlogCard = {
  id: string;
  href: string;
  title: string;
  category: string;
  excerpt: string;
  coverUrl?: string;
};

const FLYERS: FlyerPortfolioItem[] = [
  {
    id: "harvest-grove-acre-hectares",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/Acre%20and%20Hectares.jpeg",
    badge: "Acre & hectares",
    name: "Harvest Grove",
    title: "Farm 33 initiative",
    primaryPrice: "₦4.5M / acre",
    deposit: "₦500K",
    priceLines: ["1 acre: ₦4.5M", "1 hectare: ₦11.196M"],
    highlights: ["Oil palm", "Developed by HAY Property Ltd."],
    propertyHref: "/properties/harvest-grove-agro-estate",
  },
  {
    id: "greenfield-discount",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/GREENFIELD%20DISCOUNT%20SALES.jpeg",
    badge: "Discount sales",
    name: "Greenfield",
    location: "Omu-Epe, Lagos",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦9.22M (300sqm)",
    deposit: "₦2M",
    priceLines: ["300sqm: ₦9.72M → ₦9.22M", "500sqm: ₦16.2M → ₦15.7M"],
    highlights: ["Limited-time deal", "Flexible payment option available"],
    propertyHref: "/properties/greenfield-estate",
  },
  {
    id: "greenfield",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/GREENFIELD.jpeg",
    badge: "New listing",
    name: "Greenfield",
    location: "Omu-Epe, Lagos",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦1.62M (300sqm)",
    deposit: "₦300K",
    priceLines: ["300sqm: ₦1.62M", "500sqm: ₦2.5M"],
    highlights: ["Accessible location", "Verified documentation"],
    propertyHref: "/properties/greenfield-estate",
  },
  {
    id: "hg-intro",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/HG.jpeg",
    badge: "Introducing",
    name: "Harvest Grove",
    highlights: ["Developed by HAY Property Ltd.", "An initiative by Farm 33"],
    propertyHref: "/properties/harvest-grove-agro-estate",
  },
  {
    id: "ireti-phase-2",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/IRETI%20NEW%20PRICE.jpeg",
    badge: "New price",
    name: "Ireti Residence (Phase 2)",
    location: "Imota, Ikorodu",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦1.5M (300sqm)",
    deposit: "₦300K",
    priceLines: ["300sqm: ₦1.5M", "500sqm: ₦2.5M"],
    highlights: ["Secure investment option", "Flexible payment plan"],
    propertyHref: "/properties/ireti-residence-phase-i",
  },
  {
    id: "northern-park",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/NORTHERN%20PARK.jpeg",
    badge: "Phase II",
    name: "Northernpark (Phase II)",
    location: "Araga, Epe",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦4.2M (300sqm)",
    deposit: "₦500K",
    priceLines: ["300sqm: ₦4.2M", "500sqm: ₦7M"],
    highlights: ["High growth potential", "Verified documentation"],
    propertyHref: "/properties/northern-park-phase-ii-2",
  },
  {
    id: "pride-rock",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/PRICE%20ROCK.jpeg",
    badge: "Ibadan",
    name: "Pride Rock",
    location: "Moniya–Iseyin Expressway, Ibadan",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦897K (300sqm)",
    deposit: "₦300K",
    priceLines: [
      "300sqm: ₦897K",
      "500sqm: ₦1.040M",
      "1 acre: ₦5.096M",
      "2 acres: ₦7.914M",
    ],
    highlights: ["Flexible payment plan", "Instant allocation (terms apply)"],
    propertyHref: "/properties/pride-rock-estate",
  },
  {
    id: "harvest-grove-plots",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/Plots.jpeg",
    badge: "Co-own an acre",
    name: "Harvest Grove",
    primaryPrice: "₦750K (1 plot)",
    deposit: "₦200K",
    priceLines: ["1 plot: ₦750K"],
    highlights: ["Oil palm", "Developed by HAY Property Ltd."],
    propertyHref: "/properties/harvest-grove-agro-estate",
  },
  {
    id: "northern-park-discount",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/flyers/SALES%20DISCOUNT%20NORTHERN%20PARK.jpeg",
    badge: "Discount sales",
    name: "Northernpark (Phase II)",
    location: "Araga, Epe",
    title: "Freehold (C of O in view)",
    primaryPrice: "₦24.5M (300sqm)",
    deposit: "₦5M",
    priceLines: ["300sqm: ₦25.2M → ₦24.5M", "500sqm: ₦42M → ₦41.5M"],
    highlights: ["Limited-time deal", "Verified documentation"],
    propertyHref: "/properties/northern-park-phase-ii-2",
  },
];

export default function HomeClient(props: {
  accent: string;
  navy: string;
  aboutImage: string;
  dbError: boolean;
  latestCards: HomePropertyCard[];
  featuredWideCards: HomePropertyCard[];
  blogCards: HomeBlogCard[];
  faqItems: FaqItem[];
}) {
  const { accent: ACCENT, navy: NAVY, aboutImage: ABOUT_IMAGE } = props;

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />
      </div>

      <main className="pb-16">
        <Reveal>
          <section className="relative px-0 sm:px-0">
            <HeroCarousel accent={ACCENT} />
          </section>
        </Reveal>

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-10 lg:px-16">
          {/* 
          <Reveal delayMs={60}>
            <section id="about" className="mt-14 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-100">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_520px] lg:items-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <InView from="up">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">About HAY Property</p>
                    </InView>
                    <InView from="up" delayMs={70}>
                      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                        Verified listings, clear documentation, trusted delivery
                      </h2>
                    </InView>
                    <InView from="up" delayMs={120}>
                      <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                        HAY Property helps you buy land and property in Nigeria with confidence. Every listing is presented
                        with transparent pricing, verified documentation, and a team that supports you from inquiry to
                        allocation.
                      </p>
                    </InView>
                  </div>

                  <Stagger className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Verified</div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">Documentation-first</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Transparent</div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">Clear pricing & terms</div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Support</div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">From inquiry to allocation</div>
                    </div>
                  </Stagger>

                  <InView from="up" delayMs={140}>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link
                        href="/about"
                        className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                      >
                        Read our story
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                      >
                        Contact us
                      </Link>
                    </div>
                  </InView>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 -top-10 size-48 rounded-full bg-[rgba(242,85,93,0.12)] blur-2xl" />
                  <div className="absolute -bottom-14 -right-14 size-60 rounded-full bg-[rgba(29,43,86,0.12)] blur-2xl" />
                  <ImageReveal className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-zinc-200" direction="left" delayMs={120}>
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
                    <Parallax className="absolute inset-0" strength={14}>
                      <Image src={ABOUT_IMAGE} alt="HAY Property team" width={1600} height={900} className="h-full w-full object-cover" loading="lazy" />
                    </Parallax>
                  </ImageReveal>
                </div>
              </div>
            </section>
          </Reveal> */}

          {/* <Reveal delayMs={80}>
            <section className="mt-16 overflow-hidden rounded-[28px] bg-zinc-50 shadow-sm ring-1 ring-zinc-100">
              <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(900px_560px_at_15%_20%,rgba(242,85,93,0.10),transparent),radial-gradient(900px_560px_at_85%_35%,rgba(29,43,86,0.10),transparent),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.85))]" />
                <div className="relative space-y-8 p-8 sm:p-12">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                      <InView from="up">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Why HAY Property</p>
                      </InView>
                      <InView from="up" delayMs={70}>
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Confidence you can verify</h2>
                      </InView>
                      <InView from="up" delayMs={120}>
                        <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                          Built for buyers who want clarity: verified documentation, secure processes, flexible terms, and a team that stays with you end-to-end.
                        </p>
                      </InView>
                    </div>
                    <InView from="up" delayMs={140}>
                      <Link
                        href="/about"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                      >
                        Learn more <span className="ml-2" aria-hidden="true"><IconArrowUpRight /></span>
                      </Link>
                    </InView>
                  </div>

                  <div className="sm:hidden">
                    <div className="-mx-8 overflow-x-auto px-8 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="flex w-max snap-x snap-mandatory items-stretch gap-4 pr-4">
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.10)]" style={{ color: ACCENT }}>
                              <IconShield accent={ACCENT} />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">Verified documentation</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">Clear paperwork and transparent disclosures so you understand what you’re buying.</div>
                          </div>
                        </div>
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(29,43,86,0.10)]" style={{ color: NAVY }}>
                              <IconShield accent={NAVY} />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">Secure investment option</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">A process designed for confidence: verification, support, and clear next steps.</div>
                          </div>
                        </div>
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100" style={{ color: ACCENT }}>
                              <IconSpark accent={ACCENT} />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">Flexible payment plan</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">Installment options vary by listing. Request info to see available plans and terms.</div>
                          </div>
                        </div>
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                              <IconArrowUpRight />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">Instant allocation (terms apply)</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">Where available, allocation is delivered based on the project’s stated requirements.</div>
                          </div>
                        </div>
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                              <IconPin className="text-zinc-800" />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">Accessible locations</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">Listings prioritize practical access and growth corridors, depending on the project.</div>
                          </div>
                        </div>
                        <div className="w-[280px] shrink-0 snap-start">
                          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                            <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(34,197,94,0.10)] text-emerald-700 ring-1 ring-emerald-100">
                              <IconStar className="text-emerald-700" />
                            </div>
                            <div className="mt-4 text-sm font-semibold text-zinc-900">High growth potential</div>
                            <div className="mt-2 text-sm leading-7 text-zinc-600">Curated opportunities positioned for long-term value based on location dynamics.</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.10)]" style={{ color: ACCENT }}>
                          <IconShield accent={ACCENT} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Verified documentation</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">Clear paperwork and transparent disclosures so you understand what you’re buying.</div>
                      </HoverLift>
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(29,43,86,0.10)]" style={{ color: NAVY }}>
                          <IconShield accent={NAVY} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Secure investment option</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">A process designed for confidence: verification, support, and clear next steps.</div>
                      </HoverLift>
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100" style={{ color: ACCENT }}>
                          <IconSpark accent={ACCENT} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Flexible payment plan</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">Installment options vary by listing. Request info to see available plans and terms.</div>
                      </HoverLift>
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                          <IconArrowUpRight />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Instant allocation (terms apply)</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">Where available, allocation is delivered based on the project’s stated requirements.</div>
                      </HoverLift>
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                          <IconPin className="text-zinc-800" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Accessible locations</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">Listings prioritize practical access and growth corridors, depending on the project.</div>
                      </HoverLift>
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(34,197,94,0.10)] text-emerald-700 ring-1 ring-emerald-100">
                          <IconStar className="text-emerald-700" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">High growth potential</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">Curated opportunities positioned for long-term value based on location dynamics.</div>
                      </HoverLift>
                    </Stagger>
                  </div>
                </div>
              </div>
            </section>
          </Reveal> */}

          <Reveal delayMs={95}>
            <FlyerPortfolioSection accent={ACCENT} items={FLYERS} />
          </Reveal>

          {/* <Reveal delayMs={110}>
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

              <div className="mt-10 sm:hidden">
                <div className="-mx-5 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max snap-x snap-mandatory items-stretch gap-4 pr-4">
                    {props.latestCards.map((c) => (
                      <div key={c.id} className="w-[300px] shrink-0 snap-start">
                        <PropertyCard
                          title={c.title}
                          location={c.location}
                          price={c.price}
                          showBrand
                          imageUrl={c.imageUrl}
                          accent={ACCENT}
                          href={c.href}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block">
                <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {props.latestCards.slice(0, 3).map((c) => (
                    <HoverLift key={c.id} className="relative">
                      <PropertyCard
                        title={c.title}
                        location={c.location}
                        price={c.price}
                        showBrand
                        imageUrl={c.imageUrl}
                        accent={ACCENT}
                        href={c.href}
                      />
                    </HoverLift>
                  ))}
                </Stagger>
              </div>

              {props.dbError ? (
                <div className="mt-6 text-xs text-zinc-500">
                  Live listings are temporarily unavailable. Showing featured
                  examples.
                </div>
              ) : null}
            </section>
          </Reveal> */}

          {/* <Reveal delayMs={120}>
            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Property Category</p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Find property by category</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
                    <CategoryPill href="/properties" active accent={ACCENT}>All</CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "land" } }} accent={ACCENT}>Land</CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "estate" } }} accent={ACCENT}>Estate</CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "house" } }} accent={ACCENT}>Housing</CategoryPill>
                  </div>

                  <Link
                    href="/properties"
                    className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                  >
                    View all
                  </Link>
                </div>
              </div>

              <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
                {props.featuredWideCards.slice(-2).map((c) => (
                  <HoverLift key={c.id}>
                    <WidePropertyCard title={c.title} location={c.location} price={c.price} imageUrl={c.imageUrl} accent={ACCENT} href={c.href} />
                  </HoverLift>
                ))}
              </Stagger>
            </section>
          </Reveal> */}

          {/* <Reveal delayMs={160}>
            <section className="relative mt-16 overflow-hidden rounded-[28px] bg-[#f6f0dd] shadow-sm">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-5">
                  <InView from="up">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Ready to own land
                    </p>
                  </InView>
                  <InView from="up" delayMs={70}>
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                      Ready to Own Land
                      <br />
                      That Works for You
                    </h2>
                  </InView>
                  <InView from="up" delayMs={120}>
                    <p className="max-w-md text-sm leading-7 text-zinc-600 sm:text-base">
                      Start your journey with curated plots, transparent
                      pricing, and a support team that stays with you from
                      inquiry to allocation.
                    </p>
                  </InView>
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
                  <ImageReveal
                    className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[radial-gradient(900px_500px_at_40%_40%,rgba(0,0,0,0.08),transparent),radial-gradient(900px_500px_at_90%_70%,rgba(0,0,0,0.06),transparent)]"
                    direction="right"
                    delayMs={90}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 via-transparent to-transparent" />
                    <Parallax className="absolute inset-0" strength={18}>
                      <Image
                        src={
                          "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/pages-image/ready%20to%20own%20land.jpg"
                        }
                        alt="Land"
                        width={1400}
                        height={933}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Parallax>
                  </ImageReveal>
                </div>
              </div>
            </section>
          </Reveal> */}

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

              <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
                {props.blogCards.map((b) => (
                  <HoverLift key={b.id}>
                    <Link
                      href={b.href}
                      className="group block overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-zinc-100 transition hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] bg-zinc-200">
                        {b.coverUrl ? (
                          <Image
                            src={b.coverUrl}
                            alt={b.title}
                            fill
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-70" />
                        {b.category ? (
                          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
                            {b.category}
                          </div>
                        ) : null}
                      </div>
                      <div className="space-y-2 p-5">
                        <div className="text-base font-semibold tracking-tight text-zinc-900">
                          {b.title}
                        </div>
                        <div className="text-sm leading-7 text-zinc-600 line-clamp-3">
                          {b.excerpt}
                        </div>
                        <div
                          className="pt-1 text-sm font-semibold"
                          style={{ color: ACCENT }}
                        >
                          Read more →
                        </div>
                      </div>
                    </Link>
                  </HoverLift>
                ))}

                {props.blogCards.length === 0 ? (
                  <div className="md:col-span-3 rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700">
                    No blog posts yet. Publish your first post in the admin to
                    show it here.
                  </div>
                ) : null}
              </Stagger>
            </section>
          </Reveal>

          {/* <Reveal delayMs={260}>
            <section className="mt-16 overflow-hidden rounded-[28px] bg-zinc-50 shadow-sm ring-1 ring-zinc-100">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_420px] lg:items-start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      FAQs
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                      Answers to common questions
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                      Get clarity on inspections, documentation, payment plans,
                      and allocation.
                    </p>
                  </div>
                  <FaqAccordion items={props.faqItems} accent={ACCENT} />
                </div>

                <div className="space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                  <div className="text-sm font-semibold text-zinc-900">
                    Still have questions?
                  </div>
                  <div className="text-sm leading-7 text-zinc-600">
                    Visit the full FAQs page or open any property to book an
                    inspection or request more information.
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href="/faqs"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{
                        backgroundColor: ACCENT,
                        boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                      }}
                    >
                      View FAQs
                    </Link>
                    <Link
                      href="/properties"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                    >
                      Browse properties
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </Reveal> */}
        </div>
      </main>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}
