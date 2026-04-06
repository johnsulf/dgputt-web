"use client";

import { useEffect } from "react";

const APP_STORE_URL = "https://apps.apple.com/us/app/dgputt/id1536711552";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt";

export default function DownloadRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      window.location.replace(PLAY_STORE_URL);
    } else if (/iPad|iPhone|iPod/.test(ua)) {
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
