import type { Review } from "@/app/interfaces/review";

const reviews: Review[] = [
  {
    userName: "G.Hill",
    review:
      "We run a very large putting league with player attendance averaging around 125 players per week. This app has simplified our jobs as event directors. The app runs smoothly with high volume. This will be the official scoring app inside the Putting Arena. ",
  },
  {
    userName: "Nicolai",
    review:
      "Fantastic tool for consistent training! Well thought-out exercises, that are both challenging and rewarding!",
  },
  {
    userName: "Ashley",
    review:
      "Great app with a variety of games to track your putting practice and keep it interesting! Definitely worth the premium.",
  },
  {
    userName: "Jimmy",
    review:
      "This app definitely keeps me pushing to do better. I currently stink at putting, simply because of losing interest while practicing. This is going to be a game changer.",
  },
];

export default function Reviews() {
  return (
    <section aria-labelledby="player-reviews" className="space-y-4 sm:space-y-5">
      <h2 id="player-reviews" className="text-3xl tracking-tight sm:text-4xl">What players say</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map(({ userName, review }) => (
          <figure key={userName} className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 sm:p-6">
            <blockquote className="leading-relaxed text-foreground/85">&ldquo;{review.trim()}&rdquo;</blockquote>
            <figcaption className="text-sm font-semibold">{userName}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
