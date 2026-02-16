import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin • HAY Property",
  description: "Admin dashboard for managing users, properties, and blogs.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
