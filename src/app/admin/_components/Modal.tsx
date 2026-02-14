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
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-lg px-5 sm:px-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-zinc-100">
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
          <div className="px-5 py-5">{children}</div>
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
