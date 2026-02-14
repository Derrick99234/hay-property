import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "./_components/AdminNav";
import AdminProvider from "./_components/AdminProvider";
import AdminHeaderActions from "./_components/AdminHeaderActions";

export const metadata: Metadata = {
  title: "Admin • HAY Property",
  description: "Admin dashboard for managing users, properties, and blogs.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0b1224] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="grid size-10 place-items-center rounded-xl bg-white/10"
              aria-hidden="true"
            >
              <span className="text-xs font-semibold tracking-[0.18em]">
                ADM
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                HAY Property
              </div>
              <div className="text-xs text-white/60">Admin Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/15 hover:text-white"
            >
              View site
            </Link>
            <AdminHeaderActions />
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[260px_1fr] md:items-start">
          <aside className="rounded-[22px] bg-white/5 p-4 ring-1 ring-white/10">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
              Manage
            </div>
            <AdminNav />
          </aside>

          <AdminProvider>
            <div className="rounded-[22px] bg-white p-6 text-zinc-900 shadow-sm ring-1 ring-zinc-100 sm:p-8">
              {children}
            </div>
          </AdminProvider>
        </div>
      </div>
    </div>
  );
}
