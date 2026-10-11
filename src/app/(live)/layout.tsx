import type { Metadata } from "next";
import { DevDataBadge } from "@/app/components/layout/data-source";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function LiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      {children}
      <DevDataBadge />
    </div>
  );
}
