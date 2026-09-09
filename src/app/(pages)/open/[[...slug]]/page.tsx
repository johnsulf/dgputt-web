import type { Metadata } from "next";
import OpenRedirect from "./open-redirect";

export const metadata: Metadata = {
  title: "Opening dgputt",
  description: "Opening this link in the dgputt app.",
  robots: { index: false },
};

export default async function OpenPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <OpenRedirect slug={slug ?? []} />;
}
