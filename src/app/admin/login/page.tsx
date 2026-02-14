"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eef1f5]" />}>
      <AdminLoginClient />
    </Suspense>
  );
}

function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => searchParams.get("next") ?? "/admin", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().includes("@") && password.length >= 1;

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">
                HAY Property
              </span>
              <span className="text-[11px] text-zinc-500">Admin access</span>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            Back to site
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                Admin
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Login
              </h1>
              <p className="text-sm text-zinc-600">
                Admin accounts are created internally.
              </p>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSubmit || loading) return;
                setError(null);
                setLoading(true);
                fetch("/api/admin/auth/login", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email, password }),
                })
                  .then(async (r) => {
                    const data = (await r.json()) as { ok: boolean; error?: string };
                    if (!r.ok || !data.ok) throw new Error(data.error || "Login failed.");
                    router.push(nextUrl);
                  })
                  .catch((err: unknown) => {
                    setError(err instanceof Error ? err.message : "Login failed.");
                    setLoading(false);
                  });
              }}
            >
              <Field label="Email">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
                  placeholder="admin@domain.com"
                />
              </Field>

              <Field label="Password">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
                  placeholder="Password"
                />
              </Field>

              <div className="flex items-center justify-between gap-4 pt-1">
                <Link
                  href="/admin/forgot-password"
                  className="text-sm font-semibold"
                  style={{ color: ACCENT }}
                >
                  Forgot password?
                </Link>
                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: ACCENT,
                    boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                  }}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          </div>

          <aside className="rounded-[28px] p-7 text-white shadow-sm sm:p-10" style={{ backgroundColor: NAVY }}>
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Admin access
              </div>
              <div className="rounded-2xl bg-white/10 p-5 text-sm text-white/85 ring-1 ring-white/10">
                Use an admin email and password stored in MongoDB.
              </div>
              <div className="rounded-2xl bg-white/10 p-5 text-sm text-white/85 ring-1 ring-white/10">
                If this is a fresh database, create your first admin by POSTing to{" "}
                <span className="font-semibold text-white">/api/admins</span>.
              </div>
            </div>
          </aside>
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

function LogoMark() {
  return (
    <div
      className="grid size-9 place-items-center rounded-xl bg-[rgba(242,85,93,0.12)]"
      aria-hidden="true"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2 5.4 12 2l5.8 3.4v6.2L12 15 6.2 11.6V5.4Z"
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7"
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
