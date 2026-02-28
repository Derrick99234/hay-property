"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-start justify-center px-4 py-6 sm:px-10 sm:py-10">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-zinc-100">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4">
            <div className="text-sm font-semibold text-zinc-900">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 place-items-center rounded-full border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50"
              aria-label="Close"
            >
              <IconClose />
            </button>
          </div>
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto px-5 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function IconClose() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
