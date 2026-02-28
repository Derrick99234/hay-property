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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  useEffect(() => {
    if (!mobileOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMobileOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, mobileOpen]);

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/about", label: "About us" },
      { href: "/properties", label: "Property" },
      { href: "/blog", label: "Blogs" },
      { href: "/contact", label: "Contact" },
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
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="grid size-11 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:border-zinc-300 md:hidden"
        >
          <IconMenu />
        </button>

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
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account/purchases"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Purchases
                  </Link>
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
          className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 md:inline-block"
          style={{ backgroundColor: accent, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
        >
          Book Inspection
        </Link>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition motion-reduce:transition-none"
          />
          <div className="absolute right-4 top-4 w-[min(92vw,380px)] overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-zinc-200 transition motion-reduce:transition-none">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="text-sm font-semibold text-zinc-900">Menu</div>
              <button
                type="button"
                autoFocus
                onClick={() => setMobileOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:border-zinc-300"
              >
                <IconClose />
              </button>
            </div>
            <div className="h-px bg-zinc-100" />
            <nav className="p-2">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "block rounded-2xl px-4 py-3 text-sm font-semibold transition",
                      active ? "bg-zinc-50 text-zinc-900" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                    ].join(" ")}
                  >
                    {l.label}
                  </Link>
                );
              })}
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/account/purchases"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Purchases
                  </Link>
                  <Link
                    href="/account/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Wishlist
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      fetch("/api/auth/logout", { method: "POST" })
                        .catch(() => {})
                        .finally(() => {
                          setUser(null);
                          setMobileOpen(false);
                          setMenuOpen(false);
                          router.push("/");
                        });
                    }}
                    className="mt-1 w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 block rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
                >
                  Sign in
                </Link>
              )}
            </nav>
            <div className="p-4">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-full px-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:opacity-95"
                style={{ backgroundColor: accent, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
              >
                Book inspection
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function IconMenu() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
