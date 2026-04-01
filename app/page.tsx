const reviews = [
  {
    userName: "Nicolai",
    date: "Nov 29, 2024",
    review:
      "Fantastic tool for consistent training! Well thought-out exercises, that are both challenging and rewarding!",
    imgSrc: "/images/man_1.png",
  },
  {
    userName: "Ashley",
    date: "Jun 2, 2024",
    review:
      "Great app with a variety of games to track your putting practice and keep it interesting! Definitely worth the premium.",
    imgSrc: "/images/woman_1.png",
  },
  {
    userName: "Jimmy",
    date: "Feb 20, 2024",
    review:
      "This app definitely keeps me pushing to do better. I currently stink at putting, simply because of losing interest while practicing. This is going to be a game changer.",
    imgSrc: "/images/man_2.png",
  },
];

export default function Home() {
  return (
    <>
      <section className="grid gap-8 px-4 py-8 sm:grid-cols-2 sm:px-16 sm:items-center">
        <div className="text-left">
          <h1 className="font-[family-name:var(--font-bricolage)] text-5xl font-bold">
            Putt in the effort
          </h1>
          <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold mt-2">
            and become a better putter with dgputt
          </h2>
          <p className="my-4">
            dgputt is an app that delivers structured putting practice using
            diverse drills and distances. Enjoy dgputt for free with five drills
            and basic stats, or upgrade for full access, enhanced progress
            statistics, and putting league creation and hosting.
          </p>
          <div className="flex flex-wrap gap-3">
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
            className="h-[30rem] w-auto"
          />
        </div>
      </section>

      <hr className="mx-8 border-gray-200" />

      <section className="py-8 px-4">
        <h2 className="font-[family-name:var(--font-bricolage)] text-2xl font-bold mb-4">
          User Reviews
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 sm:overflow-visible">
          {reviews.map((review) => (
            <div
              key={review.userName}
              className="grid gap-2 p-6 bg-brand-yellow-muted rounded-2xl min-w-[280px] sm:min-w-0 sm:flex-1"
            >
              <div>
                <h3 className="font-[family-name:var(--font-bricolage)] text-lg">
                  by: {review.userName}
                </h3>
                <p className="text-xs text-text-muted">{review.date}</p>
              </div>
              <p className="italic">&ldquo;{review.review}&rdquo;</p>
              <img
                src={review.imgSrc}
                alt={review.userName}
                width={200}
                height={200}
                className="rounded-full justify-self-center"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
