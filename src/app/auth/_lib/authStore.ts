export type AuthUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type PasswordResetToken = {
  token: string;
  email: string;
  createdAt: string;
};

export const AUTH_USERS_KEY = "hay_auth_users_v1";
export const AUTH_RESET_KEY = "hay_auth_reset_tokens_v1";

export function createId(prefix: string) {
  const g = globalThis as unknown as { crypto?: Crypto };
  const raw = g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
  return `${prefix}_${raw.replaceAll("-", "").slice(0, 12)}`;
}

export function readUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as AuthUser[];
  } catch {
    return [];
  }
}

export function writeUsers(users: AuthUser[]) {
  try {
    window.localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch {}
}

export function findUserByEmail(email: string) {
  const users = readUsers();
  const target = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === target) ?? null;
}

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (name.length < 2) return { ok: false, error: "Enter your full name." };
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  const users = readUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email);
  if (exists) return { ok: false, error: "Email already registered." };

  const user: AuthUser = {
    id: createId("usr"),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  writeUsers([user, ...users]);
  return { ok: true, user };
}

export function authenticateUser(input: {
  email: string;
  password: string;
}): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: "Invalid email or password." };
  if (user.password !== password) return { ok: false, error: "Invalid email or password." };
  return { ok: true, user };
}

export function readResetTokens(): PasswordResetToken[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(AUTH_RESET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PasswordResetToken[];
  } catch {
    return [];
  }
}

export function writeResetTokens(tokens: PasswordResetToken[]) {
  try {
    window.localStorage.setItem(AUTH_RESET_KEY, JSON.stringify(tokens));
  } catch {}
}

export function createResetToken(email: string) {
  const normalized = email.trim().toLowerCase();
  const token: PasswordResetToken = {
    token: createId("rst"),
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  const tokens = readResetTokens().filter((t) => t.email !== normalized);
  writeResetTokens([token, ...tokens]);
  return token.token;
}

export function consumeResetToken(token: string) {
  const tokens = readResetTokens();
  const found = tokens.find((t) => t.token === token) ?? null;
  if (!found) return null;
  const next = tokens.filter((t) => t.token !== token);
  writeResetTokens(next);
  return found;
}

export function resetPassword(input: {
  token: string;
  newPassword: string;
}): { ok: true } | { ok: false; error: string } {
  const token = input.token.trim();
  const newPassword = input.newPassword;
  if (newPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  const consumed = consumeResetToken(token);
  if (!consumed) return { ok: false, error: "Invalid or expired reset link." };

  const users = readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === consumed.email);
  if (idx < 0) return { ok: false, error: "No account found for this link." };
  const updated = [...users];
  updated[idx] = { ...updated[idx], password: newPassword };
  writeUsers(updated);
  return { ok: true };
}
