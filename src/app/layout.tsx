import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAY Property",
  description:
    "Explore verified land and property listings with transparent pricing and trusted guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
