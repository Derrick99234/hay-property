"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "../../_components/Modal";
import Pagination from "../../_components/Pagination";
import { useAdminDB } from "../../_components/AdminProvider";
import { AdminProperty, formatDateShort } from "../../_lib/adminStore";
import Image from "next/image";

const ACCENT = "#f2555d";

function formatMoney(value: number, currency: string) {
  const safe = Number.isFinite(value) ? value : 0;
  const cur = currency || "NGN";
  return safe.toLocaleString(undefined, { style: "currency", currency: cur, maximumFractionDigits: 0 });
}

function createLocalId() {
  const g = globalThis as unknown as { crypto?: Crypto };
  return g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`.replaceAll(".", "");
}

export default function AdminPropertiesPage() {
  const { db, createProperty, updateProperty, deleteProperty } = useAdminDB();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    description: string;
    features: string[];
    price: number;
    currency: string;
    status: AdminProperty["status"];
    address: string;
    city: string;
    state: string;
    country: string;
    keepImageUrls: string[];
    imageFiles: File[];
  }) => {
    if (saving) return;
    setSaving(true);
    try {
      if (editing) await updateProperty(editing.id, input);
      else await createProperty(input);
      setOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
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
          disabled={saving}
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
                    <td className="px-5 py-4 font-semibold text-zinc-900">{formatMoney(p.price, p.currency)}</td>
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
        <PropertyForm initial={editing} saving={saving} onCancel={() => setOpen(false)} onSubmit={onSubmit} />
      </Modal>
    </div>
  );
}

function PropertyForm({
  initial,
  saving,
  onCancel,
  onSubmit,
}: {
  initial: AdminProperty | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (input: {
    title: string;
    slug: string;
    description: string;
    features: string[];
    price: number;
    currency: string;
    status: AdminProperty["status"];
    address: string;
    city: string;
    state: string;
    country: string;
    keepImageUrls: string[];
    imageFiles: File[];
  }) => void;
}) {
  type KeepImage = { id: string; url: string };
  type NewImage = { id: string; file: File; preview: string };

  const initialTitle = initial?.title ?? "";
  const initialSlug = initial?.slug ?? "";
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [featuresText, setFeaturesText] = useState(Array.isArray(initial?.features) ? initial!.features.join("\n") : "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [country, setCountry] = useState(initial?.country ?? "Nigeria");
  const [keepImages, setKeepImages] = useState<KeepImage[]>(
    Array.isArray(initial?.imageUrls) ? initial!.imageUrls.map((url) => ({ id: createLocalId(), url })) : []
  );
  const [newImages, setNewImages] = useState<NewImage[]>([]);
  const [price, setPrice] = useState(typeof initial?.price === "number" ? String(initial.price) : "");
  const [currency, setCurrency] = useState(initial?.currency ?? "NGN");
  const [status, setStatus] = useState<AdminProperty["status"]>(initial?.status ?? "DRAFT");

  useEffect(() => {
    const urls = Array.isArray(initial?.imageUrls) ? initial!.imageUrls : [];
    setKeepImages(urls.map((url) => ({ id: createLocalId(), url })));
    setNewImages((prev) => {
      for (const img of prev) URL.revokeObjectURL(img.preview);
      return [];
    });
  }, [initial?.id]);

  useEffect(() => {
    const nextTitle = title.trim();
    if (!initial) {
      setSlug(toSlug(nextTitle));
      return;
    }
    if (nextTitle && nextTitle !== initialTitle.trim()) {
      setSlug(toSlug(nextTitle));
      return;
    }
    setSlug(initialSlug.trim().length > 2 ? initialSlug : toSlug(nextTitle || initialTitle));
  }, [initial, initialSlug, initialTitle, title]);

  const parsedPrice = Number(price.replaceAll(",", ""));
  const imageCount = (initial ? keepImages.length : 0) + newImages.length;
  const canSubmit =
    title.trim().length > 2 &&
    slug.trim().length > 2 &&
    (city.trim().length > 1 || state.trim().length > 1 || address.trim().length > 1) &&
    Number.isFinite(parsedPrice) &&
    parsedPrice >= 0 &&
    imageCount <= 5 &&
    !saving;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          title: title.trim(),
          slug: slug.trim().toLowerCase(),
          description: description.trim(),
          features: featuresText
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean)
            .slice(0, 20),
          keepImageUrls: keepImages.map((img) => img.url).map((u) => String(u ?? "").trim()).filter(Boolean).slice(0, 5),
          imageFiles: newImages.map((img) => img.file),
          price: parsedPrice,
          currency: currency.trim() || "NGN",
          status,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim() || "Nigeria",
        });
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

      <Field label="Slug (auto)">
        <input
          value={slug}
          readOnly
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. pride-rock-estate"
        />
      </Field>

      <Field label="Location">
        <input
          value={[city, state].filter(Boolean).join(", ") || address}
          readOnly
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="Set address/city/state below"
        />
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-28 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300"
          placeholder="Short description of the property"
        />
      </Field>

      <Field label="Key features (one per line)">
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="min-h-28 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300"
          placeholder={"Verified documentation\nAccessible location\nFlexible payment plan"}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Currency">
          <input
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. NGN"
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

      <Field label="Address">
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="Street address (optional)"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. Ibeju-Lekki"
          />
        </Field>
        <Field label="State">
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. Lagos"
          />
        </Field>
        <Field label="Country">
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. Nigeria"
          />
        </Field>
      </div>

      <Field label={initial ? "Images (add files, up to 5 total)" : "Images (0–5 files)"}>
        <div className="space-y-2">
          {initial && keepImages.length ? (
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">Current images</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {keepImages.slice(0, 5).map((img) => (
                  <div key={img.id} className="relative overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200">
                    <div className="h-36 w-full">
                      <Image src={img.url} alt=""
                        width={200}
                        height={200}
                        className="h-36 w-full object-cover" loading="lazy" referrerPolicy="no-referrer" draggable={false} />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(e)
                        console.log(`Deleting image ${img.url}`)
                        console.log(`Property ID: ${initial.id}`)
                        if (!initial?.id) return;
                        if (!window.confirm("Delete this image from the server?")) return;
                        fetch("/api/uploads/property-images", {
                          method: "DELETE",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ propertyId: initial.id, url: img.url }),
                        })
                          .then(async (r) => {
                            const payload = (await r.json()) as { ok: boolean; error?: string };
                            if (!payload.ok) throw new Error(payload.error || "Failed to delete image.");
                            setKeepImages((prev) => prev.filter((x) => x.id !== img.id));
                          })
                          .catch((err) => window.alert(err instanceof Error ? err.message : "Failed to delete image."));
                      }}
                      disabled={saving}
                      className="absolute cursor-pointer right-2 top-2 grid size-9 place-items-center rounded-full bg-white/90 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {newImages.length ? (
            <div className="space-y-2">
              <div className="text-xs text-zinc-500">New uploads</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {newImages.map((img) => (
                  <div key={img.id} className="relative overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200">
                    <img src={img.preview} alt="" className="h-36 w-full select-none object-cover" loading="lazy" draggable={false} />
                    <button
                      type="button"
                      onClick={() =>
                        setNewImages((prev) => {
                          const target = prev.find((x) => x.id === img.id);
                          if (target) URL.revokeObjectURL(target.preview);
                          return prev.filter((x) => x.id !== img.id);
                        })
                      }
                      disabled={saving}
                      className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-white/90 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Cancel upload"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.currentTarget.value = "";
              setNewImages((prev) => {
                const remaining = Math.max(0, 5 - keepImages.length - prev.length);
                if (remaining <= 0) return prev;
                const next = [...prev];
                for (const f of files.slice(0, remaining)) {
                  next.push({ id: createLocalId(), file: f, preview: URL.createObjectURL(f) });
                }
                return next;
              });
            }}
            className="block w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300"
          />
          <div className="text-xs text-zinc-500">
            Total: {Math.min(5, imageCount)}/5
          </div>
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="numeric"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. 12750000"
          />
        </Field>
        <div />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-10 rounded-full cursor-pointer border border-zinc-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900 transition hover:border-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-10 cursor-pointer rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="block space-y-2">
      <label className="text-xs font-semibold text-zinc-600">{label}</label>
      {children}
    </div>
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

function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16.2 21 21.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
