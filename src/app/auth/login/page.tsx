"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-10" />}>
      <LoginClient />
    </Suspense>
  );
}

function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = useMemo(() => searchParams.get("next") ?? "/account", [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().includes("@") && password.length >= 1;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          User
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-600">
          Login to continue. Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: ACCENT }} className="font-semibold">
            Register
          </Link>
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit || loading) return;
          setLoading(true);
          setError(null);
          fetch("/api/auth/login", {
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
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="Your password"
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <Link href="/auth/forgot-password" className="text-sm font-semibold" style={{ color: ACCENT }}>
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
