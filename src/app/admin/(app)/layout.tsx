import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminHeaderActions from "../_components/AdminHeaderActions";
import AdminNav from "../_components/AdminNav";
import AdminProvider from "../_components/AdminProvider";
import { parseSessionCookie } from "../../auth/_lib/session";

export const metadata: Metadata = {
  title: "Admin • HAY Property",
  description: "Admin dashboard for managing users, properties, and blogs.",
};

function cookieHeaderFromStore(store: Awaited<ReturnType<typeof cookies>>) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export default async function AdminAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const session = await parseSessionCookie(cookieHeaderFromStore(store));
  if (!session || session.role !== "admin") redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0b1224] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} />
            <div className="leading-tight">
              <div className="text-xs text-white/60">Admin</div>
            </div>
          </Link>

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
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Manage</div>
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

