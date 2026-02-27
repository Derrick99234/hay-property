"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

const HERO_IMAGE = "/hay property about page.jpg";
// const HERO_IMAGE = "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1600&q=80";
const ACCOLADES_BG = "/hay property team accolades.jpg";

const TEAM = [
  {
    name: "MR. AFOLABI OMOTAYO",
    role: "Chief Executive Officer",
    image: "/team/Chief Executive Officer.png",
  },
  {
    name: "MISS AFOLABI DAMILOLA",
    role: "Sales/Content Strategist",
    image: "/team/Sales Content Strategist.png",
  },
  {
    name: "MR OGUNLEKE OLUWATOBI",
    role: "Marketing & Communication Manager",
    image: "/team/Marketing & Communication Manager.png",
  },
  {
    name: "MISS TEMITOPE ODEJIDE",
    role: "Accountant",
    image: "/team/Accountant.png",
  },
];

function enc(path: string) {
  return encodeURI(path);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(Boolean(mq.matches));
    onChange();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return reduced;
}

function useRevealOnScroll() {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      // No-op: visibility is already handled by the initial state and the IntersectionObserver callback
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return { ref, visible, reducedMotion };
}

function Reveal({
  children,
  delayMs,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const { ref, visible, reducedMotion } = useRevealOnScroll();

  return (
    <div
      ref={ref}
      style={
        reducedMotion ? undefined : { transitionDelay: `${delayMs ?? 0}ms` }
      }
      className={[
        "transform-gpu will-change-transform",
        reducedMotion
          ? ""
          : "transition-[opacity,transform] duration-700 ease-out",
        visible || reducedMotion
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const reducedMotion = usePrefersReducedMotion();
  const parallaxWrapRef = useRef<HTMLDivElement | null>(null);
  const parallaxLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = parallaxWrapRef.current;
    const layer = parallaxLayerRef.current;
    if (!wrap || !layer) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const rel = (center - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, rel));
      const offset = clamped * 26;
      layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-380 px-5 pb-14 pt-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className={"space-y-20 sm:space-y-24 pb-6"}>
          <Reveal>
            <section className="grid gap-10 lg:grid-cols-[1fr_520px] lg:items-center">
              <div className="space-y-7 pt-2">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">
                    About us
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                    Meet HayProperty Development
                  </h1>
                  <p className="text-sm leading-7 text-zinc-600">
                    Hay Property Ltd. is a forward-thinking real estate
                    development company based in Lagos, Nigeria—committed to
                    transparency, strategic land acquisition, and long-term
                    value creation. Incorporated in 2022, we provide trusted
                    investment opportunities across residential, agricultural,
                    land banking, and commercial developments.
                  </p>
                </div>

                <div className="space-y-4 text-sm leading-7 text-zinc-600">
                  <p>
                    We believe landownership should be more than a purchase—it
                    should be a pathway to growth, stability, and generational
                    wealth. Our projects combine affordability, premium
                    locations, verified documentation, and sustainable community
                    planning, helping clients secure plots you can trust.
                  </p>
                  <p>
                    Our mission is to transform land ownership into a platform
                    for wealth creation through agriculture, recreation, leasing
                    opportunities, and modern development. We deliver legally
                    documented projects at accessible prices—ensuring
                    transparency, instant allocation, and positive impact for
                    investors and the communities we serve.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex h-11 items-center justify-center rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                    }}
                  >
                    Contact us
                  </Link>
                  <Link
                    href="/properties"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-900 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2"
                  >
                    Explore properties
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-zinc-200 shadow-sm ring-1 ring-zinc-100">
                <Image
                  src={HERO_IMAGE}
                  alt="Hay Property team"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                  width={1600}
                  height={900}
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/25 via-transparent to-transparent opacity-80" />
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={80}>
            <section
              ref={parallaxWrapRef}
              className="relative overflow-hidden h-150 bg-[#0f1730] flex justify-center items-center"
            >
              <div
                ref={parallaxLayerRef}
                className="absolute inset-0 transform-gpu will-change-transform"
              >
                <Image
                  src={ACCOLADES_BG}
                  alt="Team accolades"
                  className="h-full w-full object-cover"
                  width={2000}
                  height={1200}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-[#0f1730]/50" />
              <div className="relative px-6 py-12 sm:px-10 sm:py-14 bg-[#0f1730]/80">
                <div className="text-center">
                  <p className="text-lg text-white/70">Team accolades</p>
                </div>

                <div className="mt-10 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-3">
                  <Accolade value="5+" label="Years of industry expertise" />
                  <Accolade value="6+" label="Active states nationwide" />
                  <Accolade value="200+" label="Happy clients & investors" />
                  <Accolade value="100%" label="Verified land documentation" />
                  <Accolade value="400+" label="Plots allocated" />
                  <Accolade value="₦200M" label="Property value created" />
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal delayMs={120}>
            <section className="space-y-10">
              <div className="space-y-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-zinc-500">
                  Our team
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  Hay Team
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-600">
                  Our team is made up of passionate professionals dedicated to
                  making landownership secure, accessible, and rewarding.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {TEAM.map((t) => (
                  <div
                    key={t.name}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-square bg-zinc-200">
                      <Image
                        src={enc(t.image)}
                        alt={t.name}
                        fill
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    </div>
                    <div className="space-y-1 px-5 py-5 text-center">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900">
                        {t.name}
                      </div>
                      <div className="text-xs text-zinc-500">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: ACCENT,
                    boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                  }}
                >
                  Contact us
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

function Accolade({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mx-auto max-w-[260px] text-[10px] font-semibold uppercase text-white/70">
        {label}
      </div>
    </div>
  );
}
