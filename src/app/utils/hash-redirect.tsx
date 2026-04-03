"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Handles legacy hash-based routes from the old Svelte SPA.
// e.g. /#/privacy-policy → /privacy-policy
const hashRoutes: Record<string, string> = {
  "#/privacy-policy": "/privacy-policy",
};

export function HashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = hashRoutes[window.location.hash];
    if (target) {
      router.replace(target);
    }
  }, [router]);

  return null;
}
