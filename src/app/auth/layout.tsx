import Link from "next/link";
import Image from "next/image";

const ACCENT = "#f2555d";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#eef1f5] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo/logo1.png" alt="HAY Property" width={150} height={80} />
          </Link>

          <Link
            href="/contact"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 sm:inline-flex"
            style={{
              backgroundColor: ACCENT,
              boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)",
            }}
          >
            Get in touch
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-zinc-100 sm:p-10">
            {children}
          </div>

          <aside className="rounded-[28px] bg-[#131b2d] p-7 text-white shadow-sm sm:p-10">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                Secure access
              </div>
              <div className="text-2xl font-semibold tracking-tight">
                Manage your profile and inquiries.
              </div>
              <p className="text-sm leading-7 text-white/75">
                Sign in to continue your journey with verified listings and a
                secure account experience.
              </p>
            </div>

            <div className="mt-7 rounded-2xl bg-white/10 p-5 text-sm text-white/80 ring-1 ring-white/10">
              Your account is protected with secure sign-in and server-validated sessions.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
