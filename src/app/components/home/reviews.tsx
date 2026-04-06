import { Review } from "@/app/interfaces/review";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
    <section className="py-8 px-4 sm:px-16">
      <h2 className="mb-4">User Reviews</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.userName} size="sm">
            <CardHeader>
              <CardTitle>{review.userName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">
                &ldquo;{review.review}&rdquo;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
