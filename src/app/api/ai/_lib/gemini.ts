import { jsonError } from "../../_lib/http";

type GeminiEmbeddingResponse = { embedding?: { values?: number[] } };
type GeminiGenerateResponse = { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
type GeminiListModelsResponse = { models?: Array<{ name?: string; supportedGenerationMethods?: string[] }> };

function getKey() {
  const k = process.env.GEMINI_API_KEY ?? "";
  return k.trim();
}

function normalizeModelName(model: string) {
  const m = model.trim();
  if (m.startsWith("models/")) return m.slice("models/".length);
  return m;
}

export function requireGeminiKey() {
  const key = getKey();
  if (!key) return jsonError("Missing GEMINI_API_KEY.", { status: 500 });
  return null;
}

export async function embedText(input: string, { model = "text-embedding-004" }: { model?: string } = {}) {
  const key = getKey();
  const modelName = normalizeModelName(model);
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:embedContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: { parts: [{ text: input }] } }),
  });
  const data = (await res.json()) as GeminiEmbeddingResponse & { error?: { message?: string } };
  const vec = Array.isArray(data.embedding?.values) ? data.embedding!.values! : null;
  if (!res.ok || !vec || vec.length === 0) {
    const msg = data.error?.message || "Failed to create embedding.";
    throw new Error(msg);
  }
  return vec;
}

export async function embedTextWithFallback(input: string) {
  const candidates = ["text-embedding-004", "embedding-001"];
  let lastErr: unknown = null;
  for (const model of candidates) {
    try {
      const embedding = await embedText(input, { model });
      return { embedding, model };
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("is not found") && !msg.includes("not supported")) break;
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error("Failed to create embedding."));
}

let cachedModels: { at: number; models: Array<{ name: string; methods: string[] }> } | null = null;

async function listModels() {
  const key = getKey();
  const now = Date.now();
  if (cachedModels && now - cachedModels.at < 5 * 60 * 1000) return cachedModels.models;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, { method: "GET" });
  const data = (await res.json()) as GeminiListModelsResponse & { error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message || "Failed to list Gemini models.");

  const models =
    data.models
      ?.map((m) => ({
        name: normalizeModelName(String(m.name ?? "")),
        methods: Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods : [],
      }))
      .filter((m) => m.name) ?? [];

  cachedModels = { at: now, models };
  return models;
}

async function pickModelFor(method: "generateContent" | "embedContent") {
  const models = await listModels();
  const allowed = models.filter((m) => m.methods.includes(method));

  const prefer = [
    (n: string) => n.includes("gemini-2") && n.includes("flash"),
    (n: string) => n.includes("gemini-1.5") && n.includes("flash"),
    (n: string) => n.includes("gemini-2"),
    (n: string) => n.includes("gemini-1.5"),
    (n: string) => n.includes("gemini"),
  ];

  for (const pred of prefer) {
    const found = allowed.find((m) => pred(m.name));
    if (found) return found.name;
  }
  return allowed[0]?.name ?? null;
}

export async function generateAnswer({
  system,
  user,
  model = "gemini-1.5-flash",
}: {
  system: string;
  user: string;
  model?: string;
}) {
  const key = getKey();
  const modelName = normalizeModelName(model);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(key)}`;

  const attempt = async (body: unknown) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    const data = (await res.json()) as GeminiGenerateResponse & { error?: { message?: string } };
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
    if (!res.ok || !text) {
      const msg = data.error?.message || "Failed to generate response.";
      throw new Error(msg);
    }
    return text;
  };

  const baseBodies = [
    {
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
    },
    {
      contents: [{ role: "user", parts: [{ text: `${system}\n\n${user}` }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
    },
  ];

  let lastErr: unknown = null;
  for (const body of baseBodies) {
    for (let tries = 0; tries < 3; tries++) {
      try {
        return await attempt(body);
      } catch (err) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        const retryMatch = /Please retry in\s+(\d+(?:\.\d+)?)s/i.exec(msg);
        const retrySeconds = retryMatch ? Number(retryMatch[1]) : null;
        const shouldRetry =
          tries < 2 &&
          (msg.toLowerCase().includes("quota exceeded") ||
            msg.toLowerCase().includes("rate limit") ||
            msg.toLowerCase().includes("too many requests") ||
            Boolean(retryMatch));
        if (!shouldRetry) break;
        if (retrySeconds && retrySeconds > 2.5) break;
        const waitMs = retrySeconds ? Math.max(250, Math.round(retrySeconds * 1000)) : 750;
        await new Promise((r) => setTimeout(r, Math.min(1500, waitMs)));
      }
    }
  }
  throw (lastErr instanceof Error ? lastErr : new Error("Failed to generate response."));
}

export async function generateAnswerWithFallback({ system, user }: { system: string; user: string }) {
  const candidates = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
  let lastErr: unknown = null;
  for (const model of candidates) {
    try {
      const text = await generateAnswer({ system, user, model });
      return { text, model };
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.includes("is not found") && !msg.includes("not supported")) break;
    }
  }

  try {
    const picked = await pickModelFor("generateContent");
    if (picked) {
      const text = await generateAnswer({ system, user, model: picked });
      return { text, model: picked };
    }
  } catch (err) {
    lastErr = err;
  }

  throw (lastErr instanceof Error ? lastErr : new Error("Failed to generate response."));
}
