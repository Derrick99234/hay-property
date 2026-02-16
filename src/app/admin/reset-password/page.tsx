"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eef1f5]" />}>
      <AdminResetPasswordClient />
    </Suspense>
  );
}

function AdminResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = token.trim().length > 0 && password.length >= 6 && password === confirm && !loading;

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
              Reset password
            </h1>
            <p className="text-sm text-zinc-600">
              Set a new admin password to complete the reset.
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Password updated. Redirecting to login...
            </div>
          ) : null}

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canSubmit) return;
              setError(null);
              setLoading(true);
              fetch("/api/admin/auth/reset-password", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ token, password }),
              })
                .then(async (r) => {
                  const data = (await r.json()) as { ok: boolean; error?: string };
                  if (!r.ok || !data.ok) throw new Error(data.error || "Reset failed.");
                  setSuccess(true);
                  window.setTimeout(() => router.push("/admin/login"), 600);
                })
                .catch((err: unknown) => {
                  setError(err instanceof Error ? err.message : "Reset failed.");
                })
                .finally(() => setLoading(false));
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
                  placeholder="Min 6 characters"
                />
              </Field>
              <Field label="Confirm password">
                <input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  type="password"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
                  placeholder="Repeat password"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Link href="/admin/forgot-password" className="text-sm font-semibold" style={{ color: ACCENT }}>
                Generate a new link
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
                {loading ? "Resetting..." : "Reset password"}
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
