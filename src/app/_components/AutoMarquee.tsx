"use client";

import { Children, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./Motion";

export default function AutoMarquee({
  children,
  className,
  speed = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo(() => Children.toArray(children), [children]);
  const doubled = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (reducedMotion) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let raf = 0;
    let half = 0;

    const measure = () => {
      half = inner.scrollWidth / 2;
    };
    measure();

    const tick = () => {
      raf = 0;
      if (paused) return;
      if (!half) measure();
      outer.scrollLeft += speed;
      if (half && outer.scrollLeft >= half) outer.scrollLeft -= half;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };

    start();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [paused, reducedMotion, speed, items.length]);

  return (
    <div
      ref={outerRef}
      className={[
        "relative overflow-x-auto scroll-smooth",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className ?? "",
      ].join(" ")}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div ref={innerRef} className="flex w-max items-stretch gap-4 pr-4">
        {doubled.map((child, idx) => (
          <div key={(child as any)?.key ?? idx} className="shrink-0">
            {child}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
    </div>
  );
}

