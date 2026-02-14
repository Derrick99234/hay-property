"use client";

import Link from "next/link";
import { useState } from "react";
import { ADMIN_EMAIL, createAdminResetToken } from "../_lib/adminAuth";

const ACCENT = "#f2555d";

export default function AdminForgotPasswordPage() {
  const [shown, setShown] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-10">
        <div className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Admin
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Forgot password
            </h1>
            <p className="text-sm text-zinc-600">
              This generates a demo reset link for <span className="font-semibold">{ADMIN_EMAIL}</span>.
            </p>
          </div>

          {shown ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              If an admin account exists, a reset link is generated.
            </div>
          ) : null}

          {resetUrl ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
              <div className="font-semibold text-zinc-900">Demo reset link</div>
              <div className="mt-1 break-all">{resetUrl}</div>
              <div className="mt-3">
                <Link href={resetUrl} className="text-sm font-semibold" style={{ color: ACCENT }}>
                  Open reset page
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/admin/login" className="text-sm font-semibold" style={{ color: ACCENT }}>
              Back to login
            </Link>
            <button
              type="button"
              onClick={() => {
                setShown(true);
                const token = createAdminResetToken();
                setResetUrl(`/admin/reset-password?token=${encodeURIComponent(token)}`);
              }}
              className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
              }}
            >
              Generate link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

