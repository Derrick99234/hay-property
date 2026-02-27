export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "DISABLED";
  createdAt: string;
};

export type AdminProperty = {
  id: string;
  title: string;
  slug: string;
  location: string;
  price: number;
  status: "DRAFT" | "AVAILABLE" | "SOLD";
  imageUrls: string[];
  createdAt: string;
};

export type AdminBlog = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  published: boolean;
  createdAt: string;
};

export type AdminPurchaseStep = {
  key: string;
  label: string;
  phase: string;
  status: "COMPLETED" | "ONGOING" | "PENDING";
};

export type AdminPurchase = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  propertyId: string;
  propertyTitle: string;
  propertySlug: string;
  percent: number;
  overallStatus: "COMPLETED" | "ONGOING";
  steps: AdminPurchaseStep[];
  createdAt: string;
};

export type AdminDB = {
  version: 1;
  users: AdminUser[];
  properties: AdminProperty[];
  blogs: AdminBlog[];
  purchases: AdminPurchase[];
};

export const ADMIN_DB_KEY = "hay_admin_db_v1";

export function createSeedDB(): AdminDB {
  const now = new Date();
  const iso = (d: Date) => d.toISOString();
  const daysAgo = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };

  return {
    version: 1,
    users: [],
    properties: [],
    blogs: [],
    purchases: [],
  };
}

export function formatMoneyNGN(value: number) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });
}

export function formatDateShort(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function createId(prefix: string) {
  const g = globalThis as unknown as { crypto?: Crypto };
  const raw = g.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
  return `${prefix}_${raw.replaceAll("-", "").slice(0, 12)}`;
}

export function isValidDB(value: unknown): value is AdminDB {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<AdminDB>;
  if (v.version !== 1) return false;
  if (!Array.isArray(v.users)) return false;
  if (!Array.isArray(v.properties)) return false;
  if (!Array.isArray(v.blogs)) return false;
  return true;
}
