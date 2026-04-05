import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PhoneFrame from "@/app/components/phone-frame";

const freeGames = [
  {
    title: "StormPutt",
    summary:
      "The signature drill. 6 stations at increasing distances, 6 putts per station. A complete putting workout that covers your full range.",
    putts: "36",
  },
  {
    title: "Twenty",
    summary:
      "Pick a single distance. 4 rounds of 5 putts. Quick and focused — great for warming up or drilling a weak distance.",
    putts: "20",
  },
  {
    title: "Fifty",
    summary:
      "Pick a single distance. 10 rounds of 5 putts. A deeper session for building consistency at one distance.",
    putts: "50",
  },
  {
    title: "JYLY",
    summary:
      "An adaptive game that adjusts distance based on your performance. Hit all 5? Move farther. Miss all 5? Move closer. Score = hits × distance. Available in Normal and Long variants.",
    putts: "100",
  },
  {
    title: "Frøysa",
    summary:
      "Cycle through 4 distances for 5 sets. Your score naturally gravitates around 100 — the goal is to get as close to 100 as possible.",
    putts: "100",
  },
];

const premiumGames = [
  {
    title: "Hundred",
    summary:
      "Pick a distance and keep putting until you reach 100 makes. Tests endurance and consistency.",
    putts: "100 hits",
  },
  {
    title: "Runsjø",
    summary:
      "A ladder game. Start short and climb to the longest distance, then come back down. 2 makes = move farther, 0 = move closer, 1 = stay. Complete it in under 100 putts.",
    putts: "≤100",
  },
  {
    title: "Shuffle",
    summary:
      "18 or 36 putts at fully randomised distances. Simulates the unpredictability of a real round.",
    putts: "18/36",
  },
  {
    title: "Survival",
    summary:
      "A lives-based challenge. Every miss costs a life. Score = stations reached + remaining lives. Classic and Rienk modes available.",
    putts: "Varies",
  },
  {
    title: "Cornhole",
    summary:
      "Match play against AI opponents with varying skill levels. Head-to-head to 11 points. A fun competitive twist on putting practice.",
    putts: "Varies",
  },
];

const features = [
  { feature: "StormPutt, Twenty, Fifty, JYLY, Frøysa", free: true, paid: true },
  { feature: "Basic progress & stats", free: true, paid: true },
  { feature: "Goals & streaks", free: true, paid: true },
  { feature: "PDGA linking", free: true, paid: true },
  { feature: "Putting routine", free: true, paid: true },
  { feature: "Achievements", free: true, paid: true },
  {
    feature: "Hundred, Runsjø, Shuffle, Survival, Cornhole",
    free: false,
    paid: true,
  },
  { feature: "Advanced insights", free: false, paid: true },
  { feature: "Round tracking & course management", free: false, paid: true },
  { feature: "Custom tags", free: false, paid: true },
  { feature: "Leagues & events", free: false, paid: true },
  { feature: "Leaderboards", free: false, paid: true },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-16">
      {/* Hero */}
      <section className="space-y-4 max-w-3xl">
        <h1>About dgputt</h1>
        <p className="text-lg">
          dgputt is a disc golf putting practice app designed to help players
          improve through structured drills, progress tracking, course round
          logging, and competitive leagues. Available on iOS and Android — all
          you need is a basket and ideally 6 putters.
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
                competitive pressure. Every putt is recorded.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Track</CardTitle>
              <CardDescription>
                View hit rates by distance, monitor trends over time, set daily
                and weekly goals, and build practice streaks. Premium users get
                advanced insights and round tracking on real courses.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Compete</CardTitle>
              <CardDescription>
                Create or join putting leagues. Host events with live
                leaderboards, track season standings, and bring your putting
                community together.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Free Games */}
      <section className="space-y-4 max-w-3xl">
        <h2>Free Games</h2>
        <p>Five drills available to everyone — no subscription needed.</p>
        <Accordion>
          {freeGames.map((game) => (
            <AccordionItem key={game.title}>
              <AccordionTrigger>{game.title}</AccordionTrigger>
              <AccordionContent>
                <p>{game.summary}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex justify-center pt-4">
          <PhoneFrame
            src="/images/screenshots/jyly.webp"
            alt="JYLY game screenshot"
          />
        </div>
      </section>

      {/* Premium Games */}
      <section className="space-y-4 max-w-3xl">
        <h2>Premium Games</h2>
        <p>Five additional drills unlocked with a subscription.</p>
        <Accordion>
          {premiumGames.map((game) => (
            <AccordionItem key={game.title}>
              <AccordionTrigger>{game.title}</AccordionTrigger>
              <AccordionContent>
                <p>{game.summary}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="flex justify-center pt-4">
          <PhoneFrame
            src="/images/screenshots/cornhole.webp"
            alt="Cornhole game screenshot"
          />
        </div>
      </section>

      {/* Distances */}
      <section className="space-y-4 max-w-3xl">
        <h2>Distances</h2>
        <p>
          Distances can be configured in meters or feet. Games support a normal
          range (5–10 m / 16–33 ft), a long range (10–15 m / 33–50 ft), and a
          full range (4–15 m).
        </p>
      </section>

      {/* Round Tracking */}
      <section className="space-y-4 max-w-3xl">
        <h2 className="flex items-center gap-3">
          Round Tracking
          <Badge variant="secondary">Premium</Badge>
        </h2>
        <p>
          Track your putting during actual disc golf rounds on real courses.
          Create courses and layouts, log per-hole putt attempts, and tag each
          putt with conditions like stance, throwing style, wind, elevation, and
          tension level. Review round summaries with total putts, hit
          percentage, and score vs par — then share your scorecards with
          friends.
        </p>
        <div className="flex justify-center pt-4">
          <PhoneFrame
            src="/images/screenshots/round.webp"
            alt="Round tracking screenshot"
          />
        </div>
      </section>

      {/* Progress & Stats */}
      <section className="space-y-4 max-w-3xl">
        <h2 className="flex items-center gap-3">
          Progress &amp; Stats
          <Badge variant="secondary">Premium</Badge>
        </h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Totals &amp; Graphs</AccordionTrigger>
            <AccordionContent>
              <p>
                All-time, yearly, monthly, and daily stats with line graphs
                showing your progress over time.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Per-Game Breakdown</AccordionTrigger>
            <AccordionContent>
              <p>
                Distance-based hit percentages for each game. Filter by time
                period. JYLY includes a live global rating.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Goals &amp; Streaks</AccordionTrigger>
            <AccordionContent>
              <p>
                Set daily, weekly, and monthly putt goals. Track your current
                and record practice streak.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Advanced Insights</AccordionTrigger>
            <AccordionContent>
              <p>
                Long-term trend analysis, custom tags for filtering stats, and
                per-course round performance.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex justify-center gap-4 pt-4">
          <PhoneFrame
            src="/images/screenshots/progress.webp"
            alt="Progress overview screenshot"
          />
          <PhoneFrame
            src="/images/screenshots/jyly_progress.webp"
            alt="JYLY game progress screenshot"
          />
        </div>
      </section>

      {/* Leagues & Events */}
      <section className="space-y-4 max-w-3xl">
        <h2 className="flex items-center gap-3">
          Leagues &amp; Events
          <Badge variant="secondary">Premium</Badge>
        </h2>
        <p>
          Leagues bring competitive multiplayer to dgputt. Create or join
          leagues, register for events, submit scores, and climb leaderboards.
          Events support multiple formats — StormPutt, Cornhole, and Stations —
          with Classic, Flex, Team, and Bracket event types. Admins get a full
          suite of tournament director tools including group management, score
          editing, bracket generation, and PDF leaderboard export.
        </p>
        <p>
          <Link href="/guide" className="text-primary underline">
            Read the League Admin Guide →
          </Link>
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <PhoneFrame
            src="/images/screenshots/leagues.webp"
            alt="Leagues overview screenshot"
          />
          <PhoneFrame
            src="/images/screenshots/event_cornhole.webp"
            alt="Cornhole event screenshot"
          />
        </div>
      </section>

      {/* Profile */}
      <section className="space-y-4 max-w-3xl">
        <h2>Profile &amp; Settings</h2>
        <p>
          Link your PDGA number, build a custom putting routine with
          step-by-step instructions, and unlock achievements for milestones like
          500 putts, 1000 putts, league participation, and more. Configure units
          (meters/feet), theme (light/dark), haptic feedback, and notification
          preferences.
        </p>
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <h2>Free vs Premium</h2>
        <p>
          dgputt offers a generous free tier with core practice features. A
          subscription unlocks the full experience.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 max-w-xl">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
              <CardDescription>$2.49 / month</CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Annual</CardTitle>
              <CardDescription>
                $20.99 / year · 3-day free trial
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <div className="max-w-xl overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.feature}>
                  <TableCell>{f.feature}</TableCell>
                  <TableCell className="text-center">
                    {f.free ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {f.paid ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Download CTA */}
      <section className="space-y-4 max-w-3xl">
        <h2>Get the app</h2>
        <p>dgputt is available on iOS and Android.</p>
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
