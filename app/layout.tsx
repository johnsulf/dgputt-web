import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Link from "next/link";
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
  title: "dgputt - The disc golf putting app",
  description:
    "A fun and challenging way to improve your disc golf putting skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)] bg-bg text-text-primary">
        <header className="bg-brand-yellow px-8 py-4">
          <Link href="/">
            <img
              src="/images/logo_plain.png"
              alt="dgputt logo"
              width={60}
              height={60}
            />
          </Link>
        </header>

        <main className="flex-1 grid text-center max-w-[1100px] mx-auto w-full">
          {children}
        </main>

        <footer className="bg-brand-yellow grid place-items-center gap-2 py-6 mt-4 font-[family-name:var(--font-bricolage)]">
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
              <img
                src="/images/fb.png"
                alt="facebook"
                width={32}
                height={32}
              />
            </a>
          </div>
          <Link href="/privacy-policy" className="text-2xl">
            Privacy Policy
          </Link>
        </footer>
      </body>
    </html>
  );
}
