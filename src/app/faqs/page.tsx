import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";
import { Reveal } from "../_components/Motion";
import FaqAccordion, { type FaqItem } from "../_components/FaqAccordion";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const metadata: Metadata = {
  title: "FAQs • HAY Property",
  description:
    "Find answers about inspections, documentation, payments, allocations, and how HAY Property works.",
  alternates: { canonical: "/faqs" },
  openGraph: {
    title: "FAQs • HAY Property",
    description:
      "Find answers about inspections, documentation, payments, allocations, and how HAY Property works.",
    url: "https://hayproperty.com/faqs",
    type: "website",
  },
};

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

export default function FaqsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Script
        id="jsonld-faqs"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="space-y-14">
          <Reveal>
            <section className="overflow-hidden rounded-[28px] bg-[#131b2d]">
              <div className="relative px-8 py-12 sm:px-12 sm:py-16">
                <div className="absolute inset-0 bg-[radial-gradient(900px_560px_at_18%_30%,rgba(34,197,94,0.18),transparent),radial-gradient(900px_560px_at_85%_20%,rgba(59,130,246,0.16),transparent),linear-gradient(115deg,rgba(0,0,0,0.70),rgba(0,0,0,0.30),rgba(0,0,0,0.08))]" />
                <div className="relative space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
                    Help center
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Frequently asked questions
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                    Quick answers about inspections, documentation, payments, and allocation.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/properties"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                    >
                      Browse properties
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:bg-white/15"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={120}>
            <section className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    FAQs
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Answers you can trust
                  </h2>
                </div>
                <FaqAccordion items={FAQS} accent={ACCENT} />
              </div>

              <div className="space-y-4 rounded-[28px] bg-zinc-50 p-6 ring-1 ring-zinc-100">
                <div className="text-sm font-semibold text-zinc-900">Need more details?</div>
                <div className="text-sm leading-7 text-zinc-600">
                  If your question is specific to a property or location, send a request and we’ll respond with the right documentation and next steps.
                </div>
                <Link
                  href="/properties"
                  className="inline-flex h-10 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 transition hover:border-zinc-300"
                >
                  Open a property
                </Link>
              </div>
            </section>
          </Reveal>
        </main>
      </div>

      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}

