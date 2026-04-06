import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dgputt.app"),
  title: "dgputt - The Ultimate Disc Golf Putting App",
  description:
    "dgputt is a disc golf putting practice app that helps you improve your game. Track your progress, view stats, and more.",
  keywords: ["disc golf", "putting", "practice", "dgputt", "sports", "app"],
  openGraph: {
    title: "dgputt - The Ultimate Disc Golf Putting App",
    description:
      "Disc golf putting practice app with structured drills, progress tracking, and competitive leagues. Available on iOS and Android.",
    url: "https://www.dgputt.app",
    siteName: "dgputt",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "dgputt - Disc Golf Putting Practice App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dgputt - The Ultimate Disc Golf Putting App",
    description:
      "Disc golf putting practice app with structured drills, progress tracking, and competitive leagues.",
    images: ["/images/og.png"],
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-no": "/",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "SoftwareApplication",
              name: "dgputt",
              operatingSystem: "iOS, Android",
              applicationCategory: "Sports",
              description: "A disc golf putting practice app.",
              downloadUrl:
                "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
