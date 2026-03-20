import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import HeroCarousel from "./_components/HeroCarousel";
import { connectMongo } from "../lib/mongodb";
import {
  pickBlogImage,
  pickLandImage,
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
import AutoMarquee from "./_components/AutoMarquee";
import { Float, HoverLift, ImageReveal, InView, Parallax, Reveal, Stagger } from "./_components/Motion";
import { IconArrowUpRight, IconPin, IconShield, IconSpark, IconStar } from "./_components/icons";
import Image from "next/image";
import FaqAccordion, { type FaqItem } from "./_components/FaqAccordion";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";
const ABOUT_IMAGE = "/hay property about page.jpg";

const FAQS: FaqItem[] = [
  {
    question: "Are your properties verified?",
    answer:
      "Yes. We prioritize verified documentation and clear disclosures. If you need a specific document confirmation for a listing, request it via the inspection/info form.",
  },
  {
    question: "How do I book an inspection?",
    answer:
      "Open any property and use the “Book an inspection” tab. Submit your preferred date/time and your contact details, and our team will reach out to confirm.",
  },
  {
    question: "Do you offer installment payment plans?",
    answer:
      "Some listings support flexible payment plans depending on the project. Use “Request info” on the property to get the available plans and terms for that listing.",
  },
  {
    question: "When do I get allocation?",
    answer:
      "Allocation depends on the listing terms and project stage. When allocation is instant, it’s subject to meeting the stated requirements and documentation.",
  },
  {
    question: "Can I request documentation before payment?",
    answer:
      "Yes. Use “Request info” to ask for the documentation summary for a property and what you need to complete next steps.",
  },
];

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
    featuredProperties = res[0];
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
      <Script
        id="jsonld-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Script
        id="jsonld-website"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="pb-16">
          <Reveal>
            <section className="relative">
              <HeroCarousel accent={ACCENT} />

              <Float
                className="absolute -bottom-10 right-6 hidden w-[260px] rounded-2xl bg-white px-4 py-4 shadow-lg shadow-black/10 sm:block"
                amplitude={6}
                duration={6.5}
                delay={0.15}
              >
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
              </Float>
            </section>
          </Reveal>

          <Reveal delayMs={60}>
            <section
              id="about"
              className="mt-14 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-100"
            >
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_520px] lg:items-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <InView from="up">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        About HAY Property
                      </p>
                    </InView>
                    <InView from="up" delayMs={70}>
                      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                        Verified listings, clear documentation, trusted delivery
                      </h2>
                    </InView>
                    <InView from="up" delayMs={120}>
                      <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                        HAY Property helps you buy land and property in Nigeria
                        with confidence. Every listing is presented with
                        transparent pricing, verified documentation, and a team
                        that supports you from inquiry to allocation.
                      </p>
                    </InView>
                  </div>

                  <Stagger className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Verified
                      </div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">
                        Documentation-first
                      </div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Transparent
                      </div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">
                        Clear pricing & terms
                      </div>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
                      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Support
                      </div>
                      <div className="mt-2 text-sm font-semibold text-zinc-900">
                        From inquiry to allocation
                      </div>
                    </div>
                  </Stagger>

                  <InView from="up" delayMs={140}>
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <Link
                        href="/about"
                        className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        style={{
                          backgroundColor: ACCENT,
                          boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                        }}
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
                      <Image
                        src={ABOUT_IMAGE}
                        alt="HAY Property team"
                        width={1600}
                        height={900}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Parallax>
                  </ImageReveal>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={80}>
            <section className="mt-16 overflow-hidden rounded-[28px] bg-zinc-50 shadow-sm ring-1 ring-zinc-100">
              <div className="relative">
                <div className="absolute inset-0 bg-[radial-gradient(900px_560px_at_15%_20%,rgba(242,85,93,0.10),transparent),radial-gradient(900px_560px_at_85%_35%,rgba(29,43,86,0.10),transparent),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.85))]" />
                <div className="relative space-y-8 p-8 sm:p-12">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-2">
                      <InView from="up">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Why HAY Property
                        </p>
                      </InView>
                      <InView from="up" delayMs={70}>
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                          Confidence you can verify
                        </h2>
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
                    <AutoMarquee className="-mx-8 px-8 py-1" speed={0.55}>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.10)]" style={{ color: ACCENT }}>
                            <IconShield accent={ACCENT} />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">Verified documentation</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            Clear paperwork and transparent disclosures so you understand what you’re buying.
                          </div>
                        </div>
                      </div>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(29,43,86,0.10)]" style={{ color: NAVY }}>
                            <IconShield accent={NAVY} />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">Secure investment option</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            A process designed for confidence: verification, support, and clear next steps.
                          </div>
                        </div>
                      </div>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100" style={{ color: ACCENT }}>
                            <IconSpark accent={ACCENT} />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">Flexible payment plan</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            Installment options vary by listing. Request info to see available plans and terms.
                          </div>
                        </div>
                      </div>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                            <IconArrowUpRight />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">Instant allocation (terms apply)</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            Where available, allocation is delivered based on the project’s stated requirements.
                          </div>
                        </div>
                      </div>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                            <IconPin className="text-zinc-800" />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">Accessible locations</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            Listings prioritize practical access and growth corridors, depending on the project.
                          </div>
                        </div>
                      </div>
                      <div className="w-[280px]">
                        <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                          <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(34,197,94,0.10)] text-emerald-700 ring-1 ring-emerald-100">
                            <IconStar className="text-emerald-700" />
                          </div>
                          <div className="mt-4 text-sm font-semibold text-zinc-900">High growth potential</div>
                          <div className="mt-2 text-sm leading-7 text-zinc-600">
                            Curated opportunities positioned for long-term value based on location dynamics.
                          </div>
                        </div>
                      </div>
                    </AutoMarquee>
                  </div>

                  <div className="hidden sm:block">
                    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.10)]" style={{ color: ACCENT }}>
                          <IconShield accent={ACCENT} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Verified documentation</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          Clear paperwork and transparent disclosures so you understand what you’re buying.
                        </div>
                      </HoverLift>

                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(29,43,86,0.10)]" style={{ color: NAVY }}>
                          <IconShield accent={NAVY} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Secure investment option</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          A process designed for confidence: verification, support, and clear next steps.
                        </div>
                      </HoverLift>

                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100" style={{ color: ACCENT }}>
                          <IconSpark accent={ACCENT} />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Flexible payment plan</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          Installment options vary by listing. Request info to see available plans and terms.
                        </div>
                      </HoverLift>

                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                          <IconArrowUpRight />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Instant allocation (terms apply)</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          Where available, allocation is delivered based on the project’s stated requirements.
                        </div>
                      </HoverLift>

                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100 text-zinc-800">
                          <IconPin className="text-zinc-800" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">Accessible locations</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          Listings prioritize practical access and growth corridors, depending on the project.
                        </div>
                      </HoverLift>

                      <HoverLift className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                        <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(34,197,94,0.10)] text-emerald-700 ring-1 ring-emerald-100">
                          <IconStar className="text-emerald-700" />
                        </div>
                        <div className="mt-4 text-sm font-semibold text-zinc-900">High growth potential</div>
                        <div className="mt-2 text-sm leading-7 text-zinc-600">
                          Curated opportunities positioned for long-term value based on location dynamics.
                        </div>
                      </HoverLift>
                    </Stagger>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={110}>
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
                <AutoMarquee className="-mx-5 px-5 py-1" speed={0.65}>
                  {(latestProperties.length > 0
                    ? latestProperties.slice(0, 6)
                    : [
                        { title: "Pride Rock Estate", location: "Ibeju-Lekki, Lagos", price: formatMoney(12750000, "NGN") },
                        { title: "Emerald Gardens Residence", location: "Lekki, Lagos", price: formatMoney(38500000, "NGN") },
                        { title: "Cedarview Apartments", location: "Wuse 2, Abuja", price: formatMoney(22000000, "NGN") },
                      ]
                  ).map((p: any, idx: number) => {
                    const id = String(p?._id ?? `m_${idx}`);
                    const slug = String(p?.slug ?? "");
                    const title = String(p?.title ?? "Property");
                    const city = String(p?.city ?? "");
                    const state = String(p?.state ?? "");
                    const location = String(p?.location ?? "") || [city, state].filter(Boolean).join(", ") || "—";
                    const coverUrl = String(p?.images?.[0]?.url ?? "").trim() || undefined;
                    const price = typeof p?.price === "string" ? p.price : formatMoney(Number(p?.price ?? 0), String(p?.currency ?? "NGN"));
                    return (
                      <div key={id} className="w-[300px]">
                        <PropertyCard
                          title={title}
                          location={location}
                          price={price}
                          showBrand
                          imageUrl={coverUrl}
                          accent={ACCENT}
                          href={slug ? `/properties/${slug}` : "/properties"}
                        />
                      </div>
                    );
                  })}
                </AutoMarquee>
              </div>

              <div className="hidden sm:block">
                <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latestProperties.length > 0
                    ? latestProperties.slice(0, 3).map((p) => {
                      const id = String((p as any)._id ?? "");
                      const slug = String((p as any).slug ?? "");
                      const title = String((p as any).title ?? "");
                      const city = String((p as any).city ?? "");
                      const state = String((p as any).state ?? "");
                      const location = [city, state].filter(Boolean).join(", ");
                      const coverUrl = String((p as any).images?.[0]?.url ?? "").trim() || undefined;
                      const price = formatMoney(
                        Number((p as any).price ?? 0),
                        String((p as any).currency ?? "NGN"),
                      );
                      return (
                        <HoverLift key={id} className="relative">
                          <PropertyCard
                            title={title}
                            location={location || "—"}
                            price={price}
                            showBrand
                            imageUrl={coverUrl}
                            accent={ACCENT}
                            href={slug ? `/properties/${slug}` : "/properties"}
                          />
                        </HoverLift>
                      );
                    })
                    : [
                      <HoverLift key="fallback-a" className="relative">
                        <PropertyCard
                          title="Pride Rock Estate"
                          location="Ibeju-Lekki, Lagos"
                          price={formatMoney(12750000, "NGN")}
                          showBrand
                          imageUrl={undefined}
                          accent={ACCENT}
                          href="/properties"
                        />
                      </HoverLift>,
                      <HoverLift key="fallback-b" className="relative">
                        <PropertyCard
                          title="Emerald Gardens Residence"
                          location="Lekki, Lagos"
                          price={formatMoney(38500000, "NGN")}
                          imageUrl={undefined}
                          accent={ACCENT}
                          href="/properties"
                        />
                      </HoverLift>,
                      <HoverLift key="fallback-c" className="relative">
                        <PropertyCard
                          title="Cedarview Apartments"
                          location="Wuse 2, Abuja"
                          price={formatMoney(22000000, "NGN")}
                          imageUrl={undefined}
                          accent={ACCENT}
                          href="/properties"
                        />
                      </HoverLift>,
                    ]}
                </Stagger>
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

              <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
                {(featuredProperties.length > 0
                  ? featuredProperties
                  : latestProperties
                )
                  .slice(-2)
                  .map((p, idx) => {
                    const id = String((p as any)._id ?? `fallback_${idx}`);
                    const slug = String((p as any).slug ?? "");
                    const title = String((p as any).title ?? "Property");
                    const city = String((p as any).city ?? "");
                    const state = String((p as any).state ?? "");
                    const location = [city, state].filter(Boolean).join(", ");
                    const coverUrl = String((p as any).images?.[0]?.url ?? "").trim() || undefined;
                    const price = formatMoney(
                      Number((p as any).price ?? 0),
                      String((p as any).currency ?? "NGN"),
                    );
                    return (
                      <HoverLift key={id}>
                        <WidePropertyCard
                          title={title}
                          location={location || "—"}
                          price={price}
                          imageUrl={coverUrl}
                          accent={ACCENT}
                          href={slug ? `/properties/${slug}` : "/properties"}
                        />
                      </HoverLift>
                    );
                  })}
              </Stagger>
            </section>
          </Reveal>

          <Reveal delayMs={160}>
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
                      Start your journey with curated plots, transparent pricing,
                      and a support team that stays with you from inquiry to
                      allocation.
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
                        src={ABOUT_IMAGE}
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

              <Stagger className="mt-8 grid gap-6 md:grid-cols-3">
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
              </Stagger>
            </section>
          </Reveal>

          <Reveal delayMs={260}>
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
                      Get clarity on inspections, documentation, payment plans, and allocation.
                    </p>
                  </div>
                  <FaqAccordion items={FAQS} accent={ACCENT} />
                </div>

                <div className="space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                  <div className="text-sm font-semibold text-zinc-900">
                    Still have questions?
                  </div>
                  <div className="text-sm leading-7 text-zinc-600">
                    Visit the full FAQs page or open any property to book an inspection or request more information.
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      href="/faqs"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
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
          </Reveal>
        </main>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}
