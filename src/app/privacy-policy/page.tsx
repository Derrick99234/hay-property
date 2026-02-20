import Link from "next/link";
import Image from "next/image";
import SiteFooter from "../_components/SiteFooter";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const metadata = {
  title: "Privacy Policy | HAY Property",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/logo1.png" alt="HAY Property" width={140} height={72} />
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-zinc-700">
            <Link className="hover:text-zinc-900" href="/terms">
              Terms
            </Link>
            <Link className="hover:text-zinc-900" href="/contact">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legal</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Privacy Policy</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            This Privacy Policy explains how HAY Property collects, uses, and protects your information when you use our
            website and services.
          </p>

          <div className="mt-8 space-y-8">
            <Section title="Information We Collect">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
                <li>Contact information (such as name, email, phone number) when you submit forms.</li>
                <li>Newsletter subscription email address when you opt in.</li>
                <li>Usage data (basic analytics like pages visited and device/browser info).</li>
              </ul>
            </Section>

            <Section title="How We Use Information">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
                <li>To respond to enquiries and support requests.</li>
                <li>To provide property updates and newsletters you request.</li>
                <li>To improve our website and user experience.</li>
              </ul>
            </Section>

            <Section title="Cookies">
              <p className="text-sm leading-7 text-zinc-700">
                We may use cookies and similar technologies to keep the site functional and to understand how visitors use
                the site. You can manage cookies in your browser settings.
              </p>
            </Section>

            <Section title="Data Sharing">
              <p className="text-sm leading-7 text-zinc-700">
                We do not sell your personal data. We may share data with trusted service providers who help us operate the
                website and deliver communications, subject to appropriate safeguards.
              </p>
            </Section>

            <Section title="Data Security">
              <p className="text-sm leading-7 text-zinc-700">
                We apply reasonable technical and organizational measures to protect information. No method of
                transmission or storage is completely secure.
              </p>
            </Section>

            <Section title="Your Choices">
              <p className="text-sm leading-7 text-zinc-700">
                You can unsubscribe from marketing emails at any time. If you need to access, correct, or delete your data,
                contact us.
              </p>
            </Section>

            <Section title="Contact">
              <p className="text-sm leading-7 text-zinc-700">
                Questions about privacy? Email{" "}
                <a className="font-semibold" style={{ color: ACCENT }} href="mailto:hello@hayproperty.com">
                  hello@hayproperty.com
                </a>
                .
              </p>
            </Section>

            <div className="text-xs text-zinc-500">Last updated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      <SiteFooter accent={ACCENT} navy={NAVY} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}
