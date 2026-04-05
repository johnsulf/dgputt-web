import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const games = [
  {
    title: "StormPutt",
    summary:
      "The signature drill. 36 putts across six increasing distances with 6 putters each. A complete warm-up and benchmark in one session.",
    putts: 36,
    free: true,
  },
  {
    title: "Twenty",
    summary:
      "Pick a distance and knock down 20 putts in sets of 5. Quick, focused repetition for dialling in a specific range.",
    putts: 20,
    free: true,
  },
  {
    title: "Fifty",
    summary:
      "Same idea as Twenty but doubled up — 50 putts from your chosen distance for deeper, more statistically meaningful practice.",
    putts: 50,
    free: true,
  },
  {
    title: "JYLY",
    summary:
      "100 putts with adaptive distances. Your next distance is determined by how many you hit, and scoring rewards both accuracy and range.",
    putts: 100,
    free: true,
  },
  {
    title: "Frøysa",
    summary:
      "100 putts working your way from close to far. Five sets across increasing distances — chase the perfect 100.",
    putts: 100,
    free: true,
  },
  {
    title: "Hundred",
    summary:
      "Pick a distance and keep going until you've made 100 hits. A true endurance test that reveals your consistency under fatigue.",
    putts: "100 hits",
    free: false,
  },
  {
    title: "Runsjø",
    summary:
      "Climb the distance ladder from short to long and back down. Hit both to advance, miss both to retreat — complete the round in under 100 putts.",
    putts: "≤100",
    free: false,
  },
  {
    title: "Shuffle",
    summary:
      "18 or 36 putts from randomised distances with a single putter. Simulates the variety you face on the course.",
    putts: "18/36",
    free: false,
  },
  {
    title: "Survival",
    summary:
      "Start close and move further out — every miss costs a life. See how far you can go before you run out of discs.",
    putts: "Varies",
    free: false,
  },
  {
    title: "Cornhole",
    summary:
      "Head-to-head match play to 11 points. Each sequence both players putt twice — hit both for 3 points, one for 1 point.",
    putts: "Varies",
    free: false,
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-12">
      {/* Hero */}
      <section className="space-y-4 max-w-2xl">
        <h1>About dgputt</h1>
        <p className="text-lg ">
          dgputt is a disc golf putting practice app built to help you improve
          with structured drills, tracked stats, and competitive leagues.
          Whether you are warming up before a round or logging serious practice
          hours, dgputt gives you the tools to measure progress and stay
          motivated.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2>How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Practice</CardTitle>
              <CardDescription>
                Choose from 10 different putting drills. Each one targets a
                different skill — accuracy, endurance, adaptability, or
                competitive pressure.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Track</CardTitle>
              <CardDescription>
                Every putt is recorded. View your hit rates by distance, monitor
                trends over time, and identify where to focus next.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Compete</CardTitle>
              <CardDescription>
                Create or join a putting league. Host events with live
                leaderboards, track season standings, and bring your putting
                community together.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Games */}
      <section className="space-y-4">
        <h2>Games</h2>
        <p>
          dgputt includes 10 different putting drills — 5 free, 5 with a premium
          subscription.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <Card key={game.title} size="sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {game.title}
                  {game.free ? (
                    <Badge variant="outline">Free</Badge>
                  ) : (
                    <Badge variant="secondary">Premium</Badge>
                  )}
                </CardTitle>
                <CardDescription>{game.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <span>Putts: {game.putts}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Leagues & Events */}
      <section className="space-y-4 max-w-2xl">
        <h2>Leagues &amp; Events</h2>
        <p>
          With a premium subscription you can create a league, invite players,
          and host putting events. Events use the StormPutt or Cornhole format
          and include a live leaderboard designed for big-screen display. Season
          standings are tracked automatically so you can crown a champion at the
          end of each season.
        </p>
      </section>

      {/* Download CTA */}
      <section className="space-y-4 max-w-2xl">
        <h2>Get the app</h2>
        <p>
          dgputt is available on iOS and Android. The free tier includes five
          drills and basic stats. Upgrade to premium for all drills, detailed
          analytics, and league features.
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
            href="https://play.google.com/store/apps/details?id=com.erlendjohnsen.dgputt"
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
      </section>
    </div>
  );
}
