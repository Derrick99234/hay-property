"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().includes("@") && !loading;

  const helper = useMemo(() => {
    if (!submitted) return null;
    return "If an account exists for this email, you'll receive a password reset link shortly.";
  }, [submitted]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          User
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Forgot password
        </h1>
        <p className="text-sm text-zinc-600">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {helper ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          {helper}
        </div>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setLoading(true);
          setError(null);
          setSubmitted(true);
          fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email }),
          })
            .then(async (r) => {
              const data = (await r.json()) as { ok: boolean; error?: string };
              if (!r.ok || !data.ok) throw new Error(data.error || "Request failed.");
            })
            .catch((err: unknown) => {
              setError(err instanceof Error ? err.message : "Request failed.");
            })
            .finally(() => setLoading(false));
        }}
      >
        <Field label="Email">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputMode="email"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="you@example.com"
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <Link href="/auth/login" className="text-sm font-semibold" style={{ color: ACCENT }}>
            Back to login
          </Link>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: ACCENT,
              boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
            }}
          >
            {loading ? "Sending..." : "Send link"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <div className="text-xs font-semibold text-zinc-600">{label}</div>
      {children}
    </label>
  );
}
