"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ACCENT = "#f2555d";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/purchases", label: "Purchases" },
  { href: "/admin/blogs", label: "Blogs" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
              active ? "text-white" : "text-white/80 hover:text-white",
            ].join(" ")}
            style={
              active
                ? {
                    backgroundColor: "rgba(255,255,255,0.08)",
                    boxShadow: `0 12px 24px -18px ${ACCENT}80`,
                  }
                : undefined
            }
          >
            <span>{item.label}</span>
            {active ? (
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: ACCENT }}
                aria-hidden="true"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
