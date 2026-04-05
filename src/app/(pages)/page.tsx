import Reviews from "@/app/components/home/reviews";

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
          <img
            src="/images/home.png"
            alt="dgputt app screenshot"
            className="h-120 w-auto"
          />
        </div>
      </section>

      <hr className="mx-8 border-gray-200" />

      <Reviews />
    </>
  );
}
