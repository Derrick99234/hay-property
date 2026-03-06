"use client";

import { useMemo, useState } from "react";

const ACCENT = "#f2555d";

export default function AdminAIKnowledgePage() {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [result, setResult] = useState<
    | null
    | {
        ok: boolean;
        message: string;
        data?: any;
      }
  >(null);

  const whatsapp = useMemo(() => process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "", []);

  const runIngest = async () => {
    if (loading || resetting) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/ingest", { method: "POST" });
      const json = (await res.json()) as { ok: boolean; data?: any; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Ingestion failed.");
      setResult({
        ok: true,
        message: "Ingestion completed. The chatbot knowledge base is updated.",
        data: json.data,
      });
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Ingestion failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetKnowledge = async () => {
    if (loading || resetting) return;
    if (!window.confirm("This will delete the chatbot knowledge base. Continue?")) return;
    setResetting(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/ingest", { method: "DELETE" });
      const json = (await res.json()) as { ok: boolean; data?: any; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Reset failed.");
      setResult({
        ok: true,
        message: "Knowledge base cleared. Run ingestion to rebuild it.",
        data: json.data,
      });
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Reset failed.",
      });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Admin</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">AI / Knowledge</h1>
          <p className="text-sm text-zinc-600">
            Build the chatbot knowledge base from the website content. This powers the customer support chat widget.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetKnowledge}
            disabled={loading || resetting}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetting ? "Resetting..." : "Reset knowledge"}
          </button>
          <button
            type="button"
            onClick={runIngest}
            disabled={loading || resetting}
            className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
          >
            {loading ? "Ingesting..." : "Run ingestion"}
          </button>
        </div>
      </div>

      {result ? (
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900",
          ].join(" ")}
        >
          <div className="font-semibold">{result.message}</div>
          {result.data ? (
            <pre className="mt-3 overflow-x-auto rounded-xl bg-white/70 p-3 text-xs text-zinc-800">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">What this does</div>
          <div className="mt-2 space-y-2 text-sm leading-7 text-zinc-600">
            <div>- Pulls key website pages (Home, About, Properties, Blog, Contact, Terms, Privacy).</div>
            <div>- Includes published blogs and properties already stored in MongoDB.</div>
            <div>- Splits content into chunks, creates embeddings, and stores them in MongoDB for retrieval.</div>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-100">
          <div className="text-sm font-semibold text-zinc-900">Customer support behavior</div>
          <div className="mt-2 space-y-2 text-sm leading-7 text-zinc-600">
            <div>- Answers only from the knowledge base.</div>
            <div>- If it can’t answer confidently, it escalates to WhatsApp.</div>
            <div>- WhatsApp link: {whatsapp || "Not set (uses /contact fallback)"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

