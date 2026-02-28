"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  kind?: "normal" | "escalate";
};

const ACCENT = "#f2555d";

function createId() {
  const g = globalThis as unknown as { crypto?: Crypto };
  const raw = g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
  return raw.replaceAll("-", "").slice(0, 12);
}

function isInScope(text: string) {
  const t = text.toLowerCase();
  const keywords = [
    "hay",
    "property",
    "properties",
    "land",
    "plot",
    "estate",
    "inspection",
    "book",
    "contact",
    "address",
    "email",
    "phone",
    "whatsapp",
    "lagos",
    "ibeju",
    "lekki",
    "buy",
    "purchase",
    "payment",
    "price",
    "available",
    "sold",
    "blog",
    "terms",
    "privacy",
  ];
  return keywords.some((k) => t.includes(k));
}

function getWhatsappUrl(message?: string) {
  const base = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "";
  if (!base) return "/contact";
  const trimmed = base.trim();
  if (!message) return trimmed;
  const joiner = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${joiner}text=${encodeURIComponent(message)}`;
}

function buildStubAnswer(question: string) {
  const lower = question.toLowerCase();
  if (lower.includes("contact") || lower.includes("phone") || lower.includes("email") || lower.includes("whatsapp")) {
    return "You can reach HAY Property via our Contact page. If you prefer WhatsApp, tap “Chat on WhatsApp” below.";
  }
  if (lower.includes("inspection") || lower.includes("book")) {
    return "To book an inspection, use the “Book Inspection” button on the site or message our team on WhatsApp for available time slots.";
  }
  if (lower.includes("price") || lower.includes("payment")) {
    return "Pricing and payment options depend on the property. Share the property name/slug and our team can confirm details on WhatsApp.";
  }
  if (lower.includes("location") || lower.includes("where") || lower.includes("lagos")) {
    return "We list verified properties and land listings. Browse available listings on the Properties page to see locations and details.";
  }
  return "I can help with questions about HAY Property (properties, inspections, blog, policies, contact). Ask a specific question or tap a quick option below.";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "assistant",
      text: "Hi! I’m the HAY Property assistant. Ask me anything about HAY Property. If your question needs our team, I’ll send you to WhatsApp.",
      kind: "normal",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const lastUserQuestion = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].text;
    }
    return "";
  }, [messages]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { id: createId(), role: "user", text: q, kind: "normal" }]);

    const inScope = isInScope(q);
    if (!inScope) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          kind: "escalate",
          text: "I can only answer questions about HAY Property. Please chat with our team on WhatsApp for help.",
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "assistant",
        kind: "normal",
        text: buildStubAnswer(q),
      },
    ]);
  };

  const quickActions = [
    { label: "How to buy", message: "How do I buy a property with HAY Property?" },
    { label: "Book inspection", message: "How do I book an inspection?" },
    { label: "Contact", message: "How can I contact HAY Property?" },
    { label: "Policies", message: "Where can I find your terms and privacy policy?" },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[70]">
      {open ? (
        <div className="w-[min(92vw,420px)] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200">
          <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-zinc-900">HAY Property Assistant</div>
              <div className="truncate text-xs text-zinc-500">Company-only help • WhatsApp fallback</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition hover:border-zinc-300"
              aria-label="Close chat"
            >
              <IconClose />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ring-1",
                    m.role === "user"
                      ? "bg-zinc-900 text-white ring-zinc-900"
                      : m.kind === "escalate"
                        ? "bg-red-50 text-red-900 ring-red-100"
                        : "bg-white text-zinc-900 ring-zinc-100",
                  ].join(" ")}
                >
                  {m.text}
                  {m.role === "assistant" && m.kind === "escalate" ? (
                    <div className="mt-3">
                      <a
                        href={getWhatsappUrl(`Hello HAY Property, I need help with: ${lastUserQuestion || ""}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm transition hover:opacity-95"
                        style={{ backgroundColor: ACCENT, boxShadow: "0 14px 28px -18px rgba(242,85,93,0.85)" }}
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            <div className="pt-1">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => send(a.message)}
                    className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const next = input;
              setInput("");
              send(next);
            }}
            className="border-t border-zinc-100 p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-10 w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none"
                placeholder="Type your question..."
              />
              <button
                type="submit"
                disabled={input.trim().length === 0}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                Send
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <a
                href={getWhatsappUrl("Hello HAY Property, I need assistance.")}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-zinc-600 hover:text-zinc-900"
              >
                Open WhatsApp
              </a>
              <div className="text-xs text-zinc-500">This is a UI preview (AI not connected yet).</div>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-3 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-2xl transition hover:opacity-95"
          style={{ backgroundColor: ACCENT, boxShadow: "0 18px 36px -20px rgba(242,85,93,0.95)" }}
          aria-label="Open chat"
        >
          <IconChat />
          Chat
        </button>
      )}
    </div>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.5 18.5 4 20V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

