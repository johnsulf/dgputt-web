import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Public, indexable pages only. /download (store redirect), /auth and the
// sign-in-gated /leagues routes are deliberately left out.
const paths = [
  "/",
  "/about",
  "/guide",
  "/team",
  "/contact",
  "/privacy-policy",
  "/delete-account",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
