import { AppStoreLinks } from "@/app/components/app-store-links";
import Reviews from "@/app/components/home/reviews";
import { ScreenshotPreview } from "@/app/components/screenshot-preview";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { softwareApplication } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "dgputt - The Ultimate Disc Golf Putting App",
  description:
    "Disc golf putting practice app with structured drills, progress tracking, and competitive leagues. Available on iOS and Android.",
});

const screenshot = {
  src: "/images/screenshots/home.webp",
  alt: "The dgputt Practice screen showing all 12 putting games unlocked, including Streak and Aim",
};

export default function Home() {
  return (
    <div className="space-y-10 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-9 lg:px-10">
      <JsonLd data={softwareApplication} />
      <section
        aria-labelledby="home-heading"
        className="grid items-center gap-6 border-b pb-6 sm:pb-8 md:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] md:gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16"
      >
        <div className="min-w-0">
          <h1 id="home-heading" className="max-w-[16ch] text-[clamp(1.9rem,9.5vw,2.25rem)]/[1.08]! tracking-tight text-balance sm:text-[2.75rem]/[1.08]! lg:text-[3.25rem]/[1.05]!">
            Get better at disc golf putting
          </h1>
          <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-pretty text-foreground/80 sm:text-lg">
            Build confidence at the distances that cost you strokes with
            structured putting drills. Start free with five drills and basic
            stats. Premium unlocks every game, more detailed progress tracking
            and the tools to run your own putting league.
          </p>
          <AppStoreLinks showRatings className="mt-6 grid w-fit max-w-full grid-cols-2 gap-3" />
        </div>
        <ScreenshotPreview {...screenshot} className="justify-self-center rounded-2xl">
          <Image
            src={screenshot.src}
            alt={screenshot.alt}
            width={960}
            height={2087}
            loading="eager"
            className="h-auto w-32 rounded-2xl border-2 border-[#172b39] sm:w-36 md:w-40"
          />
        </ScreenshotPreview>
      </section>

      <div className="grid overflow-hidden rounded-3xl border bg-card md:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-3 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl">Pick a putting game</h2>
          <p className="text-foreground/80">
            Warm up with Twenty, practise at six distances with StormPutt or
            see how many you can make in a row with Streak.
          </p>
          <Link href="/about" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-primary">
            Explore app features
          </Link>
        </section>
        <section className="space-y-3 border-t bg-secondary/15 p-6 sm:p-8 md:border-t-0 md:border-l">
          <h2 className="text-2xl sm:text-3xl">Play with friends</h2>
          <p className="text-foreground/80">
            Run a weekly league, set up a single event or challenge a friend
            to a head-to-head match.
          </p>
          <p className="text-sm text-foreground/80">
            Allow location access on your phone to see active leagues and
            events nearest to you first.
          </p>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/guide" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-primary">
              League guide
            </Link>
            <Link href="/about/compete" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-primary">
              Single events and matches
            </Link>
          </div>
        </section>
      </div>

      <Reviews />

      <section className="flex flex-wrap items-center gap-x-5 gap-y-4 rounded-3xl border bg-card p-5 sm:p-7">
        <Image src="/images/rund_k.png" alt="" width={56} height={56} className="size-14 shrink-0" />
        <div className="min-w-0 flex-1 basis-52 space-y-1">
          <h2 className="text-xl">Featured on Kastkultur</h2>
          <p className="text-foreground/80">Find the dgputt collection at Scandinavia’s disc golf shop.</p>
        </div>
        <a
          href="https://www.kastkultur.com/dgputt"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-primary"
        >
          Visit Kastkultur
        </a>
      </section>
    </div>
  );
}
