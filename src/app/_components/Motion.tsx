"use client";

import { useEffect, useRef, useState } from "react";

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

export function Reveal({
  children,
  delayMs,
  className,
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setVisible(true);
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
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      style={reducedMotion ? undefined : { transitionDelay: `${delayMs ?? 0}ms` }}
      className={[
        "transform-gpu will-change-transform",
        reducedMotion ? "" : "transition-[opacity,transform] duration-700 ease-out",
        visible || reducedMotion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Parallax({
  children,
  strength,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const wrap = wrapRef.current;
    const layer = layerRef.current;
    if (!wrap || !layer) return;

    let raf = 0;
    const s = typeof strength === "number" ? strength : 26;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const rel = (center - vh / 2) / vh;
      const clamped = Math.max(-1, Math.min(1, rel));
      const offset = clamped * s;
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
  }, [reducedMotion, strength]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={layerRef} className="h-full w-full transform-gpu will-change-transform">
        {children}
      </div>
    </div>
  );
}

