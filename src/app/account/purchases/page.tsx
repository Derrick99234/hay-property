"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AccountShell, { useAccount } from "../_components/AccountShell";

export default function PurchasesPage() {
  return (
    <AccountShell active="purchases" title="Purchased properties" subtitle="Track your development phases and progress.">
      <PurchasesContent />
    </AccountShell>
  );
}

function PurchasesContent() {
  const { user, loading } = useAccount();
  const [purchasesLoading, setPurchasesLoading] = useState(true);
  const [purchases, setPurchases] = useState<
    Array<{
      id: string;
      property: { id: string; slug: string; title: string; city?: string; state?: string };
      progress: { percent: number; overallStatus: "COMPLETED" | "ONGOING"; steps: Array<{ label: string; phase: string; status: string }> };
    }>
  >([]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    let cancelled = false;
    setPurchasesLoading(true);
    fetch("/api/purchases?limit=100")
      .then(async (r) => {
        const payload = (await r.json()) as { ok: boolean; data?: { items?: any[] } };
        if (!payload.ok) return;
        const items = Array.isArray(payload.data?.items) ? payload.data?.items : [];
        const cleaned = items
          .map((p) => {
            const prop = p.property ?? {};
            const progress = p.progress ?? {};
            const steps = Array.isArray(progress.steps) ? progress.steps : [];
            const overallStatus = progress.overallStatus === "COMPLETED" ? ("COMPLETED" as const) : ("ONGOING" as const);
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
                overallStatus,
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
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setPurchasesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const count = useMemo(() => (purchasesLoading ? "Loading..." : String(purchases.length)), [purchases.length, purchasesLoading]);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-100">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900">Your purchases</div>
          <p className="mt-2 text-sm leading-7 text-zinc-600">Purchased properties: {count}</p>
        </div>
        <Link
          href="/properties"
          className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
        >
          Browse properties
        </Link>
      </div>

      {purchasesLoading ? (
        <div className="mt-4 text-sm text-zinc-600">Loading...</div>
      ) : purchases.length === 0 ? (
        <div className="mt-4 text-sm text-zinc-600">No purchases yet.</div>
      ) : (
        <div className="mt-6 grid gap-4">
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
              <div key={p.id} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/properties/${p.property.slug}`} className="text-sm font-semibold text-zinc-900 hover:underline">
                      {p.property.title}
                    </Link>
                    <div className="mt-1 text-sm text-zinc-600">{location || "—"}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: p.progress.overallStatus === "COMPLETED" ? "rgba(34,197,94,0.12)" : "rgba(245,158,11,0.14)",
                        color: p.progress.overallStatus === "COMPLETED" ? "#16a34a" : "#b45309",
                      }}
                    >
                      {p.progress.overallStatus === "COMPLETED" ? "All phases completed" : "In progress"}
                    </span>
                    <div className="text-xs font-semibold text-zinc-900">{percent}%</div>
                  </div>
                </div>

                <div className="mt-4 h-2 w-full rounded-full bg-zinc-100">
                  <div className="h-2 rounded-full" style={{ width: `${percent}%`, backgroundColor: "#f2555d" }} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {Array.from(byPhase.entries()).map(([phase, steps]) => (
                    <div key={phase} className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
