import type { Metadata } from "next";
import DownloadRedirect from "./download-redirect";

export const metadata: Metadata = {
  title: "Download dgputt",
  description:
    "Download dgputt for iOS or Android. Practice disc golf putting with structured drills, track your progress, and join competitive leagues.",
};

export default function DownloadPage() {
  return <DownloadRedirect />;
}
