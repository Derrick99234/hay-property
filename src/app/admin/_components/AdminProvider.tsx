"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AdminBlog, AdminDB, AdminProperty, AdminPurchase, AdminUser, createSeedDB } from "../_lib/adminStore";

type AdminContextValue = {
  db: AdminDB;
  loading: boolean;
  refresh: () => Promise<void>;

  createUser: (input: { name: string; email: string; password: string; status: AdminUser["status"] }) => Promise<void>;
  updateUser: (id: string, input: Partial<{ name: string; email: string; password: string; status: AdminUser["status"] }>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  createProperty: (input: { title: string; slug: string; location: string; price: number; status: AdminProperty["status"]; imageFiles: File[] }) => Promise<void>;
  updateProperty: (id: string, input: Partial<{ title: string; slug: string; location: string; price: number; status: AdminProperty["status"]; imageFiles: File[] }>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  createBlog: (input: {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    published: boolean;
    coverFile?: File | null;
  }) => Promise<void>;
  updateBlog: (id: string, input: Partial<Omit<AdminBlog, "id">> & { coverFile?: File | null }) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;

  createPurchase: (input: { userId: string; propertyId: string }) => Promise<void>;
  updatePurchaseSteps: (id: string, input: { steps: Record<string, boolean> }) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export default function AdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [db, setDB] = useState<AdminDB>(() => createSeedDB());
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [usersRes, propsRes, blogsRes, purchasesRes] = await Promise.all([
        fetch("/api/users?limit=100"),
        fetch("/api/properties?limit=100"),
        fetch("/api/blogs?limit=100"),
        fetch("/api/purchases?limit=100"),
      ]);

      const usersJson = (await usersRes.json()) as { ok: boolean; data?: { items?: any[] } };
      const propsJson = (await propsRes.json()) as { ok: boolean; data?: { items?: any[] } };
      const blogsJson = (await blogsRes.json()) as { ok: boolean; data?: { items?: any[] } };
      const purchasesJson = (await purchasesRes.json()) as { ok: boolean; data?: { items?: any[] } };

      const users = Array.isArray(usersJson.data?.items) ? usersJson.data!.items! : [];
      const properties = Array.isArray(propsJson.data?.items) ? propsJson.data!.items! : [];
      const blogs = Array.isArray(blogsJson.data?.items) ? blogsJson.data!.items! : [];
      const purchases = Array.isArray(purchasesJson.data?.items) ? purchasesJson.data!.items! : [];

      setDB({
        version: 1,
        users: users.map((u) => ({
          id: String(u._id ?? u.id),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          status: (u.status === "DISABLED" ? "DISABLED" : "ACTIVE") as AdminUser["status"],
          createdAt: String(u.createdAt ?? new Date().toISOString()),
        })),
        properties: properties.map((p) => ({
          id: String(p._id ?? p.id),
          title: String(p.title ?? ""),
          slug: String(p.slug ?? ""),
          location: [p.city, p.state].filter(Boolean).join(", ") || String(p.address ?? ""),
          price: Number(p.price ?? 0),
          status: (p.status ?? "DRAFT") as AdminProperty["status"],
          imageUrls: Array.isArray(p.images) ? p.images.map((i: any) => String(i?.url ?? "").trim()).filter(Boolean) : [],
          createdAt: String(p.createdAt ?? new Date().toISOString()),
        })),
        blogs: blogs.map((b) => ({
          id: String(b._id ?? b.id),
          title: String(b.title ?? ""),
          slug: String(b.slug ?? ""),
          category: String(b.category ?? ""),
          excerpt: String(b.excerpt ?? ""),
          content: String(b.content ?? ""),
          coverUrl: String(b.coverUrl ?? ""),
          published: Boolean(b.published),
          createdAt: String(b.createdAt ?? new Date().toISOString()),
        })),
        purchases: purchases
          .map((p) => {
            const id = String(p._id ?? p.id ?? "");
            const userId = String(p.user?._id ?? p.user ?? "");
            const userEmail = String(p.user?.email ?? "");
            const userName = String(p.user?.name ?? "");
            const propertyId = String(p.property?._id ?? p.property ?? "");
            const propertyTitle = String(p.property?.title ?? "");
            const propertySlug = String(p.property?.slug ?? "");
            const progress = p.progress ?? {};
            const steps = Array.isArray(progress.steps) ? progress.steps : [];
            const percent = Number(progress.percent ?? 0);
            const overallStatus = progress.overallStatus === "COMPLETED" ? "COMPLETED" : "ONGOING";
            const mapped: AdminPurchase = {
              id,
              userId,
              userEmail,
              userName,
              propertyId,
              propertyTitle,
              propertySlug,
              percent: Number.isFinite(percent) ? percent : 0,
              overallStatus,
              steps: steps
                .map((s: any) => ({
                  key: String(s.key ?? ""),
                  label: String(s.label ?? ""),
                  phase: String(s.phase ?? ""),
                  status: s.status === "COMPLETED" ? "COMPLETED" : s.status === "ONGOING" ? "ONGOING" : "PENDING",
                }))
                .filter((s: any) => s.key && s.label),
              createdAt: String(p.createdAt ?? new Date().toISOString()),
            };
            return mapped;
          })
          .filter((p: AdminPurchase) => p.id && p.userId && p.propertyId),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  const value = useMemo<AdminContextValue>(() => {
    const uploadPropertyImages = async (propertyId: string, files: File[]) => {
      const fd = new FormData();
      fd.set("propertyId", propertyId);
      for (const f of files) fd.append("images", f);

      const res = await fetch("/api/uploads/property-images", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; data?: { images?: Array<{ url: string; order: number }> }; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to upload images.");
      const imgs = Array.isArray(data.data?.images) ? data.data!.images! : [];
      return imgs
        .map((img) => ({ url: String(img.url ?? "").trim(), order: Number(img.order ?? 0) }))
        .filter((img) => img.url.length > 0);
    };

    const uploadBlogCover = async (blogId: string, file: File) => {
      const fd = new FormData();
      fd.set("blogId", blogId);
      fd.set("cover", file);

      const res = await fetch("/api/uploads/blog-covers", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; data?: { url?: string }; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to upload cover image.");
      const url = String(data.data?.url ?? "").trim();
      if (!url) throw new Error("Failed to upload cover image.");
      return url;
    };

    const createUser: AdminContextValue["createUser"] = async (input) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create user.");
      await refresh();
    };

    const updateUser: AdminContextValue["updateUser"] = async (id, input) => {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update user.");
      await refresh();
    };

    const deleteUser: AdminContextValue["deleteUser"] = async (id) => {
      const res = await fetch(`/api/users/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete user.");
      await refresh();
    };

    const createProperty: AdminContextValue["createProperty"] = async (input) => {
      const [city, state] = input.location.split(",").map((s) => s.trim());
      const imageFiles = Array.isArray(input.imageFiles) ? input.imageFiles.slice(0, 5) : [];
      const finalStatus = input.status;
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: input.title,
          slug: input.slug,
          price: input.price,
          status: "DRAFT",
          city: city || undefined,
          state: state || undefined,
          images: [],
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; data?: any };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create property.");

      const createdId = String(data.data?._id ?? data.data?.id ?? "");
      if (!createdId) throw new Error("Failed to create property.");

      const payload: Record<string, unknown> = {};
      if (imageFiles.length) {
        const images = await uploadPropertyImages(createdId, imageFiles);
        payload.images = images;
      }
      payload.status = finalStatus;

      const patchRes = await fetch(`/api/properties/${encodeURIComponent(createdId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const patchData = (await patchRes.json()) as { ok: boolean; error?: string };
      if (!patchRes.ok || !patchData.ok) throw new Error(patchData.error || "Failed to finalize property.");

      await refresh();
    };

    const updateProperty: AdminContextValue["updateProperty"] = async (id, input) => {
      const payload: Record<string, unknown> = {};
      if (typeof input.title === "string") payload.title = input.title;
      if (typeof input.slug === "string") payload.slug = input.slug;
      if (typeof input.price === "number") payload.price = input.price;
      if (typeof input.status === "string") payload.status = input.status;
      if (typeof input.location === "string") {
        const [city, state] = input.location.split(",").map((s) => s.trim());
        payload.city = city || undefined;
        payload.state = state || undefined;
      }
      if (Array.isArray(input.imageFiles) && input.imageFiles.length) {
        const imageFiles = input.imageFiles.slice(0, 5);
        payload.images = await uploadPropertyImages(id, imageFiles);
      }

      const res = await fetch(`/api/properties/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update property.");
      await refresh();
    };

    const deleteProperty: AdminContextValue["deleteProperty"] = async (id) => {
      const res = await fetch(`/api/properties/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete property.");
      await refresh();
    };

    const createBlog: AdminContextValue["createBlog"] = async (input) => {
      const { coverFile, ...rest } = input;
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...rest, coverUrl: undefined }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; data?: any };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create blog.");

      const createdId = String(data.data?._id ?? data.data?.id ?? "");
      if (!createdId) throw new Error("Failed to create blog.");

      if (coverFile) {
        const coverUrl = await uploadBlogCover(createdId, coverFile);
        const patchRes = await fetch(`/api/blogs/${encodeURIComponent(createdId)}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ coverUrl }),
        });
        const patchData = (await patchRes.json()) as { ok: boolean; error?: string };
        if (!patchRes.ok || !patchData.ok) throw new Error(patchData.error || "Failed to set cover image.");
      }
      await refresh();
    };

    const updateBlog: AdminContextValue["updateBlog"] = async (id, input) => {
      const { coverFile, ...rest } = input;
      const payload = { ...rest } as Record<string, unknown>;

      if (coverFile) {
        const coverUrl = await uploadBlogCover(id, coverFile);
        payload.coverUrl = coverUrl;
      }
      const res = await fetch(`/api/blogs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update blog.");
      await refresh();
    };

    const deleteBlog: AdminContextValue["deleteBlog"] = async (id) => {
      const res = await fetch(`/api/blogs/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete blog.");
      await refresh();
    };

    const createPurchase: AdminContextValue["createPurchase"] = async (input) => {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to create purchase.");
      await refresh();
    };

    const updatePurchaseSteps: AdminContextValue["updatePurchaseSteps"] = async (id, input) => {
      const res = await fetch(`/api/purchases/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to update purchase.");
      await refresh();
    };

    const deletePurchase: AdminContextValue["deletePurchase"] = async (id) => {
      const res = await fetch(`/api/purchases/${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to delete purchase.");
      await refresh();
    };

    return {
      db,
      loading,
      refresh,
      createUser,
      updateUser,
      deleteUser,
      createProperty,
      updateProperty,
      deleteProperty,
      createBlog,
      updateBlog,
      deleteBlog,
      createPurchase,
      updatePurchaseSteps,
      deletePurchase,
    };
  }, [db, loading]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminDB() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdminDB must be used within AdminProvider");
  return ctx;
}
