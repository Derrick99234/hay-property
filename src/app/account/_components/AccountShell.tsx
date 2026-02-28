"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AccountUser = { name?: string; email?: string } | null;
type MeResponse = { ok: boolean; data?: { user?: { name?: string; email?: string } | null } };

type AccountContextValue = {
  user: AccountUser;
  loading: boolean;
  logout: () => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountShell");
  return ctx;
}

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function AccountShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: "dashboard" | "purchases" | "wishlist";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccountUser>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (r) => (await r.json()) as MeResponse)
      .then((payload) => {
        if (cancelled) return;
        setUser(payload.data?.user ?? null);
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

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => router.push("/auth/login"));
  };

  const initials = useMemo(() => {
    const base = user?.name?.trim() || user?.email?.trim() || "";
    if (!base) return "U";
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  const value = useMemo<AccountContextValue>(() => ({ user, loading, logout }), [loading, user]);

  return (
    <AccountContext.Provider value={value}>
      <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
        <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center">
              <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} priority />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/account"
                className={[
                  "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm ring-1 transition",
                  active === "dashboard"
                    ? "bg-white text-zinc-900 ring-zinc-200"
                    : "bg-transparent text-zinc-700 ring-zinc-200 hover:bg-white",
                ].join(" ")}
              >
                Dashboard
              </Link>
              <Link
                href="/account/wishlist"
                className={[
                  "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm ring-1 transition",
                  active === "wishlist"
                    ? "bg-white text-zinc-900 ring-zinc-200"
                    : "bg-transparent text-zinc-700 ring-zinc-200 hover:bg-white",
                ].join(" ")}
              >
                Wishlist
              </Link>
              <Link
                href="/account/purchases"
                className={[
                  "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm ring-1 transition",
                  active === "purchases"
                    ? "bg-white text-zinc-900 ring-zinc-200"
                    : "bg-transparent text-zinc-700 ring-zinc-200 hover:bg-white",
                ].join(" ")}
              >
                Purchases
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden h-10 rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 sm:inline-flex"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="hidden rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 lg:block">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-zinc-100 text-sm font-semibold text-zinc-800">
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">{loading ? "Loading..." : user?.name || user?.email || "Account"}</div>
                  <div className="truncate text-xs text-zinc-500">{user?.email || ""}</div>
                </div>
              </div>

              <div className="mt-5 space-y-1">
                <Link
                  href="/account"
                  className={[
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active === "dashboard" ? "bg-zinc-50 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                  ].join(" ")}
                >
                  Dashboard
                </Link>
                <Link
                  href="/account/wishlist"
                  className={[
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active === "wishlist" ? "bg-zinc-50 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                  ].join(" ")}
                >
                  Wishlist
                </Link>
                <Link
                  href="/account/purchases"
                  className={[
                    "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active === "purchases" ? "bg-zinc-50 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                  ].join(" ")}
                >
                  Purchased properties
                </Link>
                <Link
                  href="/properties"
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                >
                  Browse properties
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                >
                  Contact support
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                >
                  Logout
                </button>
              </div>
            </aside>

            <main className="space-y-6">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Account</div>
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
                  {subtitle ? <p className="text-sm leading-7 text-zinc-600">{subtitle}</p> : null}
                </div>
              </div>

              {loading ? (
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                  <div className="text-sm text-zinc-600">Loading your dashboard...</div>
                </div>
              ) : !user ? (
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                  <div className="text-sm text-zinc-600">You’re not signed in.</div>
                  <div className="mt-4">
                    <Link
                      href="/auth/login"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{ backgroundColor: NAVY }}
                    >
                      Go to login
                    </Link>
                  </div>
                </div>
              ) : (
                children
              )}
            </main>
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
