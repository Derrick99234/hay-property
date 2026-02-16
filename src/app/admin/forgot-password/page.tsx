"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().includes("@") && !loading;

  const helper = useMemo(() => {
    if (!submitted) return null;
    return "If an admin account exists for this email, you'll receive a reset link shortly.";
  }, [submitted]);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} />
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            Back to site
          </Link>
        </div>

        <div className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Forgot password
            </h1>
            <p className="text-sm text-zinc-600">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {helper ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {helper}
            </div>
          ) : null}

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              setSubmitted(true);
              setLoading(true);
              setError(null);
              fetch("/api/admin/auth/forgot-password", {
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
                placeholder="Email address"
              />
            </Field>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/admin/login" className="text-sm font-semibold" style={{ color: ACCENT }}>
              Back to login
            </Link>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
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
      </div>
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
