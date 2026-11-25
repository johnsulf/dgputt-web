import type { Metadata } from "next";
import { AppStoreLinks } from "@/app/components/app-store-links";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { softwareApplication } from "@/lib/structured-data";
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

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About dgputt - Games, Features & Pricing",
  description:
    "Explore dgputt’s putting games, including Streak and Aim, plus progress tracking, course rounds, competitive leagues and pricing.",
});

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
      "Pick a single distance. 4 rounds of 5 putts. Quick and focused - great for warming up or drilling a weak distance.",
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
      "Cycle through 4 distances for 5 sets. Your score naturally gravitates around 100 - the goal is to get as close to 100 as possible.",
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
  {
    title: "Streak",
    summary:
      "Pick a distance and see how many putts you can make in a row. The first miss ends the streak. Come back to beat your personal best at that distance.",
    putts: "Varies",
  },
  {
    title: "Aim",
    summary:
      "Take 18 putts from a fixed distance or vary the distance each time. Mark where each putt lands on the basket to see how close you are to your aim point and how tightly your putts group.",
    putts: "18",
  },
];

const features = [
  { feature: freeGames.map((game) => game.title).join(", "), free: true, paid: true },
  { feature: "Basic stats", free: true, paid: true },
  { feature: "PDGA linking", free: true, paid: true },
  { feature: "Putting routine", free: true, paid: true },
  { feature: "Join leagues & events", free: true, paid: true },
  { feature: "Tag practice rounds with preset tags", free: true, paid: true },
  { feature: "Tag practice rounds with custom tags", free: false, paid: true },
  { feature: "Goals & streaks", free: false, paid: true },
  {
    feature: premiumGames.map((game) => game.title).join(", "),
    free: false,
    paid: true,
  },
  { feature: "Advanced progress insights", free: false, paid: true },
  { feature: "Round tracking & course management", free: false, paid: true },
  { feature: "Create & host leagues & events", free: false, paid: true },
  { feature: "League Leaderboards", free: false, paid: true },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-16">
      <JsonLd data={softwareApplication} />
      {/* Hero */}
      <section className="space-y-4 max-w-3xl">
        <h1>About the dgputt app</h1>
        <p className="text-lg">
          dgputt is a disc golf putting app designed to help players improve
          through structured drills, progress tracking, course round logging,
          and competitive leagues. Available on iOS and Android - all you need
          is a basket and ideally 6 putters.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2>How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Practice</CardTitle>
              <CardDescription>
                Choose from {freeGames.length + premiumGames.length} putting
                games to train accuracy, endurance, adaptability or putting
                under pressure. Every putt is recorded.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Track</CardTitle>
              <CardDescription>
                View hit rates by distance, monitor trends over time, set daily
                and weekly goals, and build practice streaks. Premium users get
                advanced insights and round tracking on real courses.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Compete</CardTitle>
              <CardDescription>
                Join a putting league, enter a standalone event, or challenge
                a friend to a match.
              </CardDescription>
              <a href="#compete" className="inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4">
                Explore the three ways to compete
              </a>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Free Games */}
      <section className="space-y-4 max-w-3xl">
        <h2>Free Games</h2>
        <p>Five drills available to everyone - no subscription needed.</p>
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
            alt="JYLY putting game in dgputt, entering makes from 10 m with hit rates for each distance from 5 to 10 m"
            caption="JYLY - a really popular game!"
          />
        </div>
      </section>

      {/* Premium Games */}
      <section id="premium-games" className="scroll-mt-8 space-y-4 max-w-3xl">
        <h2>Premium Games</h2>
        <p>Unlock {premiumGames.length} more putting games with a subscription.</p>
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
        <div className="mx-auto grid max-w-lg grid-cols-2 items-start gap-3 pt-4 text-center sm:gap-6">
          <PhoneFrame
            src="/images/screenshots/streak.webp"
            alt="Streak in dgputt showing ten consecutive makes at 7 metres"
            caption="Streak at 7 m"
            className="h-auto w-[min(39vw,12rem)]"
          />
          <PhoneFrame
            src="/images/screenshots/aim.webp"
            alt="Aim in dgputt showing a marked putt on the basket with accuracy and precision scores"
            caption="Aim hit-point tracking"
            className="h-auto w-[min(39vw,12rem)]"
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
          tension level. And of course, track hit- and miss point by tapping the
          basket. Review round summaries with total putts, hit percentage, and
          score vs par - then share your scorecards with friends.
        </p>
        <div className="flex justify-center pt-4">
          <PhoneFrame
            src="/images/screenshots/round.webp"
            alt="dgputt round scorecard with per-hole scores, C1x and C2 putting percentages and a basket map of hits and misses"
            caption="Tracking putts during a round of disc golf"
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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <PhoneFrame
            src="/images/screenshots/progress.webp"
            alt="dgputt progress totals showing rounds, putts and hit percentage overall, by year, month and day"
            caption="Overall progress"
          />
          <PhoneFrame
            src="/images/screenshots/jyly_progress.webp"
            alt="JYLY stats in dgputt with live rating and a chart of putts and hit percentage by distance"
            caption="JYLY game stats"
          />
        </div>
      </section>

      <section id="compete" className="scroll-mt-8 space-y-4">
        <h2>Three ways to compete</h2>
        <p className="max-w-3xl">
          Joining leagues and events or accepting a match is free. Creating
          any of the three requires a dgputt subscription. With location access
          enabled on your phone, the app shows active leagues and events nearest
          to you first.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle>Leagues</CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Run regular putting nights and earn points toward season
                standings. Play StormPutt, Stations or Cornhole.
              </CardDescription>
              <Link href="/guide" className="inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4">
                Read the league guide
              </Link>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Single events</CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Challenge a group of friends to a putting night or a weekend
                Flex event. Everyone competes on one leaderboard.
              </CardDescription>
              <Link href="/about/compete#host-an-event" className="inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4">
                Try a single event
              </Link>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Matches</CardTitle>
              <CardDescription className="text-base text-foreground/80">
                Challenge one friend to Cornhole, Sevens or JYLY. Play Casual
                to warm up or Rated to play for your putting rating.
              </CardDescription>
              <Link href="/about/compete#try-a-match" className="inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4">
                Try a match
              </Link>
            </CardHeader>
          </Card>
        </div>
        <p className="max-w-3xl">
          Eligible rated events and rated matches feed the same putting rating. {" "}
          <Link href="/about/compete#ratings" className="font-semibold underline underline-offset-4">
            How the putting rating works
          </Link>
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <PhoneFrame
            src="/images/screenshots/leagues.webp"
            alt="A dgputt putting league page with an ongoing online Stations event"
            caption="Browse leagues"
          />
          <PhoneFrame
            src="/images/screenshots/event_cornhole.webp"
            alt="Final leaderboard for a dgputt league event, ranking players by wins and hit percentage"
            caption="Event leaderboard"
          />
        </div>
      </section>

      {/* Profile */}
      <section id="profile-settings" className="scroll-mt-8 space-y-4 max-w-3xl">
        <h2>Profile &amp; Settings</h2>
        <p>
          Link your PDGA number, build a custom putting routine with
          step-by-step instructions, and earn badges as you reach milestones
          for total putts and rounds played in each game. Configure units
          (meters/feet), theme (light/dark), haptic feedback, and notification
          preferences.
        </p>
        <PhoneFrame
          src="/images/screenshots/achievements.webp"
          alt="The dgputt Badges screen with a Total putts career badge and a grid of game badges at different levels"
          caption="Open Badges from your profile."
        />
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
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {f.paid ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    ) : (
                      "-"
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
        <AppStoreLinks className="[&_img]:w-48" />
      </section>
    </div>
  );
}
