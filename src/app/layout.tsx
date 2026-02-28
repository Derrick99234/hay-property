import type { Metadata } from "next";
import "./globals.css";
import GlobalChatWidget from "./_components/GlobalChatWidget";

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
      <body className="font-sans antialiased">
        {children}
        <GlobalChatWidget />
      </body>
    </html>
  );
}
