"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { pickHeroImage } from "../../lib/unsplash";

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  mediaLabel: string;
  imageUrl: string;
};

export default function HeroCarousel({ accent }: { accent: string }) {
  const slides = useMemo<Slide[]>(
    () => [
      {
        title: "Designing wealth,",
        subtitle: "security, and legacy",
        description:
          "Unlock opportunities in real estate with trusted insight, curated listings, and transparent guidance—built for long term value and peace of mind.",
        mediaLabel: "Pride Rock",
        imageUrl: pickHeroImage("hero-1"),
      },
      {
        title: "Verified land,",
        subtitle: "clear documentation",
        description:
          "Browse vetted plots with transparent pricing, verified locations, and the paperwork you need to buy with confidence.",
        mediaLabel: "Harvest Grove",
        imageUrl: pickHeroImage("hero-2"),
      },
      {
        title: "Build with",
        subtitle: "trusted guidance",
        description:
          "From inquiry to allocation, our team stays close—helping you make informed decisions and move fast on opportunities.",
        mediaLabel: "Ibeju-Lekki",
        imageUrl: pickHeroImage("hero-3"),
      },
      {
        title: "Invest for",
        subtitle: "long-term value",
        description:
          "Discover modern estates and high-growth locations with selection that favors stability, security, and future upside.",
        mediaLabel: "Epe, Lagos",
        imageUrl: pickHeroImage("hero-4"),
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  const goTo = (nextIndex: number) => {
    const normalized = ((nextIndex % slides.length) + slides.length) % slides.length;
    setIndex(normalized);
  };

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      goTo(index + 1);
    }, 6000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [index]);

  const slide = slides[index];

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#131b2d]">
      <div className="absolute inset-0 bg-[radial-gradient(900px_560px_at_18%_30%,rgba(34,197,94,0.22),transparent),radial-gradient(900px_560px_at_85%_20%,rgba(59,130,246,0.18),transparent),linear-gradient(115deg,rgba(0,0,0,0.70),rgba(0,0,0,0.30),rgba(0,0,0,0.08))]" />

      <div className="relative grid min-h-[420px] gap-10 px-8 py-10 sm:min-h-[460px] sm:px-12 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-5"
            >
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              {slide.title}
              <br />
              {slide.subtitle}
            </h1>
            <p className="max-w-lg text-sm leading-6 text-white/80 sm:text-base">
              {slide.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#latest"
                className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                style={{
                  backgroundColor: accent,
                  boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                }}
              >
                Browse properties
              </Link>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex h-10 items-center gap-3 rounded-full bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white/15">
                  <IconPlay />
                </span>
                Play video
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <AvatarCircle className="bg-rose-400" />
                  <AvatarCircle className="bg-amber-300" />
                  <AvatarCircle className="bg-emerald-300" />
                  <AvatarCircle className="bg-sky-300" />
                </div>
                <div className="text-sm font-semibold text-white">
                  50K+ Happy Clients
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur sm:flex">
                <div className="text-sm font-semibold">4.95</div>
                <div className="flex items-center gap-0.5">
                  <IconStar className="text-amber-300" />
                  <IconStar className="text-amber-300" />
                  <IconStar className="text-amber-300" />
                  <IconStar className="text-amber-300" />
                  <IconStar className="text-amber-300" />
                </div>
                <div className="text-xs text-white/70">(1,245)</div>
              </div>
            </div>
            </motion.div>
          </AnimatePresence>

          <div className="hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.imageUrl}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.985 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative aspect-[4/3] overflow-hidden rounded-[28px] ring-1 ring-white/10"
              >
              <img
                src={slide.imageUrl}
                alt={slide.mediaLabel}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
                  Featured
                </div>
                <div className="text-lg font-semibold text-white">
                  {slide.mediaLabel}
                </div>
              </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={[
                  "size-2 rounded-full transition",
                  active ? "bg-white/85" : "bg-white/35 hover:bg-white/55",
                ].join(" ")}
              />
            );
          })}
        </div>
        <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}

function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-5"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-4xl overflow-hidden rounded-[28px] bg-black shadow-2xl ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between px-5 py-4 text-white">
              <div className="text-sm font-semibold">HAY Property</div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/15"
              >
                Close
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/y9j-BL5ocW8?autoplay=1&mute=1&rel=0"
                title="Real estate video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AvatarCircle({ className }: { className: string }) {
  return (
    <div
      className={["size-9 rounded-full ring-2 ring-white/20", className].join(" ")}
      aria-hidden="true"
    />
  );
}

function IconPlay() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M9 18V6l12 6-12 6Z" />
    </svg>
  );
}

function IconStar({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l2.9 6.3L22 9.2l-5 4.6L18.2 21 12 17.6 5.8 21 7 13.8 2 9.2l7.1-.9L12 2Z" />
    </svg>
  );
}
