"use client";

import { useRouter } from "next/navigation";

export default function AdminHeaderActions() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        fetch("/api/admin/auth/logout", { method: "POST" })
          .catch(() => {})
          .finally(() => router.push("/admin/login"));
      }}
      className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/15 hover:text-white"
    >
      Logout
    </button>
  );
}
