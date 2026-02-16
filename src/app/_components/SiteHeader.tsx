"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type MeResponse = {
  ok: boolean;
  data?: { user?: { name?: string; email?: string } | null };
};

export default function SiteHeader({ accent }: { accent: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then(async (r) => (await r.json()) as MeResponse)
      .then((data) => {
        if (cancelled) return;
        setUser(data.data?.user ?? null);
        try {
          const shouldOpen = window.sessionStorage.getItem("hay_auth_welcome") === "1";
          if (shouldOpen && data.data?.user) {
            window.sessionStorage.removeItem("hay_auth_welcome");
            setMenuOpen(true);
          }
        } catch { }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuOpen) return;
      const el = wrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About us" },
      { href: "/properties", label: "Property" },
      { href: "/blog", label: "Blogs" },
    ],
    []
  );

  const initials = useMemo(() => {
    const base = user?.name?.trim() || user?.email?.trim() || "";
    if (!base) return "U";
    return base.slice(0, 1).toUpperCase();
  }, [user]);

  return (
    <header className="relative z-50 flex items-center justify-between py-6">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={120} priority />
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} className={active ? "text-zinc-900" : "hover:text-zinc-900"} href={l.href}>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3" ref={wrapRef}>
        {user ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
            >
              <span className="relative grid size-8 place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-800">
                {initials}
                <span
                  className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                  aria-hidden="true"
                />
              </span>
              <span className="hidden sm:inline">Account</span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 z-50 mt-3 w-[260px] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-zinc-200">
                <div className="px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Signed in</div>
                  <div className="mt-1 truncate text-sm font-semibold text-zinc-900">{user.name || user.email}</div>
                  {user.name && user.email ? (
                    <div className="mt-1 truncate text-xs text-zinc-500">{user.email}</div>
                  ) : null}
                </div>
                <div className="h-px bg-zinc-100" />
                <div className="p-2">
                  <Link
                    href="/account/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Wishlist
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    New inquiry
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/auth/logout", { method: "POST" })
                        .catch(() => { })
                        .finally(() => {
                          setUser(null);
                          setMenuOpen(false);
                          router.push("/");
                        });
                    }}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            Sign in
          </Link>
        )}

        <Link
          href="/contact"
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          style={{ backgroundColor: accent, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Book Inspection
        </Link>
      </div>
    </header>
  );
}
