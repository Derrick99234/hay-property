import Link from "next/link";
import { notFound } from "next/navigation";
import { connectMongo } from "../../../lib/mongodb";
import { Property } from "../../../models/Property";
import { pickPropertyImage } from "../../../lib/unsplash";

const ACCENT = "#f2555d";

export const revalidate = 30;

function fallbackCoverUrl(slug: string) {
  return pickPropertyImage(slug);
}

function formatMoneyNGN(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc: any | null = null;
  let dbError = false;
  try {
    await connectMongo();
    doc = await Property.findOne({ slug: slug.toLowerCase(), status: "AVAILABLE" }).lean();
  } catch {
    dbError = true;
  }
  if (dbError) {
    return (
      <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
        <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-10">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
          >
            <span aria-hidden="true">←</span>
            Back to properties
          </Link>
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-700">
            Property service is temporarily unavailable. Please start MongoDB and refresh.
          </div>
        </div>
      </div>
    );
  }
  if (!doc) notFound();

  const title = String((doc as any).title ?? "");
  const description = String((doc as any).description ?? "");
  const city = String((doc as any).city ?? "");
  const state = String((doc as any).state ?? "");
  const address = String((doc as any).address ?? "");
  const location = [city, state].filter(Boolean).join(", ");
  const price = Number((doc as any).price ?? 0);

  const images = Array.isArray((doc as any).images) ? (doc as any).images : [];
  const coverUrl = String(images?.[0]?.url ?? "").trim() || fallbackCoverUrl(slug);
  const gallery: string[] = images
    .map((i: any) => String(i?.url ?? "").trim())
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:text-zinc-900"
          >
            <span aria-hidden="true">←</span>
            Back to properties
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
          >
            Enquire now
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-100">
          <div className="relative aspect-[16/9] bg-zinc-200">
            <img
              src={coverUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
              AVAILABLE
            </div>
          </div>

          <div className="space-y-6 p-7 sm:p-10">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                <span>{location || "—"}</span>
                <span className="size-1 rounded-full bg-zinc-300" aria-hidden="true" />
                <span className="font-semibold text-zinc-900">{formatMoneyNGN(price)}</span>
              </div>
              {address ? <div className="text-sm text-zinc-600">{address}</div> : null}
            </div>

            {description ? (
              <div className="rounded-2xl bg-zinc-50 p-5 text-sm leading-7 text-zinc-700 ring-1 ring-zinc-100">
                {description}
              </div>
            ) : null}

            {gallery.length > 1 ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Gallery</div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {gallery.map((src, idx) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-200">
                      <img
                        src={src}
                        alt={`${title} image ${idx + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
