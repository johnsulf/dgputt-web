import { AppStoreLinks } from "@/app/components/app-store-links";
import Reviews, { StoreRatings } from "@/app/components/home/reviews";
import PhoneFrame from "@/app/components/phone-frame";
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

export default function Home() {
  return (
    <div className="space-y-10 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-9 lg:px-10">
      <JsonLd data={softwareApplication} />
      <div className="space-y-4">
        <section
          aria-labelledby="home-heading"
          className="grid overflow-hidden rounded-[2rem] bg-[#092b46] text-white md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        >
          <div className="flex flex-col justify-center px-6 pt-8 sm:px-10 sm:pt-10 md:py-12 lg:px-14">
            <h1 id="home-heading" className="max-w-lg text-4xl/tight! tracking-tight sm:text-5xl/tight! lg:text-6xl/none!">
              Get better at <span className="text-secondary">disc golf putting</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-100">
              Build confidence at the distances that cost you strokes with
              structured putting drills. Start free with five drills and basic
              stats. Premium unlocks every game, more detailed progress tracking
              and the tools to run your own putting league.
            </p>
            <AppStoreLinks className="mt-6 inline-grid max-w-full grid-cols-2 self-start [&>a]:grid [&>a]:min-h-11 [&>a]:min-w-0 [&>a]:items-center" />
          </div>
          <div className="relative isolate flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#207180,transparent_72%)] px-6 py-8 md:py-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-radial-gradient(circle_at_center,transparent_0_3rem,#ffffff24_3.05rem,transparent_3.1rem)] mask-[radial-gradient(ellipse_at_center,#000_28%,transparent_80%)]"
            />
            <PhoneFrame
              src="/images/screenshots/home.webp"
              alt="The dgputt Practice screen showing all 12 putting games unlocked, including Streak and Aim"
              className="h-88 sm:h-100 lg:h-112"
            />
          </div>
        </section>
        <StoreRatings />
      </div>

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
