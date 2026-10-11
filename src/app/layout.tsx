import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { JsonLd, SITE_URL } from "@/lib/seo";
import { organization, website } from "@/lib/structured-data";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Only site-wide defaults live here. Canonical, og:url, og:title and the
// Twitter card are per page (see pageMetadata in @/lib/seo); setting them here
// made every page claim to be the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "dgputt - The Ultimate Disc Golf Putting App",
  description:
    "dgputt is a disc golf putting practice app that helps you improve your game. Track your progress, view stats, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <head>
        <JsonLd data={organization} />
        <JsonLd data={website} />
      </head>
      {/* Browser extensions commonly mutate <body> before React hydrates
          (e.g. injecting an inline overscroll-behavior style), which trips a
          hydration warning. Suppression is one level deep only, so real
          mismatches inside the tree are still reported. */}
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "f645e2d6193343c19553de660cc86f04"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
