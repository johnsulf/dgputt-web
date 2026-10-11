import type { Metadata } from "next";

// League pages need a login to show anything, so keep them out of the index.
export const metadata: Metadata = {
  title: "Leagues - dgputt",
  robots: { index: false, follow: true },
};

export default function LeaguesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
