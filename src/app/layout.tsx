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
