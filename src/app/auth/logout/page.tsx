"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/logout", { method: "POST" })
      .catch(() => {})
      .finally(() => router.replace("/auth/login"));
  }, [router]);

  return (
    <div className="text-sm text-zinc-600">
      Logging out...
    </div>
  );
}
