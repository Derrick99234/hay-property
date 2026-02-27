"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SiteFooter from "../_components/SiteFooter";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
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
        if (!cancelled) setPurchases(cleaned);
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setPurchasesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const welcome = useMemo(() => {
    if (loading) return "Welcome";
    if (!user) return "Welcome";
    return `Welcome${user.name ? `, ${user.name}` : ""}`;
  }, [loading, user]);

  const wishlistCount = useMemo(() => {
    if (wishlistLoading) return "Loading...";
    return String(wishlistItems.length);
  }, [wishlistItems.length, wishlistLoading]);

  const purchasesCount = useMemo(() => {
    if (purchasesLoading) return "Loading...";
    return String(purchases.length);
  }, [purchases.length, purchasesLoading]);

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
                .catch(() => { })
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
          <Card title="Wishlist" value={wishlistCount} />
          <Card title="Purchases" value={purchasesCount} />
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

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">Wishlist</div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">Save properties you like and come back anytime.</p>
          {wishlistLoading ? (
            <div className="mt-4 text-sm text-zinc-600">Loading...</div>
          ) : wishlistItems.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">No saved properties yet.</div>
          ) : (
            <div className="mt-5 grid gap-3">
              {wishlistItems.map((p) => {
                const location = [p.city, p.state].filter(Boolean).join(", ");
                const money =
                  typeof p.price === "number"
                    ? p.price.toLocaleString(undefined, {
                      style: "currency",
                      currency: p.currency ?? "NGN",
                      maximumFractionDigits: 0,
                    })
                    : null;
                return (
                  <Link
                    key={p.id}
                    href={`/properties/${p.slug}`}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300"
                  >
                    <div className="text-sm font-semibold text-zinc-900">{p.title}</div>
                    <div className="mt-1 text-sm text-zinc-600">{location || "—"}</div>
                    {money ? <div className="mt-2 text-sm font-semibold text-zinc-900">{money}</div> : null}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">Purchased properties</div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">Track your property development phases.</p>
          {purchasesLoading ? (
            <div className="mt-4 text-sm text-zinc-600">Loading...</div>
          ) : purchases.length === 0 ? (
            <div className="mt-4 text-sm text-zinc-600">No purchases yet.</div>
          ) : (
            <div className="mt-5 grid gap-3">
              {purchases.map((p) => {
                const location = [p.property.city, p.property.state].filter(Boolean).join(", ");
                const percent = Math.max(0, Math.min(100, p.progress.percent));
                const byPhase = new Map<string, Array<{ label: string; status: string }>>();
                for (const s of p.progress.steps) {
                  const key = s.phase || "Development";
                  const list = byPhase.get(key) ?? [];
                  list.push({ label: s.label, status: s.status });
                  byPhase.set(key, list);
                }

                return (
                  <Link
                    key={p.id}
                    href={`/properties/${p.property.slug}`}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-zinc-300"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900">{p.property.title}</div>
                        <div className="mt-1 text-sm text-zinc-600">{location || "—"}</div>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="text-xs font-semibold text-zinc-900">{percent}%</div>
                          <div className="h-2 w-40 rounded-full bg-zinc-100">
                            <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: ACCENT }} />
                          </div>
                          <span
                            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              backgroundColor: p.progress.overallStatus === "COMPLETED" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.14)",
                              color: p.progress.overallStatus === "COMPLETED" ? "#16a34a" : "#b45309",
                            }}
                          >
                            {p.progress.overallStatus === "COMPLETED" ? "all phases completed" : "in progress"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {Array.from(byPhase.entries()).map(([phase, steps]) => (
                        <div key={phase} className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{phase}</div>
                          <div className="mt-3 space-y-2">
                            {steps.map((s) => (
                              <div key={s.label} className="flex items-center justify-between gap-3 text-sm">
                                <div className="min-w-0 truncate text-zinc-800">{s.label}</div>
                                <span className="shrink-0 text-xs font-semibold text-zinc-600">
                                  {s.status === "COMPLETED" ? "Completed" : s.status === "ONGOING" ? "Ongoing" : "Pending"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
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
