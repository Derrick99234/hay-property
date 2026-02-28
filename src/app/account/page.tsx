"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AccountShell, { useAccount } from "./_components/AccountShell";

export default function AccountPage() {
  return (
    <AccountShell
      active="dashboard"
      title="Dashboard"
      subtitle="View your profile, wishlist, and purchased properties progress."
    >
      <AccountDashboardContent />
    </AccountShell>
  );
}

function AccountDashboardContent() {
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<
    Array<{ id: string; slug: string; title: string; city?: string; state?: string; price?: number; currency?: string }>
  >([]);
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [purchases, setPurchases] = useState<
    Array<{
      id: string;
      property: { id: string; slug: string; title: string; city?: string; state?: string };
      progress: { percent: number; overallStatus: "COMPLETED" | "ONGOING"; steps: Array<{ label: string; phase: string; status: string }> };
    }>
  >([]);

  const { user, loading } = useAccount();

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    let cancelled = false;
    setWishlistLoading(true);
    fetch("/api/wishlist")
      .then(async (r) => {
        const payload = (await r.json()) as {
          ok: boolean;
          data?: {
            items?: Array<{
              _id?: string;
              slug?: string;
              title?: string;
              city?: string;
              state?: string;
              price?: number;
              currency?: string;
            }>;
          };
        };
        if (!payload.ok) return;
        const items = Array.isArray(payload.data?.items) ? payload.data?.items : [];
        const cleaned = items
          .map((p) => ({
            id: String(p?._id ?? ""),
            slug: String(p?.slug ?? ""),
            title: String(p?.title ?? ""),
            city: typeof p?.city === "string" ? p.city : undefined,
            state: typeof p?.state === "string" ? p.state : undefined,
            price: typeof p?.price === "number" ? p.price : undefined,
            currency: typeof p?.currency === "string" ? p.currency : undefined,
          }))
          .filter((p) => p.id && p.slug && p.title);
        if (!cancelled) setWishlistItems(cleaned);
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setWishlistLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    let cancelled = false;
    setPurchasesLoading(true);
    fetch("/api/purchases?limit=100")
      .then(async (r) => {
        const payload = (await r.json()) as {
          ok: boolean;
          data?: { items?: any[] };
        };
        if (!payload.ok) return;
        const items = Array.isArray(payload.data?.items) ? payload.data?.items : [];
        const cleaned = items
          .map((p) => {
            const prop = p.property ?? {};
            const progress = p.progress ?? {};
            const steps = Array.isArray(progress.steps) ? progress.steps : [];
            return {
              id: String(p._id ?? p.id ?? ""),
              property: {
                id: String(prop._id ?? prop.id ?? ""),
                slug: String(prop.slug ?? ""),
                title: String(prop.title ?? ""),
                city: typeof prop.city === "string" ? prop.city : undefined,
                state: typeof prop.state === "string" ? prop.state : undefined,
              },
              progress: {
                percent: Number(progress.percent ?? 0) || 0,
                overallStatus: progress.overallStatus === "COMPLETED" ? "COMPLETED" : "ONGOING",
                steps: steps
                  .map((s: any) => ({
                    label: String(s.label ?? ""),
                    phase: String(s.phase ?? ""),
                    status: String(s.status ?? ""),
                  }))
                  .filter((s: any) => s.label),
              },
            };
          })
          .filter((p) => p.id && p.property.id && p.property.slug && p.property.title);
        if (!cancelled) setPurchases(cleaned as Array<{
          id: string;
          property: { id: string; slug: string; title: string; city?: string; state?: string };
          progress: { percent: number; overallStatus: "COMPLETED" | "ONGOING"; steps: Array<{ label: string; phase: string; status: string }> };
        }>);
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setPurchasesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const wishlistCount = useMemo(() => {
    if (wishlistLoading) return "Loading...";
    return String(wishlistItems.length);
  }, [wishlistItems.length, wishlistLoading]);

  const purchasesCount = useMemo(() => {
    if (purchasesLoading) return "Loading...";
    return String(purchases.length);
  }, [purchases.length, purchasesLoading]);

  const title = useMemo(() => {
    if (loading) return "Welcome";
    if (!user) return "Welcome";
    return `Welcome${user.name ? `, ${user.name}` : ""}`;
  }, [loading, user]);

  return (
    <>
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Welcome</div>
        <div className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">{title}</div>
        <div className="mt-2 text-sm text-zinc-600">Here’s what’s happening with your account today.</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card title="Email" value={loading ? "Loading..." : user?.email ?? "—"} />
        <Card title="Status" value={loading ? "Loading..." : user ? "Logged in" : "Not logged in"} />
        <Card title="Wishlist" value={wishlistCount} />
        <Card title="Purchases" value={purchasesCount} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">Quick actions</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/properties"
              className="inline-flex h-11 items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{
                backgroundColor: "#1d2b56",
              }}
            >
              Browse properties
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
            >
              Contact support
            </Link>
            <Link
              href="/account/wishlist"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
            >
              View wishlist
            </Link>
            <Link
              href="/account/purchases"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
            >
              Purchased properties
            </Link>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">Wishlist preview</div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">Saved properties you might want to revisit.</p>
          {wishlistLoading ? (
            <div className="mt-4 text-sm text-zinc-600">Loading...</div>
          ) : wishlistItems.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">No saved properties yet.</div>
          ) : (
            <div className="mt-4 space-y-3">
              {wishlistItems.slice(0, 3).map((p) => {
                const location = [p.city, p.state].filter(Boolean).join(", ");
                return (
                  <Link
                    key={p.id}
                    href={`/properties/${p.slug}`}
                    className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
                  >
                    <div className="text-sm font-semibold text-zinc-900">{p.title}</div>
                    <div className="mt-1 text-sm text-zinc-600">{location || "—"}</div>
                  </Link>
                );
              })}
              {wishlistItems.length > 3 ? (
                <Link href="/account/wishlist" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
                  View all →
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Purchased properties</div>
            <p className="mt-2 text-sm leading-7 text-zinc-600">Track your development phases on the purchases page.</p>
          </div>
          <Link
            href="/account/purchases"
            className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: "#f2555d", boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
          >
            View purchases
          </Link>
        </div>
        <div className="mt-4 text-sm text-zinc-600">
          {purchasesLoading ? "Loading..." : purchases.length === 0 ? "No purchases yet." : `${purchases.length} purchase(s)`}
        </div>
      </div>
    </>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
}
