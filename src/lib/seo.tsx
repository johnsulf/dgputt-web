import type { Metadata } from "next";

// The one canonical host. www.dgputt.app 301s here (see next.config.ts), so
// every canonical, og:url, sitemap entry and JSON-LD URL must use this.
export const SITE_URL = "https://dgputt.app";

const OG_IMAGE = {
  url: "/images/og.png",
  width: 1200,
  height: 630,
  alt: "dgputt - Disc Golf Putting Practice App",
};

// Per-page metadata with a self-referencing canonical and matching OG/Twitter
// tags. Next merges openGraph/twitter shallowly, so each page must carry the
// full objects rather than relying on the root layout.
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "dgputt",
      images: [OG_IMAGE],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
