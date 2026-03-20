"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePrefersReducedMotion } from "./Motion";

export type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion({ items, accent }: { items: FaqItem[]; accent: string }) {
  const safe = useMemo(
    () =>
      (Array.isArray(items) ? items : [])
        .map((x) => ({
          question: String(x?.question ?? "").trim(),
          answer: String(x?.answer ?? "").trim(),
        }))
        .filter((x) => x.question && x.answer),
    [items]
  );

  const [openKey, setOpenKey] = useState<string | null>(safe[0]?.question ?? null);
  const reducedMotion = usePrefersReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { delayChildren: 0.15, staggerChildren: 0.20 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      className="space-y-3"
      variants={container}
      initial={reducedMotion ? undefined : "hidden"}
      whileInView={reducedMotion ? undefined : "show"}
      viewport={reducedMotion ? undefined : { once: true, amount: 0.18, margin: "0px 0px -10% 0px" }}
    >
      {safe.map((itemRow) => {
        const key = itemRow.question;
        const open = openKey === key;
        return (
          <motion.div
            key={key}
            variants={reducedMotion ? undefined : item}
            transition={reducedMotion ? undefined : { duration: 0.45, ease: "easeOut" }}
            className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100"
          >
            <button
              type="button"
              onClick={() => setOpenKey((prev) => (prev === key ? null : key))}
              className="flex w-full items-start justify-between gap-6 px-5 py-4 text-left"
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold text-zinc-900">{itemRow.question}</div>
              </div>
              <span
                className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-50 text-zinc-700 ring-1 ring-zinc-100"
                style={open ? { backgroundColor: "rgba(242,85,93,0.10)", color: accent } : undefined}
                aria-hidden="true"
              >
                {open ? "−" : "+"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm leading-7 text-zinc-600">{itemRow.answer}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
