export const APP_STORE_URL = "https://apps.apple.com/us/app/dgputt/id1536711552";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt";

export type Platform = "android" | "ios" | "desktop";

// Client-side only: reads navigator. Returns "desktop" when unavailable.
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";

  // iPadOS 13+ sends a desktop-class user agent, so the regex above misses iPads.
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return "ios";
  }

  return "desktop";
}
