import Reviews from "@/app/components/home/reviews";
import PhoneFrame from "@/app/components/phone-frame";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export default function Home() {
  return (
    <>
      <section className="grid gap-8 px-4 py-8 sm:grid-cols-2 sm:px-16 sm:items-center">
        <div className="space-y-4">
          <h1>dgputt</h1>
          <h2>Putt in the effort and become a better putter with dgputt</h2>
          <p>
            dgputt is an app that delivers structured putting practice using
            diverse drills and distances. Enjoy dgputt for free with five drills
            and basic stats, or upgrade for full access, enhanced progress
            statistics, and putting league creation and hosting.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://apps.apple.com/us/app/dgputt/id1536711552"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/app_store.png"
                alt="Download on the App Store"
                className="w-48 h-auto"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt&hl=en_GB&gl=US&pli=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/play_store.png"
                alt="Get it on Google Play"
                className="w-48 h-auto"
              />
            </a>
          </div>
        </div>
        <div className="flex justify-center">
          <PhoneFrame
            src="/images/screenshots/home.webp"
            alt="dgputt app screenshot"
          />
        </div>
      </section>

      <hr className="mx-8 border-gray-200" />

      {/* Ratings */}
      <section className="py-8 px-4 sm:px-16">
        <h2 className="mb-4">App Store Ratings</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">4.8</span>
            <div>
              <div
                className="flex text-yellow-500"
                aria-label="4.8 out of 5 stars"
              >
                {"★★★★★"}
              </div>
              <p className="text-sm text-muted-foreground">App Store</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">4.7</span>
            <div>
              <div
                className="flex text-yellow-500"
                aria-label="4.7 out of 5 stars"
              >
                {"★★★★★"}
              </div>
              <p className="text-sm text-muted-foreground">Google Play</p>
            </div>
          </div>
        </div>
      </section>

      <hr className="mx-8 border-gray-200" />

      <Reviews />

      <hr className="mx-8 border-gray-200" />

      {/* Kastkultur */}
      <section className="py-8 px-4 sm:px-16">
        <h2 className="mb-4">Featured on Kastkultur</h2>
        <p className="mb-4">
          Check out the dgputt collection on Kastkultur - the home of disc golf
          culture in Scandinavia.
        </p>
        <div className="flex items-center gap-4">
          <img
            src="/images/rund_k.png"
            alt="Kastkultur logo"
            className="h-12 w-auto"
          />
          <a
            href="https://www.kastkultur.com/dgputt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            Visit Kastkultur
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
