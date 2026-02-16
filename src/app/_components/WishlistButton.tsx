"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function WishlistButton({
    propertyId,
    initialActive,
    className,
}: {
    propertyId: string;
    initialActive?: boolean;
    className?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [active, setActive] = useState(Boolean(initialActive));
    const [busy, setBusy] = useState(false);

    const nextUrl = useMemo(() => {
        const qs = searchParams?.toString() ?? "";
        return qs ? `${pathname}?${qs}` : pathname;
    }, [pathname, searchParams]);

    return (
        <button
            type="button"
            disabled={busy}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (busy) return;
                setBusy(true);
                fetch("/api/wishlist", {
                    method: active ? "DELETE" : "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ propertyId }),
                })
                    .then(async (r) => {
                        if (r.status === 401) {
                            router.push(`/auth/login?next=${encodeURIComponent(nextUrl)}`);
                            return;
                        }
                        const payload = (await r.json()) as { ok: boolean };
                        if (!payload.ok) return;
                        setActive((v) => !v);
                    })
                    .catch(() => { })
                    .finally(() => setBusy(false));
            }}
            aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
            className={[
                "grid size-10 place-items-center rounded-full bg-white/90 text-zinc-900 shadow-sm ring-1 ring-zinc-200 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60",
                className ?? "",
            ].join(" ")}
        >
            <HeartIcon filled={active} />
        </button>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 21s-7.2-4.5-9.6-8.8C.6 9 2.2 5.6 5.7 5.1c1.9-.3 3.7.6 4.7 2 1-1.4 2.8-2.3 4.7-2 3.5.5 5.1 3.9 3.3 7.1C19.2 16.5 12 21 12 21Z"
                fill={filled ? "#f2555d" : "none"}
                stroke={filled ? "#f2555d" : "currentColor"}
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}
