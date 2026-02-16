import Link from "next/link";
import { IconArrowUpRight, IconPin } from "../icons";

export function MediaPlaceholder({ variant }: { variant?: "card" | "wide" }) {
  return (
    <div
      className={[
        "absolute inset-0",
        variant === "wide"
          ? "bg-[radial-gradient(900px_480px_at_30%_30%,rgba(34,197,94,0.22),transparent),radial-gradient(900px_520px_at_85%_25%,rgba(59,130,246,0.18),transparent),linear-gradient(120deg,rgba(255,255,255,0.50),rgba(244,244,245,0.65))]"
          : "bg-[radial-gradient(700px_420px_at_25%_20%,rgba(34,197,94,0.20),transparent),radial-gradient(700px_420px_at_90%_85%,rgba(59,130,246,0.16),transparent),linear-gradient(120deg,rgba(255,255,255,0.55),rgba(244,244,245,0.70))]",
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

export function PropertyCard({
  title,
  location,
  price,
  showBrand,
  imageUrl,
  accent,
}: {
  title: string;
  location: string;
  price: string;
  showBrand?: boolean;
  imageUrl?: string;
  accent: string;
}) {
  return (
    <Link
      href="/properties"
      className="relative overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden rounded-[22px] bg-zinc-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <MediaPlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {showBrand ? (
          <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur">
            HAY
          </div>
        ) : null}
        <div
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white shadow-sm"
          style={{
            backgroundColor: accent,
            boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
          }}
          aria-hidden="true"
        >
          <IconArrowUpRight />
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <div className="text-sm font-semibold text-zinc-900">{title}</div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <IconPin className="text-zinc-400" />
            {location}
          </div>
        </div>
        <div className="text-sm font-semibold" style={{ color: accent }}>
          {price}
        </div>
      </div>
    </Link>
  );
}

export function WidePropertyCard({
  title,
  location,
  price,
  imageUrl,
  accent,
}: {
  title: string;
  location: string;
  price: string;
  imageUrl?: string;
  accent: string;
}) {
  return (
    <Link
      href="/properties"
      className="relative overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden rounded-[22px] bg-zinc-200 md:h-52">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <MediaPlaceholder variant="wide" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        <div
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white shadow-sm"
          style={{
            backgroundColor: accent,
            boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
          }}
          aria-hidden="true"
        >
          <IconArrowUpRight />
        </div>
      </div>
      <div className="space-y-2 p-5">
        <div className="text-sm font-semibold text-zinc-900">{title}</div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <IconPin className="text-zinc-400" />
          {location}
        </div>
        <div className="text-sm font-semibold" style={{ color: accent }}>
          {price}
        </div>
      </div>
    </Link>
  );
}
