import Link from "next/link";
import NewsletterForm from "../_components/NewsletterForm";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-8 sm:px-10 lg:px-16">
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
            <Link className="hover:text-zinc-900" href="/">
              Home
            </Link>
            <Link className="text-zinc-900" href="/about">
              About
            </Link>
            <Link className="hover:text-zinc-900" href="/properties">
              Properties
            </Link>
            <Link className="hover:text-zinc-900" href="/blog">
              Blog
            </Link>
            <Link className="hover:text-zinc-900" href="/contact">
              Contact
            </Link>
          </nav>
        </header>

        <main className="space-y-16 pb-6">
          <section className="grid gap-10 lg:grid-cols-[420px_1fr] lg:items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-sm font-semibold uppercase tracking-[0.34em] text-zinc-700">
                  MEET THE HAY REAL
                  <br />
                  ESTATE
                </h1>
              </div>

              <div className="space-y-4 text-sm leading-7 text-zinc-600">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Facilisis congue congue risus, vitae consectetur sapien
                  pellentesque nec quisque mauris. Consectetur dictum nisl, sed
                  nec sed imperdiet ipsum quis pellentesque.
                </p>
                <p>
                  Imperdiet mauris elit mollit non, sapien vitae. Condimentum
                  diam donec tortor tristique. Viverra urna, vehicula facilisis
                  ullamcorper elit ligula varius tortor.
                </p>
              </div>

              <Link
                href="/properties"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-6 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-800 shadow-sm transition hover:border-zinc-300"
              >
                READ MORE
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[28px] bg-zinc-200">
              <MediaPlaceholder variant="hero" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/15 via-transparent to-transparent" />
              <div
                className="absolute left-6 top-6 h-12 w-12 rounded-2xl"
                style={{ backgroundColor: "rgba(242,85,93,0.14)" }}
                aria-hidden="true"
              />
              <div
                className="absolute right-10 top-14 h-16 w-16 rounded-3xl"
                style={{ backgroundColor: "rgba(242,85,93,0.12)" }}
                aria-hidden="true"
              />
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[28px] bg-[#0f1730]">
            <MediaPlaceholder variant="accolades" />
            <div className="absolute inset-0 bg-[#0f1730]/70" />
            <div className="relative px-6 py-12 sm:px-10 sm:py-14">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.30em] text-white/70">
                  TEAM ACCOLADES
                </p>
              </div>

              <div className="mt-10 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-3">
                <Stat value="35" label="COMBINED YEARS IN BUSINESS" />
                <Stat value="1.5%" label="TOP 1.5% OF TEAMS NATIONWIDE" />
                <Stat value="$2B+" label="OVER 1 BILLION IN TOTAL SALES" />
                <Stat value="150M+" label="DEAL VOLUME IN THE PAST 12 MONTH" />
                <Stat value="4%" label="LIST TO SOLD AVERAGE" />
                <Stat value="900+" label="# OF CHAMPAGNE BOTTLES DELIVERED" />
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-semibold uppercase tracking-[0.18em] text-zinc-900">
                HAY TEAM
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-600">
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry. Lorem ipsum has been the industry’s standard dummy
                text ever since the 1500s.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
              <TeamCard name="STEVEN GREEN" role="owner" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-7 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-800 shadow-sm transition hover:border-zinc-300"
              >
                LOAD MORE
              </button>
            </div>
          </section>
        </main>
      </div>

      <div style={{ backgroundColor: NAVY }} className="h-14" />

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
                <NewsletterForm source="footer-about" />
              </div>
            </div>

            <FooterCol title="Category">
              <FooterLink href={{ pathname: "/properties", query: { q: "house" } }}>House Property</FooterLink>
              <FooterLink href={{ pathname: "/properties", query: { q: "estate" } }}>New estate</FooterLink>
              <FooterLink href={{ pathname: "/properties", query: { q: "land" } }}>Land property</FooterLink>
              <FooterLink href={{ pathname: "/properties", query: { q: "apartment" } }}>Apartment</FooterLink>
            </FooterCol>

            <FooterCol title="Contact">
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10">
                    <IconPin className="text-white" />
                  </span>
                  <span>Ajah (Lagos), Nigeria</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10">
                    <IconMail />
                  </span>
                  <span>info@hayproperties.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/10">
                    <IconPhone />
                  </span>
                  <span>+234 8000000000</span>
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mx-auto max-w-[260px] text-[10px] font-semibold uppercase tracking-[0.26em] text-white/70">
        {label}
      </div>
    </div>
  );
}

function TeamCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200">
        <MediaPlaceholder variant="portrait" />
      </div>
      <div className="space-y-1 px-4 py-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-900">
          {name}
        </div>
        <div className="text-xs text-zinc-500">{role}</div>
      </div>
    </div>
  );
}

function MediaPlaceholder({
  variant,
}: {
  variant?: "hero" | "accolades" | "portrait";
}) {
  const className =
    variant === "accolades"
      ? "bg-[radial-gradient(900px_520px_at_35%_30%,rgba(255,255,255,0.12),transparent),radial-gradient(900px_520px_at_75%_60%,rgba(242,85,93,0.14),transparent),linear-gradient(120deg,rgba(20,28,60,0.35),rgba(20,28,60,0.55))]"
      : variant === "portrait"
        ? "bg-[radial-gradient(700px_520px_at_20%_10%,rgba(34,197,94,0.18),transparent),radial-gradient(700px_520px_at_85%_90%,rgba(59,130,246,0.14),transparent),linear-gradient(120deg,rgba(255,255,255,0.55),rgba(244,244,245,0.75))]"
        : "bg-[radial-gradient(900px_620px_at_25%_20%,rgba(34,197,94,0.20),transparent),radial-gradient(900px_620px_at_85%_25%,rgba(59,130,246,0.16),transparent),linear-gradient(120deg,rgba(255,255,255,0.60),rgba(244,244,245,0.78))]";

  return <div className={`absolute inset-0 ${className}`} aria-hidden="true" />;
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
