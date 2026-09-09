"use client";

import { useEffect } from "react";
import { APP_STORE_URL, PLAY_STORE_URL, detectPlatform } from "@/lib/store-links";

export default function DownloadRedirect() {
  useEffect(() => {
    const platform = detectPlatform();
    if (platform === "android") {
      window.location.replace(PLAY_STORE_URL);
    } else if (platform === "ios") {
      window.location.replace(APP_STORE_URL);
    } else {
      window.location.replace("/");
    }
  }, []);

  return (
    <div className="px-4 py-8 sm:px-16">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}
