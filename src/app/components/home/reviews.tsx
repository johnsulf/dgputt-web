import { Review } from "@/app/interfaces/review";

const reviews: Review[] = [
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

export default function Reviews() {
  return (
    <>
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 sm:overflow-visible">
          {reviews.map((review) => (
            <div
              key={review.userName}
              className="grid gap-2 p-6 bg-brand-yellow-muted rounded-2xl min-w-70 sm:min-w-0 sm:flex-1"
            >
              <div>
                <h3 className="text-lg">by: {review.userName}</h3>
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
