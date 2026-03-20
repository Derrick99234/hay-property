"use client";

import { Children, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function usePrefersReducedMotion() {
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

export function Float({
  children,
  className,
  amplitude = 8,
  duration = 5,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delayChildren = 0.08,
  staggerChildren = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;

  const container = {
    hidden: {},
    show: { transition: { delayChildren, staggerChildren } },
  };
  const item = {
    hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -10% 0px" }}
    >
      {Children.toArray(children).map((child, idx) => (
        <motion.div
          key={(child as any)?.key ?? idx}
          className="contents"
          variants={item}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function InView({
  children,
  className,
  from = "up",
  delayMs = 0,
  blur = true,
  scale = false,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right";
  delayMs?: number;
  blur?: boolean;
  scale?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;

  const dist = 18;
  const x = from === "left" ? -dist : from === "right" ? dist : 0;
  const y = from === "up" ? dist : from === "down" ? -dist : 0;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, filter: blur ? "blur(8px)" : "none", scale: scale ? 0.98 : 1 }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: delayMs / 1000 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function ImageReveal({
  children,
  className,
  delayMs = 0,
  direction = "left",
  zoom = true,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "left" | "right";
  zoom?: boolean;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;

  const origin = direction === "left" ? "left" : "right";

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delayMs / 1000 }}
      viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
    >
      <motion.div
        initial={{ scale: zoom ? 1.07 : 1 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: delayMs / 1000 }}
        viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
        className="relative h-full w-full"
      >
        {children}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-zinc-200"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: delayMs / 1000 }}
          viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
          style={{ transformOrigin: origin }}
        />
      </motion.div>
    </motion.div>
  );
}

export function HoverLift({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ y: -6, scale: 1.01, rotate: -0.15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
