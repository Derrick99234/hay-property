"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (r) => {
        const payload = (await r.json()) as {
          ok: boolean;
          data?: { user?: { name?: string; email?: string } | null };
        };
        if (!cancelled) setUser(payload.data?.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const welcome = useMemo(() => {
    if (loading) return "Welcome";
    if (!user) return "Welcome";
    return `Welcome${user.name ? `, ${user.name}` : ""}`;
  }, [loading, user]);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Account
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{welcome}</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST" })
                .catch(() => {})
                .finally(() => router.push("/auth/login"));
            }}
            className="h-10 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card title="Email" value={loading ? "Loading..." : user?.email ?? "—"} />
          <Card title="Status" value={loading ? "Loading..." : user ? "Logged in" : "Not logged in"} />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">
            Next steps
          </div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Continue browsing properties or contact us.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
              }}
            >
              Browse properties
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}
