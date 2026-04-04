import type { Metadata } from "next";
import Script from "next/script";
import { connectMongo } from "../lib/mongodb";
import { richTextToPlainText } from "../lib/richText";
import { pickBlogImage, pickLandImage } from "../lib/unsplash";
import { Blog } from "../models/Blog";
import { Property } from "../models/Property";
import HomeClient, { type HomeBlogCard, type HomePropertyCard } from "./_components/home/HomeClient";
import type { FaqItem } from "./_components/FaqAccordion";

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
    images: [{ url: pickLandImage("og-home"), width: 1400, height: 800, alt: "HAY Property" }],
    type: "website",
  },
};

function formatMoney(value: number, currency: string) {
  const safe = Number.isFinite(value) ? value : 0;
  const cur = currency || "NGN";
  return safe.toLocaleString(undefined, { style: "currency", currency: cur, maximumFractionDigits: 0 });
}

export default async function Home() {
  let latest: unknown[] = [];
  let featured: unknown[] = [];
  let posts: unknown[] = [];
  let dbError = false;

  try {
    await connectMongo();
    const res = await Promise.all([
      Property.find({ status: "AVAILABLE" }, null, { sort: { createdAt: -1 }, limit: 6 }).lean(),
      Property.find({ status: "AVAILABLE" }, null, { sort: { createdAt: -1 }, limit: 4 }).lean(),
      Blog.find({ published: true }, null, { sort: { publishedAt: -1, createdAt: -1 }, limit: 3 }).lean(),
    ]);
    latest = res[0];
    featured = res[1];
    posts = res[2];
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

  const latestCards: HomePropertyCard[] = (Array.isArray(latest) ? latest : []).map((p, idx) => {
    const id = String((p as any)?._id ?? `latest_${idx}`);
    const slug = String((p as any)?.slug ?? "");
    const title = String((p as any)?.title ?? "Property");
    const city = String((p as any)?.city ?? "");
    const state = String((p as any)?.state ?? "");
    const location = [city, state].filter(Boolean).join(", ") || String((p as any)?.address ?? "") || "—";
    const price = formatMoney(Number((p as any)?.price ?? 0), String((p as any)?.currency ?? "NGN"));
    const imageUrl = String((p as any)?.images?.[0]?.url ?? "").trim() || undefined;
    const href = slug ? `/properties/${slug}` : "/properties";
    return { id, href, title, location, price, imageUrl, showBrand: true };
  });

  const featuredWideCards: HomePropertyCard[] = (Array.isArray(featured) ? featured : []).map((p, idx) => {
    const id = String((p as any)?._id ?? `featured_${idx}`);
    const slug = String((p as any)?.slug ?? "");
    const title = String((p as any)?.title ?? "Property");
    const city = String((p as any)?.city ?? "");
    const state = String((p as any)?.state ?? "");
    const location = [city, state].filter(Boolean).join(", ") || String((p as any)?.address ?? "") || "—";
    const price = formatMoney(Number((p as any)?.price ?? 0), String((p as any)?.currency ?? "NGN"));
    const imageUrl = String((p as any)?.images?.[0]?.url ?? "").trim() || undefined;
    const href = slug ? `/properties/${slug}` : "/properties";
    return { id, href, title, location, price, imageUrl };
  });

  const blogCards: HomeBlogCard[] = (Array.isArray(posts) ? posts : []).map((b, idx) => {
    const id = String((b as any)?._id ?? `blog_${idx}`);
    const slug = String((b as any)?.slug ?? "");
    const title = String((b as any)?.title ?? "");
    const category = String((b as any)?.category ?? "");
    const excerpt = String((b as any)?.excerpt ?? "").trim() || richTextToPlainText(String((b as any)?.content ?? "")).slice(0, 160).trim();
    const coverUrl = String((b as any)?.coverUrl ?? "").trim() || pickBlogImage(slug) || undefined;
    const href = slug ? `/blog/${slug}` : "/blog";
    return { id, href, title, category, excerpt, coverUrl };
  });

  const fallbackLatest: HomePropertyCard[] = [
    { id: "fallback-a", href: "/properties", title: "Pride Rock Estate", location: "Ibeju-Lekki, Lagos", price: formatMoney(12750000, "NGN"), showBrand: true },
    { id: "fallback-b", href: "/properties", title: "Emerald Gardens Residence", location: "Lekki, Lagos", price: formatMoney(38500000, "NGN") },
    { id: "fallback-c", href: "/properties", title: "Cedarview Apartments", location: "Wuse 2, Abuja", price: formatMoney(22000000, "NGN") },
  ];

  const fallbackFeatured: HomePropertyCard[] = [
    { id: "featured-a", href: "/properties", title: "Featured Listing A", location: "—", price: formatMoney(0, "NGN") },
    { id: "featured-b", href: "/properties", title: "Featured Listing B", location: "—", price: formatMoney(0, "NGN") },
  ];

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <Script id="jsonld-org" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Script id="jsonld-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <HomeClient
        accent={ACCENT}
        navy={NAVY}
        aboutImage={ABOUT_IMAGE}
        dbError={dbError}
        latestCards={latestCards.length ? latestCards : fallbackLatest}
        featuredWideCards={featuredWideCards.length ? featuredWideCards : fallbackFeatured}
        blogCards={blogCards}
        faqItems={FAQS}
      />
    </div>
  );
}
