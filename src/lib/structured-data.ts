import { SITE_URL } from "@/lib/seo";

const APP_STORE_URL = "https://apps.apple.com/us/app/dgputt/id1536711552";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt";

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "dgputt",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo_plain.png`,
  email: "contact@dgputt.app",
  foundingDate: "2020",
  founder: [
    {
      "@type": "Person",
      name: "Erlend Johnsen",
      sameAs: ["https://www.instagram.com/dg.johnsen/"],
    },
    {
      "@type": "Person",
      name: "Atle Svandal",
      sameAs: ["https://www.instagram.com/dgputter/"],
    },
  ],
  sameAs: [
    "https://www.instagram.com/dgputt/",
    "https://www.facebook.com/dgputt/",
    APP_STORE_URL,
    PLAY_STORE_URL,
  ],
};

export const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "dgputt",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// No aggregateRating: Google's review-snippet rules forbid marking up ratings
// collected on other sites (App Store / Google Play), and doing so risks a
// manual action. Add it only if ratings are ever collected on dgputt.app.
export const softwareApplication = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": `${SITE_URL}/#app`,
  name: "dgputt",
  url: SITE_URL,
  description:
    "Disc golf putting practice app with structured drills, progress tracking, round logging and competitive putting leagues.",
  operatingSystem: "iOS, Android",
  applicationCategory: "SportsApplication",
  image: `${SITE_URL}/images/og.png`,
  installUrl: [APP_STORE_URL, PLAY_STORE_URL],
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Premium monthly",
      price: "2.49",
      priceCurrency: "USD",
    },
    {
      "@type": "Offer",
      name: "Premium annual",
      price: "20.99",
      priceCurrency: "USD",
    },
  ],
};
