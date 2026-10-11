import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import DownloadRedirect from "./download-redirect";

// Client-side redirect to the store, so there is nothing here to index.
export const metadata: Metadata = {
  ...pageMetadata({
    path: "/download",
    title: "Download dgputt",
    description:
      "Download dgputt for iOS or Android. Practice disc golf putting with structured drills, track your progress, and join competitive leagues.",
  }),
  robots: { index: false, follow: true },
};

export default function DownloadPage() {
  return <DownloadRedirect />;
}
