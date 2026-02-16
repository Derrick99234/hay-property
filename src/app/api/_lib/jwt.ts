type JwtHeader = { alg: "HS256"; typ: "JWT" };
type JwtPayload = {
  sub: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

function base64UrlEncodeBytes(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeJson(value: unknown) {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  return base64UrlEncodeBytes(bytes);
}

function base64UrlDecodeToBytes(input: string) {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const binary = atob(b64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlDecodeJson<T>(input: string): T {
  const bytes = base64UrlDecodeToBytes(input);
  const json = new TextDecoder().decode(bytes);
  return JSON.parse(json) as T;
}

let cachedKey: CryptoKey | null = null;
let cachedSecret: string | null = null;

async function getHmacKey(secret: string) {
  if (cachedKey && cachedSecret === secret) return cachedKey;
  const keyBytes = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  cachedKey = key;
  cachedSecret = secret;
  return key;
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && !secret) {
    throw new Error("Missing JWT_SECRET in environment.");
  }
  return secret || "dev_jwt_secret_change_me";
}

export async function signJwt(input: { sub: string; role: "user" | "admin"; ttlSeconds: number }) {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: input.sub,
    role: input.role,
    iat: now,
    exp: now + input.ttlSeconds,
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey(getJwtSecret());
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signingInput));
  const signature = base64UrlEncodeBytes(new Uint8Array(sig));

  return `${signingInput}.${signature}`;
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  let header: JwtHeader;
  let payload: JwtPayload;
  try {
    header = base64UrlDecodeJson<JwtHeader>(encodedHeader);
    payload = base64UrlDecodeJson<JwtPayload>(encodedPayload);
  } catch {
    return null;
  }

  if (!header || header.alg !== "HS256" || header.typ !== "JWT") return null;
  if (!payload?.sub || (payload.role !== "user" && payload.role !== "admin")) return null;
  if (!payload.exp || typeof payload.exp !== "number") return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;

  const key = await getHmacKey(getJwtSecret());
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeToBytes(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`)
  );
  if (!ok) return null;

  return payload;
}

