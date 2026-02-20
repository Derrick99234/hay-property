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

  const welcome = useMemo(() => {
    if (loading) return "Welcome";
    if (!user) return "Welcome";
    return `Welcome${user.name ? `, ${user.name}` : ""}`;
  }, [loading, user]);

  const wishlistCount = useMemo(() => {
    if (wishlistLoading) return "Loading...";
    return String(wishlistItems.length);
  }, [wishlistItems.length, wishlistLoading]);

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
