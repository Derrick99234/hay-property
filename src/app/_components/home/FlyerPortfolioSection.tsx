"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type FlyerPortfolioItem = {
  id: string;
  imageUrl: string;
  badge?: string;
  name: string;
  location?: string;
  title?: string;
  primaryPrice?: string;
  deposit?: string;
  priceLines?: string[];
  highlights?: string[];
};

function clampList(list: string[] | undefined, max: number) {
  return (Array.isArray(list) ? list : [])
    .map((x) => String(x ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

export default function FlyerPortfolioSection({
  accent,
  items,
}: {
  accent: string;
  items: FlyerPortfolioItem[];
}) {
  const flyers = useMemo(() => (Array.isArray(items) ? items : []).filter((x) => x && x.id && x.imageUrl), [items]);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const current = flyers[index] ?? null;

  const imageVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 24, scale: 0.985 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: -d * 24, scale: 0.985 }),
  };

  const detailsVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 18, filter: "blur(8px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: (d: number) => ({ opacity: 0, x: -d * 18, filter: "blur(8px)" }),
  };

  const go = (next: number) => {
    if (!flyers.length) return;
    const normalized = ((next % flyers.length) + flyers.length) % flyers.length;
    setDir(normalized > index ? 1 : -1);
    setIndex(normalized);
  };

  if (!flyers.length) return null;

  return (
    <section className="mt-16">
      <div className="grid gap-10">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Estates</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">15+</div>
          </div>
          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Property consultants</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">100+</div>
          </div>
          <div className="rounded-[22px] bg-white p-6 shadow-sm ring-1 ring-zinc-100">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Happy clients</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">2500+</div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">Our property portfolio</div>
          {/* <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Current flyers & deals</h2> */}
        </div>

        <div className="overflow-hidden rounded-[28px] bg-zinc-50 shadow-sm ring-1 ring-zinc-100">
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[0.81fr_0.95fr] lg:items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 z-10 flex items-center">
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  className="ml-3 grid size-10 place-items-center rounded-full bg-white/90 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 transition hover:bg-white"
                  aria-label="Previous flyer"
                >
                  ‹
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 z-10 flex items-center">
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  className="mr-3 grid size-10 place-items-center rounded-full bg-white/90 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 transition hover:bg-white"
                  aria-label="Next flyer"
                >
                  ›
                </button>
              </div>

              <div className="relative h-150 overflow-hidden rounded-[26px] bg-zinc-200">
                <AnimatePresence mode="wait" custom={dir}>
                  {current ? (
                    <motion.div
                      key={current.id}
                      custom={dir}
                      variants={imageVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={current.imageUrl}
                        alt={current.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 800px"
                        priority={false}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                {flyers.slice(0, 9).map((f, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => go(i)}
                      className={[
                        "h-2 rounded-full transition",
                        active ? "w-8" : "w-2 hover:w-4",
                      ].join(" ")}
                      style={{ backgroundColor: active ? accent : "rgba(0,0,0,0.18)" }}
                      aria-label={`Open ${f.name}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <AnimatePresence mode="wait" custom={dir}>
                {current ? (
                  <motion.div
                    key={`${current.id}_details`}
                    custom={dir}
                    variants={detailsVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      {current.badge ? (
                        <div
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: "rgba(242,85,93,0.10)", color: accent }}
                        >
                          {current.badge}
                        </div>
                      ) : null}
                      <div className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{current.name}</div>
                      {current.location ? <div className="text-sm text-zinc-600">{current.location}</div> : null}
                    </div>

                    <div className="rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">From</div>
                          <div className="mt-2 text-xl font-semibold" style={{ color: accent }}>
                            {current.primaryPrice ?? "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Initial deposit</div>
                          <div className="mt-2 text-xl font-semibold text-zinc-900">{current.deposit ?? "—"}</div>
                        </div>
                      </div>
                      {current.title ? <div className="mt-4 text-sm text-zinc-600">Title: {current.title}</div> : null}
                    </div>

                    {clampList(current.priceLines, 6).length ? (
                      <div className="grid gap-2 rounded-[22px] bg-white p-5 shadow-sm ring-1 ring-zinc-100">
                        {clampList(current.priceLines, 6).map((line) => (
                          <div key={line} className="flex items-start gap-2 text-sm text-zinc-700">
                            <span className="mt-2 size-1.5 rounded-full bg-zinc-400" aria-hidden="true" />
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {clampList(current.highlights, 4).length ? (
                      <div className="grid gap-2 text-sm text-zinc-600">
                        {clampList(current.highlights, 4).map((h) => (
                          <div key={h} className="flex items-start gap-2">
                            <span className="mt-2 size-1.5 rounded-full bg-zinc-400" aria-hidden="true" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Link
                        href={current.imageUrl}
                        target="_blank"
                        className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                        style={{ backgroundColor: accent, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                      >
                        View
                      </Link>
                      <Link
                        href="/properties"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                      >
                        Browse other properties
                      </Link>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
