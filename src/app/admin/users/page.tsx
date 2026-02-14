"use client";

import { useMemo, useState } from "react";
import Modal from "../_components/Modal";
import Pagination from "../_components/Pagination";
import { useAdminDB } from "../_components/AdminProvider";
import { AdminUser, formatDateShort } from "../_lib/adminStore";

const ACCENT = "#f2555d";

export default function AdminUsersPage() {
  const { db, createUser, updateUser, deleteUser } = useAdminDB();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items = q
      ? db.users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.status.toLowerCase().includes(q)
        )
      : db.users;
    return items;
  }, [db.users, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const editing = useMemo(
    () => db.users.find((u) => u.id === editingId) ?? null,
    [db.users, editingId]
  );

  const startCreate = () => {
    setEditingId(null);
    setOpen(true);
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Failed to delete user.");
    }
  };

  const onSubmit = async (input: { name: string; email: string; password: string; status: AdminUser["status"] }) => {
    try {
      if (editing) {
        await updateUser(editing.id, {
          name: input.name,
          email: input.email,
          status: input.status,
          password: input.password ? input.password : undefined,
        });
      } else {
        await createUser(input);
      }
      setOpen(false);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Admin
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Users
          </h1>
          <p className="text-sm text-zinc-600">
            Manage users with pagination and CRUD.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          style={{
            backgroundColor: ACCENT,
            boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
          }}
        >
          Add user
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
            placeholder="Search users..."
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Created</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {slice.length === 0 ? (
                <tr>
                  <td className="px-5 py-10 text-center text-zinc-500" colSpan={5}>
                    No users found.
                  </td>
                </tr>
              ) : (
                slice.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-50/50">
                    <td className="px-5 py-4 font-semibold text-zinc-900">
                      {u.name}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">{u.email}</td>
                    <td className="px-5 py-4">
                      <StatusDot status={u.status} />
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {formatDateShort(u.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(u.id)}
                          className="h-9 rounded-full border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-900 transition hover:border-zinc-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(u.id)}
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
          <Pagination
            page={safePage}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? "Edit user" : "Add user"}
        onClose={() => setOpen(false)}
      >
        <UserForm
          initial={editing}
          onCancel={() => setOpen(false)}
          onSubmit={onSubmit}
        />
      </Modal>
    </div>
  );
}

function UserForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: AdminUser | null;
  onCancel: () => void;
  onSubmit: (input: { name: string; email: string; password: string; status: AdminUser["status"] }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<AdminUser["status"]>(initial?.status ?? "ACTIVE");

  const canSubmit =
    name.trim().length > 1 &&
    email.trim().includes("@") &&
    (initial ? true : password.length >= 6);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          name: name.trim(),
          email: email.trim(),
          status,
          password,
        });
      }}
      className="space-y-4"
    >
      <Field label="Full name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. Jane Doe"
        />
      </Field>

      <Field label="Email">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder="e.g. jane@example.com"
        />
      </Field>

      <Field label={initial ? "New password (optional)" : "Password"}>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
          placeholder={initial ? "Leave blank to keep current" : "Min 6 characters"}
        />
      </Field>

      <Field label="Status">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AdminUser["status"])}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-zinc-300"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="DISABLED">DISABLED</option>
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
          style={{
            backgroundColor: ACCENT,
            boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
          }}
        >
          Save
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="text-xs font-semibold text-zinc-600">{label}</div>
      {children}
    </label>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

function StatusDot({ status }: { status: AdminUser["status"] }) {
  const color = status === "ACTIVE" ? "#22c55e" : "#f59e0b";
  return (
    <span className="inline-flex items-center gap-2 text-sm text-zinc-700">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {status}
    </span>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 16.2 21 21.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
