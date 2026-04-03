import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HashRedirect } from "@/components/hash-redirect";
import "./globals.css";

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
        <HashRedirect />
        <header className="bg-secondary px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <img
              src="/images/logo_plain.png"
              alt="dgputt logo"
              width={60}
              height={60}
            />
          </Link>
          <Button>Sign In</Button>
        </header>

        <main className="flex-1 max-w-275 mx-auto w-full">{children}</main>

        <footer className="bg-secondary grid place-items-center gap-2 py-6 mt-4">
          <p className="text-xl">&copy;dgputt</p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/dgputt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/ig.png"
                alt="instagram"
                width={32}
                height={32}
              />
            </a>
            <a
              href="https://www.facebook.com/dgputt/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/fb.png" alt="facebook" width={32} height={32} />
            </a>
          </div>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </footer>
      </body>
    </html>
  );
}
