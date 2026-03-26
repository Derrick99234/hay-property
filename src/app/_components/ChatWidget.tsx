"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

const ACCENT = "#f2555d";
const SESSION_KEY = "hp_chat_sid_tmp";
const KNOWN_ADDRESSES = [
  "Ajayi Apata, Opp. Mobile Road, Sangotedo Road, Lagos",
];

type LinkToken = {
  type: "text" | "link";
  value: string;
  href?: string;
};

function createId() {
  const g = globalThis as unknown as { crypto?: Crypto };
  const raw = g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
  return raw.replaceAll("-", "").slice(0, 12);
}

function createSessionId() {
  const g = globalThis as unknown as { crypto?: Crypto };
  return g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
}

function getStoredSessionId() {
  try {
    return sessionStorage.getItem(SESSION_KEY) ?? "";
  } catch {
    return "";
  }
}

function setStoredSessionId(id: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch {}
}

function clearStoredSessionId() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

async function chatApi(message: string, sessionId: string) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-hp-chat-sid": sessionId },
    body: JSON.stringify({ message }),
    signal: ctrl.signal,
  });
  clearTimeout(timer);
  const payload = (await res.json()) as {
    ok: boolean;
    data?: { reply?: string; sources?: Array<{ index: number; title: string; url: string }> };
    error?: string;
  };
  if (!res.ok || !payload.ok) throw new Error(payload.error || "Chat failed.");
  const data = payload.data ?? {};
  return {
    reply: String(data.reply ?? ""),
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "assistant",
      text: "Hi! I’m the HAY Property assistant. Ask me anything about HAY Property.",
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
      if (e.key === "Escape") void closeChat();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const existing = getStoredSessionId();
    const sid = existing || createSessionId();
    if (!existing) setStoredSessionId(sid);
    setSessionId(sid);
  }, [open]);

  const resetLocalChat = () => {
    setMessages([
      {
        id: createId(),
        role: "assistant",
        text: "Hi! I’m the HAY Property assistant. Ask me anything about HAY Property.",
      },
    ]);
    setInput("");
    setSending(false);
  };

  const closeChat = async () => {
    const sid = sessionId || getStoredSessionId();
    if (sid) {
      try {
        await fetch("/api/ai/chat/reset", { method: "POST", headers: { "x-hp-chat-sid": sid } });
      } catch {}
    }
    clearStoredSessionId();
    setSessionId("");
    resetLocalChat();
    setOpen(false);
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || sending) return;

    setMessages((prev) => [...prev, { id: createId(), role: "user", text: q }]);
    setSending(true);
    try {
      const sid = sessionId || getStoredSessionId() || createSessionId();
      if (!sessionId) setSessionId(sid);
      setStoredSessionId(sid);
      const result = await chatApi(q, sid);
      setMessages((prev) => [...prev, { id: createId(), role: "assistant", text: result.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          text:
            err instanceof Error
              ? err.name === "AbortError"
                ? "This is taking too long right now. Please try again."
                : `Sorry—chat is not ready yet (${err.message}).`
              : "This is taking too long right now. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
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
              <div className="truncate text-xs text-zinc-500">Company-only customer support</div>
            </div>
            <button
              type="button"
              onClick={() => void closeChat()}
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
                      : "bg-white text-zinc-900 ring-zinc-100",
                  ].join(" ")}
                >
                  <MessageText text={m.text} />
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
              void send(next);
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
                disabled={input.trim().length === 0 || sending}
                className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="text-xs text-zinc-500">Customer support assistant</div>
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

function MessageText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const blocks = groupMessageLines(lines);

  return (
    <>
      {blocks.map((block, blockIndex) => (
        <MessageBlock key={`${block.type}-${blockIndex}`} block={block} />
      ))}
    </>
  );
}

function MessageBlock({ block }: { block: MessageBlockData }) {
  if (block.type === "ul") {
    return (
      <ul className="list-disc space-y-1 pl-5">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{renderLinkedLine(item)}</li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="list-decimal space-y-1 pl-5">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{renderLinkedLine(item)}</li>
        ))}
      </ol>
    );
  }

  return (
    <>
      {block.lines.map((line, lineIndex) => (
        <span key={`${line}-${lineIndex}`}>
          {renderLinkedLine(line)}
          {lineIndex < block.lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </>
  );
}

function renderLinkedLine(line: string): ReactNode[] {
  const tokens = tokenizeLinks(line);
  return tokens.map((token, index) => {
    if (token.type === "text" || !token.href) return <span key={`${index}-${token.value}`}>{token.value}</span>;
    const isExternal = /^https?:\/\//i.test(token.href);
    return (
      <a
        key={`${index}-${token.value}`}
        href={token.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="underline decoration-current/40 underline-offset-4 transition hover:decoration-current"
      >
        {token.value}
      </a>
    );
  });
}

function tokenizeLinks(input: string): LinkToken[] {
  const tokens: LinkToken[] = [{ type: "text", value: input }];
  const patterns = [
    { regex: /\bhttps?:\/\/[^\s]+/gi, href: (value: string) => value },
    { regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, href: (value: string) => `mailto:${value}` },
    { regex: /\+?\d[\d\s()-]{7,}\d/g, href: (value: string) => `tel:${value.replace(/[^\d+]/g, "")}` },
    ...KNOWN_ADDRESSES.map((address) => ({
      regex: new RegExp(escapeRegExp(address), "gi"),
      href: (value: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`,
    })),
  ];

  return patterns.reduce((currentTokens, pattern) => splitTokensByPattern(currentTokens, pattern.regex, pattern.href), tokens);
}

type MessageBlockData =
  | { type: "text"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function groupMessageLines(lines: string[]): MessageBlockData[] {
  const blocks: MessageBlockData[] = [];
  let textLines: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushText = () => {
    if (!textLines.length) return;
    blocks.push({ type: "text", lines: textLines });
    textLines = [];
  };

  const flushList = () => {
    if (!listType || !listItems.length) return;
    blocks.push({ type: listType, items: listItems });
    listType = null;
    listItems = [];
  };

  for (const line of lines) {
    const bulletMatch = /^\s*[-*•]\s+(.+)$/.exec(line);
    const numberMatch = /^\s*\d+[.)]\s+(.+)$/.exec(line);

    if (bulletMatch) {
      flushText();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(bulletMatch[1]);
      continue;
    }

    if (numberMatch) {
      flushText();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(numberMatch[1]);
      continue;
    }

    flushList();
    textLines.push(line);
  }

  flushList();
  flushText();

  return blocks.length ? blocks : [{ type: "text", lines: [""] }];
}

function splitTokensByPattern(
  tokens: LinkToken[],
  regex: RegExp,
  createHref: (value: string) => string,
) {
  const nextTokens: LinkToken[] = [];

  for (const token of tokens) {
    if (token.type === "link") {
      nextTokens.push(token);
      continue;
    }

    regex.lastIndex = 0;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(token.value)) !== null) {
      const start = match.index;
      const raw = match[0];
      const end = start + raw.length;

      if (start > lastIndex) {
        nextTokens.push({ type: "text", value: token.value.slice(lastIndex, start) });
      }

      const clean = trimTrailingPunctuation(raw);
      const suffix = raw.slice(clean.length);

      if (clean) {
        nextTokens.push({ type: "link", value: clean, href: createHref(clean) });
      }

      if (suffix) {
        nextTokens.push({ type: "text", value: suffix });
      }

      lastIndex = end;
    }

    if (lastIndex < token.value.length) {
      nextTokens.push({ type: "text", value: token.value.slice(lastIndex) });
    }
  }

  return nextTokens;
}

function trimTrailingPunctuation(value: string) {
  return value.replace(/[.,!?;:]+$/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
