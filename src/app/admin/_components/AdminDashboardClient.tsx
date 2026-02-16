"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatDateShort } from "../_lib/adminStore";
import { useAdminDB } from "./AdminProvider";

const ACCENT = "#f2555d";

export default function AdminDashboardClient() {
  const { db, loading, refresh } = useAdminDB();

  const latest = useMemo(() => {
    const users = [...db.users].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const properties = [...db.properties].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const blogs = [...db.blogs].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return {
      user: users[0],
      property: properties[0],
      blog: blogs[0],
    };
  }, [db.blogs, db.properties, db.users]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Users" value={db.users.length} href="/admin/users" />
        <StatCard
          title="Properties"
          value={db.properties.length}
          href="/admin/properties"
        />
        <StatCard title="Blogs" value={db.blogs.length} href="/admin/blogs" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RecentCard
          title="Latest user"
          primary={latest.user?.name ?? "—"}
          secondary={latest.user?.email ?? "—"}
          meta={latest.user?.createdAt ? formatDateShort(latest.user.createdAt) : "—"}
          href="/admin/users"
        />
        <RecentCard
          title="Latest property"
          primary={latest.property?.title ?? "—"}
          secondary={latest.property?.location ?? "—"}
          meta={
            latest.property?.createdAt
              ? formatDateShort(latest.property.createdAt)
              : "—"
          }
          href="/admin/properties"
        />
        <RecentCard
          title="Latest blog"
          primary={latest.blog?.title ?? "—"}
          secondary={latest.blog?.category ?? "—"}
          meta={latest.blog?.createdAt ? formatDateShort(latest.blog.createdAt) : "—"}
          href="/admin/blogs"
        />
      </div>

      <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-zinc-900">
              Live database
            </div>
            <div className="text-sm text-zinc-600">
              Refresh to get live data.
            </div>
          </div>
          <button
            type="button"
            onClick={() => refresh().catch(() => { })}
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {title}
          </div>
          <div className="text-2xl font-semibold tracking-tight text-zinc-900">
            {value}
          </div>
        </div>
        <div
          className="grid size-10 place-items-center rounded-full text-white"
          style={{
            backgroundColor: ACCENT,
            boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
          }}
          aria-hidden="true"
        >
          <IconArrow />
        </div>
      </div>
    </Link>
  );
}

function RecentCard({
  title,
  primary,
  secondary,
  meta,
  href,
}: {
  title: string;
  primary: string;
  secondary: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
        {title}
      </div>
      <div className="mt-3 text-base font-semibold tracking-tight text-zinc-900">
        {primary}
      </div>
      <div className="mt-1 text-sm text-zinc-600">{secondary}</div>
      <div className="mt-4 text-xs font-semibold text-zinc-500">{meta}</div>
    </Link>
  );
}

function IconArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17 17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
