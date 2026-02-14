import Link from "next/link";
import HeroCarousel from "./_components/HeroCarousel";
import { pickLandImage } from "../lib/unsplash";
import NewsletterForm from "./_components/NewsletterForm";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between py-6">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight">
                  HAY Property
                </span>
                <span className="text-[11px] text-zinc-500">
                  Real Estate &amp; Land
                </span>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
              <Link className="text-zinc-900" href="/">
                Home
              </Link>
              <Link className="hover:text-zinc-900" href="/about">
                About us
              </Link>
              <Link className="hover:text-zinc-900" href="/properties">
                Property
              </Link>
              <Link className="hover:text-zinc-900" href="/blog">
                Blogs
              </Link>
            </nav>

            <Link
              href="/contact"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
              }}
            >
              Get in touch
            </Link>
        </header>

        <main className="pb-16">
            <section className="relative">
              <HeroCarousel accent={ACCENT} />

              <div className="absolute -bottom-10 right-6 hidden w-[260px] rounded-2xl bg-white px-4 py-4 shadow-lg shadow-black/10 sm:block">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-zinc-500">
                      Trust score
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-semibold leading-none">
                        4.95
                      </div>
                      <div className="flex items-center gap-0.5">
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                        <IconStar style={{ color: ACCENT }} />
                      </div>
                    </div>
                  </div>
                  <div className="grid size-12 place-items-center rounded-2xl bg-[rgba(242,85,93,0.12)]">
                    <IconShield />
                  </div>
                </div>
              </div>
            </section>

            <section id="latest" className="mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Latest property
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Latest property: Harvest Grove
                  </h2>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm">
                  <div className="text-sm font-semibold" style={{ color: ACCENT }}>
                    4.95
                  </div>
                  <div className="flex items-center gap-0.5">
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                    <IconStar style={{ color: ACCENT }} />
                  </div>
                  <div className="text-xs font-semibold text-zinc-500">100%</div>
                </div>
              </div>

              <div className="mt-6 grid gap-8 md:grid-cols-2">
                <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
                  Real estate investments shouldn’t feel complicated. Explore
                  vetted land opportunities with clear pricing, verified
                  locations, and the documentation you need to buy with
                  confidence.
                </p>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-2xl bg-[rgba(242,85,93,0.12)]">
                        <IconSpark />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          Verified documents
                        </div>
                        <div className="text-xs text-zinc-500">
                          Purchase-ready listings
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      New
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <PropertyCard
                  title="Sekemangni village"
                  location="Ibeju-Lekki, Lagos"
                  price="$963.85"
                  showBrand
                />
                <PropertyCard
                  title="Isewupine house savings"
                  location="Epe, Lagos"
                  price="$576.29"
                />
                <PropertyCard
                  title="Isewupine village"
                  location="Ibeju-Lekki, Lagos"
                  price="$418.55"
                />
              </div>
            </section>

            <section className="mt-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Property Category
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                    Find property by category
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white p-1 shadow-sm">
                    <CategoryPill href="/properties" active>
                      All
                    </CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "land" } }}>
                      Land
                    </CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "estate" } }}>
                      Estate
                    </CategoryPill>
                    <CategoryPill href={{ pathname: "/properties", query: { q: "house" } }}>
                      Housing
                    </CategoryPill>
                  </div>

                  <Link
                    href="/properties"
                    className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    style={{
                      backgroundColor: ACCENT,
                      boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
                    }}
                  >
                    View all
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <WidePropertyCard
                  title="Pride Rock"
                  location="Epe, Lagos"
                  price="$943.65"
                />
                <WidePropertyCard
                  title="Iro Phase II"
                  location="Ibeju-Lekki, Lagos"
                  price="$813.65"
                />
                <WidePropertyCard
                  title="Yati Femmex"
                  location="Epe, Lagos"
                  price="$943.35"
                />
                <WidePropertyCard
                  title="Property house"
                  location="Ibeju-Lekki, Lagos"
                  price="$943.65"
                />
              </div>
            </section>

            <section className="relative mt-16 overflow-hidden rounded-[28px] bg-[#f6f0dd] shadow-sm">
              <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Ready to own land
                  </p>
                  <h2 className="text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">
                    Ready to Own Land
                    <br />
                    That Works for You
                  </h2>
                  <p className="max-w-md text-sm leading-7 text-zinc-600 sm:text-base">
                    Start your journey with curated plots, transparent pricing,
                    and a support team that stays with you from inquiry to
                    allocation.
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/properties"
                      className="inline-flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                      style={{
                        backgroundColor: ACCENT,
                        boxShadow:
                          "0 14px 28px -18px rgba(242,85,93,0.85)",
                      }}
                    >
                      Get started
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-10 -top-10 size-48 rounded-full bg-[rgba(242,85,93,0.12)] blur-2xl" />
                  <div className="absolute -bottom-14 -right-14 size-60 rounded-full bg-amber-400/10 blur-2xl" />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[radial-gradient(900px_500px_at_40%_40%,rgba(0,0,0,0.08),transparent),radial-gradient(900px_500px_at_90%_70%,rgba(0,0,0,0.06),transparent)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/10 via-transparent to-transparent" />
                    <img
                      src={pickLandImage("home-land")}
                      alt="Land"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </section>
        </main>
      </div>

      <footer className="text-white" style={{ backgroundColor: NAVY }}>
        <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-10 lg:px-16">
          <div className="grid gap-10 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <LogoMark inverted />
                  <div className="text-sm font-semibold tracking-tight">
                    HAY Property
                  </div>
                </div>
                <p className="max-w-sm text-sm leading-6 text-white/75">
                  Explore verified property opportunities with guidance you can
                  trust—from first inquiry to final allocation.
                </p>

                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/65">
                    Subscribe to follow
                  </div>
                  <NewsletterForm source="footer-home" />
                </div>
              </div>

              <FooterCol title="Catogory">
                <FooterLink href={{ pathname: "/properties", query: { q: "land" } }}>Land property</FooterLink>
                <FooterLink href={{ pathname: "/properties", query: { q: "estate" } }}>New estate</FooterLink>
                <FooterLink href={{ pathname: "/properties", query: { q: "rent" } }}>Rent house</FooterLink>
                <FooterLink href={{ pathname: "/properties", query: { q: "house" } }}>Housing</FooterLink>
              </FooterCol>

              <FooterCol title="Contect">
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-white/10">
                      <IconPhone />
                    </span>
                    <span>+234 800 000 0000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-white/10">
                      <IconMail />
                    </span>
                    <span>hello@hayproperty.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-white/10">
                      <IconPin className="text-white" />
                    </span>
                    <span>Lagos, Nigeria</span>
                  </div>
                </div>
              </FooterCol>

              <FooterCol title="Follow">
                <div className="flex items-center gap-3">
                  <SocialIcon href="https://x.com" ariaLabel="X">
                    <IconX />
                  </SocialIcon>
                  <SocialIcon href="https://instagram.com" ariaLabel="Instagram">
                    <IconInstagram />
                  </SocialIcon>
                  <SocialIcon href="https://linkedin.com" ariaLabel="LinkedIn">
                    <IconLinkedIn />
                  </SocialIcon>
                </div>
              </FooterCol>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55">
              <div>© {new Date().getFullYear()} HAY Property. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link className="hover:text-white" href="/privacy-policy">
                  Privacy policy
                </Link>
                <Link className="hover:text-white" href="/terms">
                  Terms
                </Link>
              </div>
            </div>
          </div>
      </footer>
    </div>
  );
}

function LogoMark({ inverted }: { inverted?: boolean }) {
  return (
    <div
      className={[
        "grid size-9 place-items-center rounded-xl",
        inverted ? "bg-white/10" : "bg-[rgba(242,85,93,0.12)]",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.2 5.4 12 2l5.8 3.4v6.2L12 15 6.2 11.6V5.4Z"
          stroke={inverted ? "rgba(255,255,255,0.9)" : ACCENT}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7"
          stroke={inverted ? "rgba(255,255,255,0.9)" : ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function AvatarCircle({ className }: { className: string }) {
  return (
    <div
      className={[
        "size-9 rounded-full ring-2 ring-white/20",
        className,
      ].join(" ")}
      aria-hidden="true"
    />
  );
}

function MediaPlaceholder({ variant }: { variant?: "card" | "wide" }) {
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

function PropertyCard({
  title,
  location,
  price,
  showBrand,
}: {
  title: string;
  location: string;
  price: string;
  showBrand?: boolean;
}) {
  return (
    <Link href="/properties" className="relative overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden rounded-[22px] bg-zinc-200">
        <MediaPlaceholder />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        {showBrand ? (
          <div className="absolute left-4 bottom-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 backdrop-blur">
            HAY
          </div>
        ) : null}
        <div
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white shadow-sm"
          style={{
            backgroundColor: ACCENT,
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
        <div className="text-sm font-semibold" style={{ color: ACCENT }}>
          {price}
        </div>
      </div>
    </Link>
  );
}

function WidePropertyCard({
  title,
  location,
  price,
}: {
  title: string;
  location: string;
  price: string;
}) {
  return (
    <Link href="/properties" className="relative overflow-hidden rounded-[22px] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 overflow-hidden rounded-[22px] bg-zinc-200 md:h-52">
        <MediaPlaceholder variant="wide" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        <div
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-white shadow-sm"
          style={{
            backgroundColor: ACCENT,
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
        <div className="text-sm font-semibold" style={{ color: ACCENT }}>
          {price}
        </div>
      </div>
    </Link>
  );
}

function CategoryPill({
  children,
  href,
  active,
}: {
  children: React.ReactNode;
  href: string | { pathname: string; query?: Record<string, string> };
  active?: boolean;
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
              backgroundColor: ACCENT,
              boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
            }
          : undefined
      }
    >
      {children}
    </Link>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-white/65">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string | { pathname: string; query?: Record<string, string> };
  children: string;
}) {
  return (
    <Link href={href} className="block text-sm text-white/80 hover:text-white">
      {children}
    </Link>
  );
}

function SocialIcon({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
    >
      {children}
    </Link>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 22s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 13.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 7h7v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M9 18V6l12 6-12 6Z" />
    </svg>
  );
}

function IconStar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2l2.9 6.3L22 9.2l-5 4.6L18.2 21 12 17.6 5.8 21 7 13.8 2 9.2l7.1-.9L12 2Z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 4h3l2 5-2 1c1 3 3 5 6 6l1-2 5 2v3c0 1.1-.9 2-2 2C10.8 21 3 13.2 3 4c0-1.1.9-2 2-2h2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2 20 6v6c0 6-4 9-8 10-4-1-8-4-8-10V6l8-4Z"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-5"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.8 5.8L20 10l-6.2 2.2L12 18l-1.8-5.8L4 10l6.2-2.2L12 2Z"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M17.5 6.5h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9v12M6 5v.5M10 9v12m0-7c0-2 1.5-3.5 3.5-3.5S17 12 17 14v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
