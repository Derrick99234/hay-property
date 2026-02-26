"use client";

import { useMemo, useState } from "react";

const NAVY = "#1d2b56";

export default function PropertyInquiryCard({
  accent,
  propertyId,
  propertyTitle,
  propertyLocation,
}: {
  accent: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
}) {
  const [tab, setTab] = useState<"INSPECTION" | "INFO">("INSPECTION");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [mailto, setMailto] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [peopleCount, setPeopleCount] = useState("1");

  const canSubmit = useMemo(() => {
    const hasContact = email.trim().length > 3 || phone.trim().length > 5;
    if (!name.trim()) return false;
    if (!hasContact) return false;
    if (submitting) return false;
    return true;
  }, [email, name, phone, submitting]);

  return (
    <div className="rounded-[26px] bg-white p-5 shadow-sm ring-1 ring-zinc-100 sm:p-6">
      <div className="flex items-center gap-2 rounded-full bg-zinc-50 p-1 ring-1 ring-zinc-100">
        <button
          type="button"
          onClick={() => setTab("INSPECTION")}
          className={[
            "h-10 flex-1 rounded-full text-xs font-semibold uppercase tracking-[0.22em] transition",
            tab === "INSPECTION" ? "text-white shadow-sm" : "text-zinc-700 hover:text-zinc-900",
          ].join(" ")}
          style={
            tab === "INSPECTION"
              ? { backgroundColor: NAVY, boxShadow: "0 14px 28px -18px rgba(29,43,86,0.75)" }
              : undefined
          }
        >
          Book an inspection
        </button>
        <button
          type="button"
          onClick={() => setTab("INFO")}
          className={[
            "h-10 flex-1 rounded-full text-xs font-semibold uppercase tracking-[0.22em] transition",
            tab === "INFO" ? "text-white shadow-sm" : "text-zinc-700 hover:text-zinc-900",
          ].join(" ")}
          style={
            tab === "INFO"
              ? { backgroundColor: NAVY, boxShadow: "0 14px 28px -18px rgba(29,43,86,0.75)" }
              : undefined
          }
        >
          Request info
        </button>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setSubmitting(true);
          setSent(false);
          setMailto(null);

          fetch("/api/inquiries", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              type: tab,
              propertyId,
              name,
              email,
              phone,
              message,
              inspectionDate: tab === "INSPECTION" ? inspectionDate : undefined,
              inspectionTime: tab === "INSPECTION" ? inspectionTime : undefined,
              peopleCount: tab === "INSPECTION" ? Number(peopleCount) : undefined,
            }),
          })
            .then(async (r) => {
              const payload = (await r.json()) as { ok: boolean; error?: string; data?: { mailto?: string } };
              if (!payload.ok) throw new Error(payload.error || "Failed to submit.");
              setSent(true);
              setMailto(payload.data?.mailto ?? null);
              setMessage("");
            })
            .catch((err) => {
              window.alert(err instanceof Error ? err.message : "Failed to submit.");
            })
            .finally(() => setSubmitting(false));
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
              placeholder="Your name"
              autoComplete="name"
            />
          </Field>
          <Field label="Phone number">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
              placeholder="Phone number"
              autoComplete="tel"
            />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
              placeholder="Email address"
              autoComplete="email"
            />
          </Field>
          {tab === "INSPECTION" ? (
            <>
              <Field label="Inspection date">
                <input
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
                  placeholder="dd/mm/yyyy"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Inspection time">
                <input
                  value={inspectionTime}
                  onChange={(e) => setInspectionTime(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
                  placeholder="e.g. 10:00am"
                />
              </Field>
              <Field label="Number of people coming for inspection" className="sm:col-span-2">
                <select
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
                >
                  {Array.from({ length: 6 }).map((_, i) => {
                    const v = String(i + 1);
                    return (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    );
                  })}
                </select>
              </Field>
            </>
          ) : null}
          <Field label="Message" className="sm:col-span-2">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-300"
              placeholder="Tell us what you need..."
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 w-full items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: NAVY, boxShadow: "0 14px 28px -18px rgba(29,43,86,0.75)" }}
        >
          {submitting ? "Sending..." : tab === "INSPECTION" ? "Submit request" : "Send request"}
        </button>

        {sent ? (
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
            Request received. We will contact you shortly.
            {mailto ? (
              <div className="mt-2">
                <a href={mailto} className="font-semibold underline" style={{ color: accent }}>
                  Send via email app
                </a>
              </div>
            ) : null}
          </div>
        ) : null}
      </form>

      <div className="mt-6 rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-100">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">Hay Property Ltd. Sales Team</div>
        <div className="mt-1 text-sm font-semibold text-zinc-900">{propertyTitle}</div>
        <div className="mt-1 text-sm text-zinc-600">{propertyLocation}</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href="https://wa.me/2348000000000"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            WhatsApp
          </a>
          <a
            href="tel:+2348000000000"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-900 shadow-sm transition hover:border-zinc-300"
          >
            Call us
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      <div className="mb-2 text-xs font-semibold text-zinc-600">{label}</div>
      {children}
    </label>
  );
}

