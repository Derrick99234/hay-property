import Link from "next/link";

export default function CategoryPill({
  children,
  href,
  active,
  accent,
}: {
  children: React.ReactNode;
  href: string | { pathname: string; query?: Record<string, string> };
  active?: boolean;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex h-9 items-center rounded-full px-4 text-sm font-semibold transition",
        active ? "text-white shadow-sm" : "text-zinc-700 hover:bg-zinc-100",
      ].join(" ")}
      style={
        active
          ? {
              backgroundColor: accent,
              boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
            }
          : undefined
      }
    >
      {children}
    </Link>
  );
}

