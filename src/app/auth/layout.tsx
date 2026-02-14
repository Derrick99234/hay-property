import Link from "next/link";

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
            <LogoMark />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">
                HAY Property
              </span>
              <span className="text-[11px] text-zinc-500">
                Account access
              </span>
            </div>
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
                This is a simple demo authentication flow. Use register to
                create an account, then login to access your account area.
              </p>
            </div>

            <div className="mt-7 space-y-3 rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
              <div className="text-sm font-semibold">Admin login</div>
              <p className="text-sm text-white/75">
                Admin has a separate login page.
              </p>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: ACCENT }}
              >
                Go to admin login
                <IconArrow />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div
      className="grid size-9 place-items-center rounded-xl bg-[rgba(242,85,93,0.12)]"
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
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M12 15v7"
          stroke={ACCENT}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function IconArrow() {
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
