import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "dgputt - The disc golf putting app",
  description:
    "A fun and challenging dway to improve your disc golf putting skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
