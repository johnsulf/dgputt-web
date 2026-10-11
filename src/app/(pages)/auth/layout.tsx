import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in - dgputt",
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
