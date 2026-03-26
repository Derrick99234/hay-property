import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import {
  IconInstagram,
  IconMail,
  IconPhone,
  IconPin,
  IconTikTok,
  IconX,
  IconYouTube,
} from "./icons";
import Image from "next/image";

const CONTACT_PHONE_DISPLAY = "+234 906 661 7600";
const CONTACT_PHONE_HREF = "tel:+2349066617600";
const CONTACT_EMAIL = "haayyproperties@gmail.com";
const CONTACT_ADDRESS = "Ajayi Apata, Opp. Mobile Road, Sangotedo Road, Lagos";
const CONTACT_ADDRESS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Ajayi%20Apata%2C%20Opp.%20Mobile%20Road%2C%20Sangotedo%20Road%2C%20Lagos";

export default function SiteFooter({
  accent,
  navy,
}: {
  accent: string;
  navy: string;
}) {
  return (
    <footer className="text-white" style={{ backgroundColor: navy }}>
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-10 lg:px-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo.png"
                alt="HAY Property"
                width={150}
                height={120}
                priority
              />
              {/* <div className="text-sm font-semibold tracking-tight">
                HAY Property
              </div> */}
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/75">
              Explore verified property opportunities with guidance you can
              trust—from first inquiry to final allocation.
            </p>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/65">
                Subscribe
              </div>
              <NewsletterForm source="footer" />
            </div>
          </div>

          <FooterCol title="Category">
            <FooterLink
              href={{ pathname: "/properties", query: { q: "land" } }}
            >
              Land
            </FooterLink>
            <FooterLink
              href={{ pathname: "/properties", query: { q: "estate" } }}
            >
              Estates
            </FooterLink>
            <FooterLink
              href={{ pathname: "/properties", query: { q: "house" } }}
            >
              Housing
            </FooterLink>
            <FooterLink href="/blog">Blog</FooterLink>
          </FooterCol>

          <FooterCol title="Contact">
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <IconPhone />
                </span>
                <a href={CONTACT_PHONE_HREF} className="transition hover:text-white">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <IconMail />
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <IconPin className="text-white" />
                </span>
                <a
                  href={CONTACT_ADDRESS_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-white"
                >
                  {CONTACT_ADDRESS}
                </a>
              </div>
            </div>
          </FooterCol>

          <FooterCol title="Follow">
            <div className="flex items-center gap-3">
              <SocialIcon href="https://x.com/haayyproperties" ariaLabel="X">
                <IconX />
              </SocialIcon>
              <SocialIcon
                href="https://instagram.com/hayproperties"
                ariaLabel="Instagram"
              >
                <IconInstagram />
              </SocialIcon>
              <SocialIcon
                href="https://www.tiktok.com/@hay.property.dl"
                ariaLabel="TikTok"
              >
                <IconTikTok />
              </SocialIcon>
              <SocialIcon
                href="https://www.youtube.com/@haypropertiesdl"
                ariaLabel="YouTube"
              >
                <IconYouTube />
              </SocialIcon>
            </div>
          </FooterCol>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/55">
          <div>
            © {new Date().getFullYear()} HAY Property. All rights reserved.
          </div>
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

function LogoMark({
  inverted,
  accent,
}: {
  inverted?: boolean;
  accent: string;
}) {
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
          stroke={inverted ? "rgba(255,255,255,0.9)" : accent}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7"
          stroke={inverted ? "rgba(255,255,255,0.9)" : accent}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
