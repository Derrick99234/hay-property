import Link from "next/link";
import Image from "next/image";

const ACCENT = "#f2555d";
const NAVY = "#1d2b56";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <Image src="/logo/logo1.png" alt="HAY Property" width={140} height={72} />
          </Link>
          <Link
            href="/"
            aria-label="Close"
            className="grid size-11 place-items-center rounded-full border border-zinc-300 text-zinc-700 transition hover:bg-zinc-50"
          >
            <IconClose />
          </Link>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-semibold tracking-[0.18em] text-zinc-900">
            CONTACT
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
            Mauris primis turpis Laoreet magna felis mi amet quam enim curae.
            Sodales semper tempor dictum faucibus habitasse.
          </p>
        </div>

        <section className="mx-auto mt-12 w-full max-w-5xl overflow-hidden border border-zinc-300 bg-white">
          <div className="grid md:grid-cols-[380px_1fr]">
            <div className="relative px-10 py-12 text-white" style={{ backgroundColor: NAVY }}>
              <h2 className="text-sm font-semibold tracking-[0.18em]">
                CONTACT INFORMATION
              </h2>
              <p className="mt-5 max-w-xs text-sm leading-7 text-white/70">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
                vel eu, amet pulvinar. Volutpat morbi id.
              </p>

              <div className="mt-12 space-y-6">
                <InfoRow icon={<IconPin />} text="Ubud No.88, USA, Renon, New York" />
                <InfoRow icon={<IconPhone />} text="(+75)8123451234" />
                <InfoRow icon={<IconMail />} text="Contact@domain.com" />
              </div>
            </div>

            <div className="px-10 py-12">
              <h2 className="text-center text-sm font-semibold tracking-[0.18em] text-zinc-900">
                ONLINE INQUIRY
              </h2>

              <form className="mt-10">
                <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
                  <Field label="First Name" />
                  <Field label="Last Name" />
                  <Field label="Email" />
                  <Field label="Phone" />
                </div>

                <div className="mt-10">
                  <Field label="Message" multiline />
                </div>

                <div className="mt-12 flex justify-end">
                  <button
                    type="button"
                    className="h-10 min-w-[120px] border border-[rgba(242,85,93,0.55)] bg-white px-6 text-xs font-semibold tracking-[0.18em] text-zinc-800 transition hover:border-[rgba(242,85,93,0.85)]"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, multiline }: { label: string; multiline?: boolean }) {
  return (
    <label className="block">
      <div className="text-xs text-zinc-500">{label}</div>
      {multiline ? (
        <textarea
          rows={3}
          className="mt-3 w-full resize-none border-b border-zinc-300 bg-transparent text-sm text-zinc-900 outline-none focus:border-zinc-400"
        />
      ) : (
        <input
          className="mt-3 w-full border-b border-zinc-300 bg-transparent pb-1 text-sm text-zinc-900 outline-none focus:border-zinc-400"
        />
      )}
    </label>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="grid size-10 place-items-center rounded-full text-white"
        style={{
          backgroundColor: ACCENT,
          boxShadow: "0 16px 30px -20px rgba(242,85,93,0.9)",
        }}
      >
        {icon}
      </div>
      <div className="text-sm text-white/85">{text}</div>
    </div>
  );
}

function IconClose() {
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

function IconPin() {
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
      width="16"
      height="16"
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
      width="16"
      height="16"
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
