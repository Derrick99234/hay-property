import Link from "next/link";
import Image from "next/image";
import SiteFooter from "../_components/SiteFooter";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export const metadata = {
  title: "Terms of Service | HAY Property",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/logo1.png" alt="HAY Property" width={140} height={72} />
          </Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-zinc-700">
            <Link className="hover:text-zinc-900" href="/privacy-policy">
              Privacy
            </Link>
            <Link className="hover:text-zinc-900" href="/contact">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Legal</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Terms of Service</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            By accessing or using HAY Property, you agree to these Terms. If you do not agree, do not use the website.
          </p>

          <div className="mt-8 space-y-8">
            <Section title="Use of the Website">
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
                <li>You agree to use the website lawfully and not to misuse content or services.</li>
                <li>You may not attempt to disrupt the site, access restricted areas, or scrape data without permission.</li>
              </ul>
            </Section>

            <Section title="Listings and Information">
              <p className="text-sm leading-7 text-zinc-700">
                Property information is provided for general guidance. Availability, pricing, and details may change.
                Always request verification and documentation before any transaction.
              </p>
            </Section>

            <Section title="No Professional Advice">
              <p className="text-sm leading-7 text-zinc-700">
                Content is not legal, financial, or investment advice. Seek professional advice suitable for your situation.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p className="text-sm leading-7 text-zinc-700">
                All branding, design, and content on this website is owned by HAY Property or licensed to us. You may not
                reproduce or redistribute without written permission.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p className="text-sm leading-7 text-zinc-700">
                To the fullest extent permitted by law, HAY Property is not liable for indirect, incidental, or consequential
                damages arising from your use of the website or reliance on information provided.
              </p>
            </Section>

            <Section title="Changes to Terms">
              <p className="text-sm leading-7 text-zinc-700">
                We may update these Terms from time to time. Continued use of the website after updates means you accept the
                revised Terms.
              </p>
            </Section>

            <Section title="Contact">
              <p className="text-sm leading-7 text-zinc-700">
                For questions about these Terms, email{" "}
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
