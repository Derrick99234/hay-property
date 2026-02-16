"use client";

import { useMemo, useState } from "react";
import Modal from "../../_components/Modal";
import Pagination from "../../_components/Pagination";
import { useAdminDB } from "../../_components/AdminProvider";
import { AdminBlog, formatDateShort } from "../../_lib/adminStore";

const ACCENT = "#f2555d";

export default function AdminBlogsPage() {
  const { db, createBlog, updateBlog, deleteBlog } = useAdminDB();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? db.blogs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.slug.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.excerpt.toLowerCase().includes(q) ||
            String(b.published).includes(q)
        )
      : db.blogs;
    return items;
  }, [db.blogs, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const editing = useMemo(() => db.blogs.find((b) => b.id === editingId) ?? null, [db.blogs, editingId]);

  const startCreate = () => {
    setEditingId(null);
    setOpen(true);
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete blog.");
    }
  };

  const onSubmit = async (input: Omit<AdminBlog, "id" | "createdAt">) => {
    try {
      if (editing) await updateBlog(editing.id, input);
      else await createBlog(input);
      setOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Save failed.");
    }
  };

  const togglePublish = async (blog: AdminBlog) => {
    try {
      await updateBlog(blog.id, { published: !blog.published });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Blogs</h1>
          <p className="text-sm text-zinc-600">Manage blog posts with pagination and CRUD.</p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Add post
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
            placeholder="Search blogs..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {slice.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-zinc-500" colSpan={5}>
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                slice.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-zinc-900">{b.title}</div>
                      <div className="mt-1 line-clamp-1 text-sm text-zinc-600">{b.excerpt}</div>
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{b.category}</td>
                    <td className="px-5 py-4">
                      <StatusPill published={b.published} />
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{formatDateShort(b.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => togglePublish(b)}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          {b.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(b.id)}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(b.id)}
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

      <Modal open={open} title={editing ? "Edit post" : "Add post"} onClose={() => setOpen(false)}>
        <BlogForm initial={editing} onCancel={() => setOpen(false)} onSubmit={onSubmit} />
      </Modal>
    </div>
  );
}

function BlogForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: AdminBlog | null;
  onCancel: () => void;
  onSubmit: (input: Omit<AdminBlog, "id" | "createdAt">) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.coverUrl ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);

  const canSubmit = title.trim().length > 4 && slug.trim().length > 2;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ title: title.trim(), slug: slug.trim().toLowerCase(), category: category.trim(), excerpt: excerpt.trim(), coverUrl: coverUrl.trim(), content: content.trim(), published });
      }}
      className="space-y-4"
    >
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. Buying Land in Lagos: A Simple Checklist"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. buying-land-in-lagos"
          />
        </Field>
        <Field label="Category">
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
            placeholder="e.g. Guide"
          />
        </Field>
      </div>

      <Field label="Cover image (Unsplash URL)">
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="https://images.unsplash.com/..."
        />
      </Field>

      <Field label="Excerpt">
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300"
          placeholder="Short description shown on cards."
        />
      </Field>

      <Field label="Content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-zinc-300"
          placeholder="Write the full article here..."
        />
      </Field>

      <Field label="Published">
        <button
          type="button"
          onClick={() => setPublished((p) => !p)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
        >
          {published ? "Yes" : "No"}
        </button>
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

function StatusPill({ published }: { published: boolean }) {
  const cfg = published ? { bg: "rgba(34,197,94,0.12)", fg: "#16a34a", label: "published" } : { bg: "rgba(245,158,11,0.14)", fg: "#b45309", label: "draft" };
  return (
    <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: cfg.bg, color: cfg.fg }}>
      {cfg.label}
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

