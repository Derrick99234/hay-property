export const ADMIN_EMAIL = "admin@hayproperties.com";
export const ADMIN_PASSWORD_KEY = "hay_admin_password_v1";
export const ADMIN_RESET_KEY = "hay_admin_reset_tokens_v1";

type AdminResetToken = { token: string; createdAt: string };

export function readAdminPassword() {
  if (typeof window === "undefined") return "admin123";
  try {
    return window.localStorage.getItem(ADMIN_PASSWORD_KEY) || "admin123";
  } catch {
    return "admin123";
  }
}

export function writeAdminPassword(password: string) {
  try {
    window.localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } catch {}
}

function createId(prefix: string) {
  const g = globalThis as unknown as { crypto?: Crypto };
  const raw = g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
  return `${prefix}_${raw.replaceAll("-", "").slice(0, 12)}`;
}

function readResetTokens(): AdminResetToken[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADMIN_RESET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as AdminResetToken[];
  } catch {
    return [];
  }
}

function writeResetTokens(tokens: AdminResetToken[]) {
  try {
    window.localStorage.setItem(ADMIN_RESET_KEY, JSON.stringify(tokens));
  } catch {}
}

export function createAdminResetToken() {
  const token: AdminResetToken = {
    token: createId("arst"),
    createdAt: new Date().toISOString(),
  };
  const tokens = readResetTokens().slice(0, 4);
  writeResetTokens([token, ...tokens]);
  return token.token;
}

export function consumeAdminResetToken(token: string) {
  const tokens = readResetTokens();
  const found = tokens.find((t) => t.token === token) ?? null;
  if (!found) return null;
  writeResetTokens(tokens.filter((t) => t.token !== token));
  return found;
}
