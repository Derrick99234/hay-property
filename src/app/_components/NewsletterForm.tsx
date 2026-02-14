"use client";

import { useMemo, useState } from "react";

export default function NewsletterForm({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => email.trim().includes("@") && status !== "loading", [email, status]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setStatus("loading");
        setMessage(null);
        fetch("/api/newsletter", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, source }),
        })
          .then(async (r) => {
            const data = (await r.json()) as { ok: boolean; error?: string };
            if (!r.ok || !data.ok) throw new Error(data.error || "Subscription failed.");
            setStatus("success");
            setMessage("Subscribed.");
            setEmail("");
          })
          .catch((err: unknown) => {
            setStatus("error");
            setMessage(err instanceof Error ? err.message : "Subscription failed.");
          });
      }}
    >
      <div className="flex items-center gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          inputMode="email"
          className="h-11 w-full rounded-full bg-white/10 px-4 text-sm text-white placeholder:text-white/45 outline-none ring-1 ring-white/15 focus:ring-white/30"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="grid size-11 place-items-center rounded-full bg-white text-[#1d2b56] shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Subscribe"
        >
          {status === "loading" ? (
            <span className="text-xs font-semibold">...</span>
          ) : (
            <IconSend />
          )}
        </button>
      </div>
      {message ? <div className="mt-2 text-xs text-white/75">{message}</div> : null}
    </form>
  );
}

function IconSend() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M4 12 20 4 13 20l-2-6-7-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

