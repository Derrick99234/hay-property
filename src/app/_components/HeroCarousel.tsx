"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Slide = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  href: string;
  stat: string;
};

const SLIDES: Slide[] = [
  {
    id: "landbanking",
    category: "Landbanking",
    title: "Vast Land.",
    subtitle: "Strategic parcels for future value",
    description:
      "Secure high-potential land opportunities with HAY Property in growth corridors built for patient capital, clean documentation, and long-term upside.",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/pages-image/landbanking%20%20vast%20land.png",
    href: "/properties?q=land",
    stat: "Future-facing land investment",
  },
  {
    id: "agro",
    category: "Agro Real Estate",
    title: "Farm Tractor.",
    subtitle: "Productive land with agricultural momentum",
    description:
      "Explore agro real estate opportunities that blend land ownership with real utility, from cultivation potential to development-ready farming environments.",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/pages-image/Agro%20real%20estate%20-%20farm%20tractor.png",
    href: "/properties?q=estate",
    stat: "Agro-backed value creation",
  },
  {
    id: "residential",
    category: "Residential",
    title: "Nice Building.",
    subtitle: "Homes and estates with a refined finish",
    description:
      "Discover residential listings curated by HAY Property for comfort, security, and stronger buying confidence, whether you are purchasing to live or to hold.",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/pages-image/residential%20-%20nice%20building.png",
    href: "/properties?q=house",
    stat: "Lifestyle-led residential picks",
  },
  {
    id: "commercial",
    category: "Commercial",
    title: "Mall.",
    subtitle: "Visibility, traffic, and business-ready space",
    description:
      "Step into commercial opportunities designed for relevance and return, with locations that support retail presence, mixed-use ambition, and modern enterprise.",
    imageUrl:
      "https://pub-edd6261085894e2db893376ace3b663e.r2.dev/pages-image/commercial%20-%20mall.png",
    href: "/properties",
    stat: "Commercial-grade opportunity",
  },
];

export default function HeroCarousel({ accent }: { accent: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[78svh] overflow-hidden bg-[#08111f] sm:min-h-[720px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0.6, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.45, scale: 1.02 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${slide.imageUrl}")` }}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,10,20,0.86) 0%, rgba(4,10,20,0.68) 36%, rgba(4,10,20,0.36) 63%, rgba(4,10,20,0.54) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(900px_480px_at_15%_22%,rgba(242,85,93,0.16),transparent),radial-gradient(850px_500px_at_82%_78%,rgba(29,43,86,0.30),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="relative flex min-h-[78svh] flex-col justify-between px-6 pb-7 pt-16 sm:min-h-[720px] sm:px-10 sm:pb-10 sm:pt-20 lg:px-14 lg:pb-12">
        <div className="max-w-4xl space-y-8 pt-8 sm:pt-14">
          <motion.div
            key={`${slide.id}-copy`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
                {slide.category}
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-[5.4rem]">
                {slide.title}
                <br />
                <span className="text-white/92">{slide.subtitle}</span>
              </h1>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
              {slide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={slide.href}
                className="inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold text-white shadow-lg transition hover:translate-y-[-1px] hover:opacity-95"
                style={{
                  backgroundColor: accent,
                  boxShadow: "0 22px 44px -26px rgba(242,85,93,0.95)",
                }}
              >
                Explore {slide.category}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="flex-wrap gap-3 hidden md:flex">
            {SLIDES.map((item, itemIndex) => {
              const active = itemIndex === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  className={[
                    "min-w-[150px] rounded-2xl border px-4 py-3 text-left backdrop-blur-md transition",
                    active
                      ? "border-white/20 bg-white/16 text-white shadow-lg"
                      : "border-white/10 bg-white/6 text-white/72 hover:bg-white/10",
                  ].join(" ")}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/50">
                    0{itemIndex + 1}
                  </div>
                  <div className="mt-2 text-sm font-semibold">
                    {item.category}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rounded-[26px] border border-white/12 bg-white/10 p-5 text-white backdrop-blur-md">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
              Current focus
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">
              {slide.category}
            </div>
            <div className="mt-2 text-sm leading-6 text-white/72">
              {slide.stat}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
