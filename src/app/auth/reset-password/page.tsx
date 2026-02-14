"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { resetPassword } from "../_lib/authStore";

const ACCENT = "#f2555d";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-10" />}>
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = token.trim().length > 0 && password.length >= 6 && password === confirm;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
          User
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Reset password
        </h1>
        <p className="text-sm text-zinc-600">
          Choose a new password to complete the reset.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Password updated. You can now{" "}
          <Link href="/auth/login" className="font-semibold" style={{ color: ACCENT }}>
            login
          </Link>
          .
        </div>
      ) : null}

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setError(null);
          const res = resetPassword({ token, newPassword: password });
          if (!res.ok) {
            setError(res.error);
            return;
          }
          setSuccess(true);
          window.setTimeout(() => router.push("/auth/login"), 600);
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

        <div className="flex items-center justify-between gap-4">
          <Link href="/auth/forgot-password" className="text-sm font-semibold" style={{ color: ACCENT }}>
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
            Reset password
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
