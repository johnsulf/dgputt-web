"use client";

import { useEffect } from "react";
import { APP_STORE_URL, PLAY_STORE_URL, detectPlatform } from "@/lib/store-links";

// Browser fallback for links the app did not claim.
// /open/leagues/{id}/events/{eventId} → the logged-in web event page
// /open/leagues/{id}               → the logged-in web league page
// anything else (single events)     → home, there is no web page for it
function desktopTarget(slug: string[]): string {
  const [section, id, sub, subId] = slug;

  if (section === "leagues" && id) {
    if (sub === "events" && subId) {
      return `/leagues/${encodeURIComponent(id)}/events/${encodeURIComponent(subId)}`;
    }
    if (slug.length === 2) {
      return `/leagues/${encodeURIComponent(id)}`;
    }
  }

  return "/";
}

export default function OpenRedirect({ slug }: { slug: string[] }) {
  useEffect(() => {
    const platform = detectPlatform();
    if (platform === "android") {
      window.location.replace(PLAY_STORE_URL);
    } else if (platform === "ios") {
      window.location.replace(APP_STORE_URL);
    } else {
      window.location.replace(desktopTarget(slug));
    }
  }, [slug]);

  return (
    <div className="px-4 py-8 sm:px-16">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}
