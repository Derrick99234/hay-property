import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { connectMongo } from "../../../lib/mongodb";
import { Property } from "../../../models/Property";
import { User } from "../../../models/User";
import { pickPropertyImage } from "../../../lib/unsplash";
import WishlistButton from "../../_components/WishlistButton";
import SiteHeader from "../../_components/SiteHeader";
import SiteFooter from "../../_components/SiteFooter";
import { parseSessionCookie } from "../../auth/_lib/session";
import PropertyInquiryCard from "../_components/PropertyInquiryCard";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const revalidate = 30;

function fallbackCoverUrl(slug: string) {
  return pickPropertyImage(slug);
}

function formatMoneyNGN(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
}

function cookieHeaderFromStore(store: Awaited<ReturnType<typeof cookies>>) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-100">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-zinc-900">{value}</div>
    </div>
  );
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
      <div className="min-h-screen bg-white text-zinc-900">
        <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-8 sm:px-10 lg:px-16">
          <SiteHeader accent={ACCENT} />
          <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-sm text-zinc-700">
            Property service is temporarily unavailable. Please start MongoDB and refresh.
          </div>
        </div>
        <SiteFooter accent={ACCENT} navy={NAVY} />
      </div>
    );
  }
  if (!doc) notFound();

  const propertyId = String((doc as any)._id ?? "");
  let wishActive = false;
  try {
    const store = await cookies();
    const session = await parseSessionCookie(cookieHeaderFromStore(store));
    if (session?.role === "user" && mongoose.isValidObjectId(session.subject) && mongoose.isValidObjectId(propertyId)) {
      await connectMongo();
      const user = await User.findById(session.subject, { wishlist: 1 }).lean();
      const raw = Array.isArray((user as any)?.wishlist) ? (user as any).wishlist : [];
      wishActive = raw.map((id: any) => String(id)).includes(propertyId);
    }
  } catch { }

  const title = String((doc as any).title ?? "");
  const description = String((doc as any).description ?? "");
  const city = String((doc as any).city ?? "");
  const state = String((doc as any).state ?? "");
  const address = String((doc as any).address ?? "");
  const location = [city, state].filter(Boolean).join(", ");
  const price = Number((doc as any).price ?? 0);

  const images = Array.isArray((doc as any).images) ? (doc as any).images : [];
  const rawGallery: string[] = images.map((i: any) => String(i?.url ?? "").trim()).filter(Boolean);
  const filledGallery = [...rawGallery];
  for (let i = filledGallery.length; i < 5; i++) filledGallery.push(pickPropertyImage(`${slug}-${i + 1}`));
  const gallery = filledGallery.slice(0, 5);
  const coverUrl = gallery[0] || fallbackCoverUrl(slug);

  const meta = (doc as any).metadata ?? undefined;
  const rawFeatures = Array.isArray(meta?.features)
    ? meta.features
    : typeof meta?.features === "string"
      ? meta.features.split(/\n|,/)
      : [];
  const features = rawFeatures.map((x: any) => String(x).trim()).filter(Boolean).slice(0, 8);

  let similar: any[] = [];
  try {
    await connectMongo();
    const baseFilter: Record<string, unknown> = {
      status: "AVAILABLE",
      _id: { $ne: (doc as any)._id },
    };
    const primaryFilter: Record<string, unknown> = { ...baseFilter };
    if (state) primaryFilter.state = state;
    else if (city) primaryFilter.city = city;

    const primary = await Property.find(primaryFilter, null, { sort: { createdAt: -1 }, limit: 3 }).lean();
    const pickedIds = new Set(primary.map((p) => String((p as any)._id ?? "")).filter(Boolean));
    const remaining = Math.max(0, 3 - primary.length);
    const secondary =
      remaining > 0
        ? await Property.find(
            { ...baseFilter, _id: { $ne: (doc as any)._id, $nin: Array.from(pickedIds) } },
            null,
            { sort: { createdAt: -1 }, limit: remaining }
          ).lean()
        : [];

    similar = [...primary, ...secondary].slice(0, 3);
  } catch {
    similar = [];
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-8 sm:px-10 lg:px-16">
        <SiteHeader accent={ACCENT} />

        <main className="mt-10 space-y-16">
          <section className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:grid-rows-2">
              <div className="relative min-h-[280px] overflow-hidden rounded-3xl bg-zinc-200 shadow-sm ring-1 ring-zinc-100 sm:min-h-[380px] lg:row-span-2 lg:min-h-[520px]">
                <img src={coverUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" loading="eager" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:row-span-2 lg:grid-cols-2 lg:grid-rows-2">
                {gallery.slice(1, 5).map((src, idx) => (
                  <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-200 shadow-sm ring-1 ring-zinc-100 lg:aspect-auto lg:h-full">
                    <img
                      src={src}
                      alt={`${title} image ${idx + 2}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.02]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{title}</h1>
                  <div className="text-sm text-zinc-600">{location || "—"}</div>
                  {address ? <div className="text-sm text-zinc-600">{address}</div> : null}
                </div>
                <div className="flex items-center gap-3">
                  {propertyId ? <WishlistButton propertyId={propertyId} initialActive={wishActive} className="bg-white" /> : null}
                  <div className="text-base font-semibold text-zinc-900">{formatMoneyNGN(price)}</div>
                </div>
              </div>

              <div className="grid gap-3 rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-100 sm:grid-cols-2">
                <InfoItem label="Status" value="AVAILABLE" />
                <InfoItem label="Country" value={String((doc as any).country ?? "Nigeria")} />
                <InfoItem label="City / State" value={location || "—"} />
                <InfoItem label="Address" value={address || "—"} />
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">About property</div>
                <div className="text-sm leading-7 text-zinc-700">{description || "Contact us to request full details and documentation."}</div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Key features</div>
                <ul className="grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                  {(features.length
                    ? features
                    : ([
                        "Verified documentation",
                        "Accessible location",
                        "Secure investment option",
                        "Flexible payment plan",
                        "Instant allocation (subject to terms)",
                        "High growth potential",
                      ] as string[])
                  ).map((f: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-2 size-1.5 rounded-full bg-zinc-400" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
              <PropertyInquiryCard accent={ACCENT} propertyId={propertyId} propertyTitle={title} propertyLocation={location || address || "—"} />
            </div>
          </section>

          <section className="space-y-8">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Similar listing</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Similar listing</h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((p) => {
                const pid = String((p as any)._id ?? "");
                const pslug = String((p as any).slug ?? "");
                const ptitle = String((p as any).title ?? "");
                const pcity = String((p as any).city ?? "");
                const pstate = String((p as any).state ?? "");
                const ploc = [pcity, pstate].filter(Boolean).join(", ");
                const pprice = Number((p as any).price ?? 0);
                const pcover = String((p as any).images?.[0]?.url ?? "").trim() || pickPropertyImage(pslug);
                return (
                  <Link
                    key={pid}
                    href={pslug ? `/properties/${pslug}` : "/properties"}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/11] bg-zinc-200">
                      <img
                        src={pcover}
                        alt={ptitle}
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                    </div>
                    <div className="space-y-2 p-5">
                      <div className="text-sm font-semibold text-zinc-900">{ptitle}</div>
                      <div className="text-xs text-zinc-500">{ploc || "—"}</div>
                      <div className="pt-1 text-sm font-semibold text-zinc-900">{formatMoneyNGN(pprice)}</div>
                      <div className="pt-2 text-sm font-semibold" style={{ color: ACCENT }}>
                        View details →
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Link
                href="/properties"
                className="inline-flex h-11 items-center justify-center rounded-full border px-8 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm transition hover:opacity-95"
                style={{ borderColor: ACCENT, color: ACCENT }}
              >
                View all properties
              </Link>
            </div>
          </section>
        </main>
      </div>

      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}
