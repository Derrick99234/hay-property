"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const ACCENT = "#f2555d";

type WishlistItem = {
    id: string;
    slug: string;
    title: string;
    city?: string;
    state?: string;
    price?: number;
    currency?: string;
};

export default function WishlistPage() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [removing, setRemoving] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
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
                const raw = Array.isArray(payload.data?.items) ? payload.data?.items : [];
                const cleaned = raw
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
                setItems(cleaned);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        load();
    }, []);

    const count = useMemo(() => (loading ? "Loading..." : String(items.length)), [items.length, loading]);

    return (
        <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
            <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} />
                    </Link>
                    <Link
                        href="/properties"
                        className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                    >
                        Browse properties
                    </Link>
                </div>

                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-1">
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Account</div>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Wishlist</h1>
                        <div className="text-sm text-zinc-600">Saved properties: {count}</div>
                    </div>
                    <Link href="/account" className="text-sm font-semibold text-zinc-700 hover:text-zinc-900">
                        Back to account →
                    </Link>
                </div>

                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
                    {loading ? (
                        <div className="text-sm text-zinc-600">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="text-sm text-zinc-600">No saved properties yet.</div>
                    ) : (
                        <div className="grid gap-3">
                            {items.map((p) => {
                                const location = [p.city, p.state].filter(Boolean).join(", ");
                                const money =
                                    typeof p.price === "number"
                                        ? p.price.toLocaleString(undefined, {
                                            style: "currency",
                                            currency: p.currency ?? "NGN",
                                            maximumFractionDigits: 0,
                                        })
                                        : null;

                                const busy = removing === p.id;

                                return (
                                    <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <Link href={`/properties/${p.slug}`} className="block truncate text-sm font-semibold text-zinc-900">
                                                    {p.title}
                                                </Link>
                                                <div className="mt-1 text-sm text-zinc-600">{location || "—"}</div>
                                                {money ? <div className="mt-2 text-sm font-semibold text-zinc-900">{money}</div> : null}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/properties/${p.slug}`}
                                                    className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    type="button"
                                                    disabled={busy}
                                                    onClick={() => {
                                                        if (busy) return;
                                                        setRemoving(p.id);
                                                        fetch("/api/wishlist", {
                                                            method: "DELETE",
                                                            headers: { "content-type": "application/json" },
                                                            body: JSON.stringify({ propertyId: p.id }),
                                                        })
                                                            .then(async (r) => {
                                                                const payload = (await r.json()) as { ok: boolean };
                                                                if (!payload.ok) return;
                                                                setItems((prev) => prev.filter((x) => x.id !== p.id));
                                                            })
                                                            .catch(() => { })
                                                            .finally(() => setRemoving(null));
                                                    }}
                                                    className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                                                    style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
