"use client";

import { useMemo, useState } from "react";
import Modal from "../../_components/Modal";
import Pagination from "../../_components/Pagination";
import { useAdminDB } from "../../_components/AdminProvider";
import { AdminProperty, formatDateShort, formatMoneyNGN } from "../../_lib/adminStore";

const ACCENT = "#f2555d";

export default function AdminPropertiesPage() {
  const { db, createProperty, updateProperty, deleteProperty } = useAdminDB();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? db.properties.filter(
          (p) =>
            p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
        )
      : db.properties;
    return items;
  }, [db.properties, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const editing = useMemo(() => db.properties.find((p) => p.id === editingId) ?? null, [db.properties, editingId]);

  const startCreate = () => {
    setEditingId(null);
    setOpen(true);
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await deleteProperty(id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete property.");
    }
  };

  const onSubmit = async (input: {
    title: string;
    slug: string;
    location: string;
    price: number;
    status: AdminProperty["status"];
    coverUrl: string;
  }) => {
    try {
      if (editing) await updateProperty(editing.id, input);
      else await createProperty(input);
      setOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Properties</h1>
          <p className="text-sm text-zinc-600">Manage properties with pagination and CRUD.</p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Add property
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
            placeholder="Search properties..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {slice.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-zinc-500" colSpan={6}>
                    No properties found.
                  </td>
                </tr>
              ) : (
                slice.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-4 font-semibold text-zinc-900">{p.title}</td>
                    <td className="px-5 py-4 text-zinc-600">{p.location}</td>
                    <td className="px-5 py-4 font-semibold text-zinc-900">{formatMoneyNGN(p.price)}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{formatDateShort(p.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(p.id)}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(p.id)}
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

      <Modal open={open} title={editing ? "Edit property" : "Add property"} onClose={() => setOpen(false)}>
        <PropertyForm initial={editing} onCancel={() => setOpen(false)} onSubmit={onSubmit} />
      </Modal>
    </div>
  );
}

function PropertyForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: AdminProperty | null;
  onCancel: () => void;
  onSubmit: (input: { title: string; slug: string; location: string; price: number; status: AdminProperty["status"]; coverUrl: string }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [coverUrl, setCoverUrl] = useState("");
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : "");
  const [status, setStatus] = useState<AdminProperty["status"]>(initial?.status ?? "DRAFT");

  const parsedPrice = Number(price.replaceAll(",", ""));
  const canSubmit =
    title.trim().length > 2 && slug.trim().length > 2 && location.trim().length > 2 && Number.isFinite(parsedPrice) && parsedPrice > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ title: title.trim(), slug: slug.trim().toLowerCase(), location: location.trim(), coverUrl: coverUrl.trim(), price: parsedPrice, status });
      }}
      className="space-y-4"
    >
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. Pride Rock Estate"
        />
      </Field>

      <Field label="Slug">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. pride-rock-estate"
        />
      </Field>

      <Field label="Location">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. Ibeju-Lekki, Lagos"
        />
      </Field>

      <Field label="Cover image (Unsplash URL)">
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="https://images.unsplash.com/..."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (NGN)">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. 12750000"
          />
        </Field>
        <Field label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminProperty["status"])}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="SOLD">SOLD</option>
          </select>
        </Field>
      </div>

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

function StatusPill({ status }: { status: AdminProperty["status"] }) {
  const cfg =
    status === "AVAILABLE"
      ? { bg: "rgba(34,197,94,0.12)", fg: "#16a34a" }
      : status === "SOLD"
        ? { bg: "rgba(239,68,68,0.12)", fg: "#ef4444" }
        : { bg: "rgba(245,158,11,0.14)", fg: "#b45309" };
  return (
    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.fg }}>
      {status}
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

