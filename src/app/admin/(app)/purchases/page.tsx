"use client";

import { useMemo, useState } from "react";
import Modal from "../../_components/Modal";
import Pagination from "../../_components/Pagination";
import { useAdminDB } from "../../_components/AdminProvider";
import { AdminPurchase } from "../../_lib/adminStore";

const ACCENT = "#f2555d";

export default function AdminPurchasesPage() {
  const { db, createPurchase, updatePurchaseSteps, deletePurchase } = useAdminDB();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState<AdminPurchase | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? db.purchases.filter(
          (p) =>
            p.propertyTitle.toLowerCase().includes(q) ||
            p.propertySlug.toLowerCase().includes(q) ||
            p.userEmail.toLowerCase().includes(q) ||
            p.userName.toLowerCase().includes(q)
        )
      : db.purchases;
    return items;
  }, [db.purchases, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Purchases</h1>
          <p className="text-sm text-zinc-600">Assign properties to users and track development phases.</p>
        </div>

        <button
          type="button"
          onClick={() => setOpenCreate(true)}
          className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          New purchase
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
        <div className="flex w-full max-w-md items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <IconSearch className="text-zinc-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
            placeholder="Search purchases..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Property</th>
                <th className="px-5 py-4">Buyer</th>
                <th className="px-5 py-4">Progress</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {slice.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-zinc-500" colSpan={5}>
                    No purchases found.
                  </td>
                </tr>
              ) : (
                slice.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900">{p.propertyTitle}</div>
                      <div className="mt-1 text-xs text-zinc-600">{p.propertySlug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900">{p.userName || "—"}</div>
                      <div className="mt-1 text-xs text-zinc-600">{p.userEmail}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-semibold text-zinc-900">{Math.max(0, Math.min(100, p.percent))}%</div>
                      <div className="mt-1 h-2 w-40 rounded-full bg-zinc-100">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(0, Math.min(100, p.percent))}%`,
                            backgroundColor: ACCENT,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={p.overallStatus} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditing(p)}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          Update phases
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!window.confirm("Delete this purchase?")) return;
                            deletePurchase(p.id).catch((err) => window.alert(err instanceof Error ? err.message : "Delete failed."));
                          }}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-zinc-100 px-5 py-4">
          <Pagination page={safePage} pageSize={pageSize} total={total} onPageChange={setPage} />
        </div>
      </div>

      <Modal open={openCreate} title="New purchase" onClose={() => setOpenCreate(false)}>
        <CreatePurchaseForm
          onCancel={() => setOpenCreate(false)}
          onSubmit={(input) =>
            createPurchase(input)
              .then(() => setOpenCreate(false))
              .catch((err) => window.alert(err instanceof Error ? err.message : "Create failed."))
          }
          users={db.users.map((u) => ({ id: u.id, label: `${u.name} (${u.email})` }))}
          properties={db.properties.map((p) => ({ id: p.id, label: `${p.title} (${p.slug})` }))}
        />
      </Modal>

      <Modal open={Boolean(editing)} title="Update phases" onClose={() => setEditing(null)}>
        {editing ? (
          <UpdatePhasesForm
            purchase={editing}
            onCancel={() => setEditing(null)}
            onSubmit={(steps) =>
              updatePurchaseSteps(editing.id, { steps })
                .then(() => setEditing(null))
                .catch((err) => window.alert(err instanceof Error ? err.message : "Update failed."))
            }
          />
        ) : null}
      </Modal>
    </div>
  );
}

function CreatePurchaseForm({
  users,
  properties,
  onCancel,
  onSubmit,
}: {
  users: Array<{ id: string; label: string }>;
  properties: Array<{ id: string; label: string }>;
  onCancel: () => void;
  onSubmit: (input: { userId: string; propertyId: string }) => void;
}) {
  const [userId, setUserId] = useState(users[0]?.id ?? "");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const canSubmit = Boolean(userId) && Boolean(propertyId);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ userId, propertyId });
      }}
      className="space-y-4"
    >
      <Field label="User">
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Property">
        <select
          value={propertyId}
          onChange={(e) => setPropertyId(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
        >
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-full border border-zinc-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900 transition hover:border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Create
        </button>
      </div>
    </form>
  );
}

function UpdatePhasesForm({
  purchase,
  onCancel,
  onSubmit,
}: {
  purchase: AdminPurchase;
  onCancel: () => void;
  onSubmit: (steps: Record<string, boolean>) => void;
}) {
  const initial = useMemo(() => {
    const o: Record<string, boolean> = {};
    for (const s of purchase.steps) o[s.key] = s.status === "COMPLETED";
    return o;
  }, [purchase.steps]);

  const [steps, setSteps] = useState<Record<string, boolean>>(initial);

  const groups = useMemo(() => {
    const byPhase = new Map<string, typeof purchase.steps>();
    for (const s of purchase.steps) {
      const key = s.phase || "Development";
      const list = byPhase.get(key) ?? [];
      list.push(s);
      byPhase.set(key, list);
    }
    return Array.from(byPhase.entries());
  }, [purchase.steps]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(steps);
      }}
      className="space-y-4"
    >
      {groups.map(([phase, list]) => (
        <div key={phase} className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">{phase}</div>
          <div className="space-y-2">
            {list.map((s) => (
              <label key={s.key} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(steps[s.key])}
                  onChange={(e) => setSteps((prev) => ({ ...prev, [s.key]: e.target.checked }))}
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900">{s.label}</div>
                  <div className="mt-1 text-xs text-zinc-600">Status: {steps[s.key] ? "COMPLETED" : "NOT COMPLETED"}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-full border border-zinc-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900 transition hover:border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:opacity-95"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Save
        </button>
      </div>
    </form>
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

function StatusPill({ status }: { status: "COMPLETED" | "ONGOING" }) {
  const cfg = status === "COMPLETED" ? { bg: "rgba(34,197,94,0.12)", fg: "#16a34a" } : { bg: "rgba(245,158,11,0.14)", fg: "#b45309" };
  return (
    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.fg }}>
      {status === "COMPLETED" ? "completed" : "ongoing"}
    </span>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.2 21 21.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

