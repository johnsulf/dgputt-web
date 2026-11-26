import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreLinks } from "@/app/components/app-store-links";
import PhoneFrame from "@/app/components/phone-frame";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/about/compete",
  title: "Putting Matches, Events & Leagues - dgputt",
  description:
    "Try a standalone putting event or challenge a league friend. Learn how rated events and head-to-head matches count toward your dgputt putting rating.",
});

const waysToPlay = [
  {
    id: "try-a-match",
    name: "Match",
    title: "Challenge a friend",
    description:
      "Turn a warm-up with a league friend into a Cornhole match. You each take two putts per set. One make is worth one point, two makes are worth three, and the target is 11. Try a Rated rematch and check both players’ rating changes on the result screen.",
    setup:
      "Open Compete, choose Matches and tap New match. Pick Cornhole, choose your opponent and distance, then select Rated or Casual. Once your friend accepts, enter your scores after each set. Choose Guest for an unrated game with someone who doesn’t have an account.",
    details: [
      {
        title: "Match formats and rules",
        bullets: [
          "Cornhole: take two putts per set. One make scores 1, two makes score 3. First to 11 wins, with no ties.",
          "Sevens: take turns putting. A make adds a point to the board. A miss means you collect all points on the board. First to 7 points loses.",
          "JYLY: compete for the highest score in Normal or Long mode.",
        ],
      },
      {
        title: "Challenges, handicaps and rematches",
        bullets: [
          "Send a challenge and wait for your opponent to accept. You can have one outgoing challenge or active match at a time. The challenger can cancel before any points are scored.",
          "Choose Handicap to play from different distances (or different maximum distances in JYLY). Casual, Guest and Handicap matches leave your rating unchanged.",
          "After the match, you can play again or share the result. A Rated match also shows your rating change.",
        ],
      },
    ],
  },
  {
    id: "start-a-league",
    name: "League",
    title: "Make it a weekly thing",
    description:
      "If people are already asking when you’ll play again, give them a short season to look forward to. Try four weekly putting nights and let each player’s best results count, so missing a week doesn’t end their run.",
    setup:
      "Open Compete, choose Leagues and tap + New league. Give it a name, then create the first event from inside the league. Finished events award points toward league standings.",
    guide: "/guide#leagues",
    guideLabel: "League settings and standings",
  },
];

export default function CompetePage() {
  return (
    <div className="space-y-12 px-4 py-8 sm:space-y-16 sm:px-10 sm:py-12">
      <div className="space-y-4">
        <Link
          href="/about#compete"
          className="inline-flex min-h-11 items-center font-medium underline decoration-current/40 underline-offset-4 hover:decoration-current"
        >
          About dgputt
        </Link>

        <section className="grid overflow-hidden rounded-3xl bg-[#092b46] text-white md:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)]">
          <div className="flex flex-col justify-center px-6 py-10 sm:p-12">
            <h1 className="max-w-xl text-4xl/none! tracking-tight sm:text-5xl/tight! lg:text-6xl/tight!">
              Make the next putt count
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-200">
              Get your friends together for a single event, challenge someone
              to a match or run a regular putting league. Eligible events and
              matches can count toward your putting rating.
            </p>
            <nav aria-label="Ways to compete" className="mt-8 flex flex-wrap gap-3">
              <a
                href="#host-an-event"
                className="inline-flex min-h-11 items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground transition-colors hover:bg-[#ffe16a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Try a single event
              </a>
              <a
                href="#try-a-match"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/50 px-4 py-2 font-semibold transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Try a match
              </a>
            </nav>
            <a
              href="#ratings"
              className="mt-3 inline-flex min-h-11 w-fit items-center font-medium underline decoration-white/50 underline-offset-4 hover:decoration-white"
            >
              See how the putting rating works
            </a>
          </div>

          <div className="flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#1a6880,transparent_72%)] px-6 pb-8 md:p-8">
            <PhoneFrame
              src="/images/screenshots/event_cornhole.webp"
              alt="An event leaderboard in dgputt showing wins and putting percentages"
              className="h-64 sm:h-80"
            />
          </div>
        </section>
      </div>

      <section
        id="host-an-event"
        aria-labelledby="single-event-heading"
        className="grid scroll-mt-6 gap-5 rounded-3xl border border-l-4 border-l-secondary bg-card p-6 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-10 sm:p-10"
      >
        <h2 id="single-event-heading" className="text-3xl/tight! tracking-tight sm:text-4xl/tight!">
          Challenge your friends to a single event
        </h2>
        <div className="space-y-4 leading-relaxed">
          <p>
            Turn a practice night into a putting competition. Pick a format,
            invite your friends and see who tops the event leaderboard. Meet
            up for a <strong>Classic</strong> event or run an online <strong>Flex</strong>{" "}
            challenge so everyone can play when it suits them.
          </p>
          <p>
            In the app, open <strong>Compete</strong>, choose <strong>Events</strong>{" "}
            and tap <strong>New event</strong>.
          </p>
          <Link
            href="/guide#creating-an-event"
            className="inline-flex min-h-11 items-center font-semibold underline decoration-current/40 underline-offset-4 hover:decoration-current"
          >
            See setup options in the league event guide
          </Link>
        </div>
      </section>

      <div className="divide-y divide-border border-y">
        {waysToPlay.map((way) => (
          <section
            key={way.id}
            id={way.id}
            className="grid scroll-mt-6 gap-5 px-2 py-8 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] sm:gap-10 sm:px-4 sm:py-10"
          >
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest">
                {way.name}
              </p>
              <h2 className="text-3xl/tight! tracking-tight sm:text-4xl/tight!">
                {way.title}
              </h2>
            </div>
            <div className="space-y-4 leading-relaxed">
              <p>{way.description}</p>
              <p>{way.setup}</p>
              {way.details && (
                <Accordion className="bg-card">
                  {way.details.map((detail) => (
                    <AccordionItem key={detail.title}>
                      <AccordionTrigger className="text-base">{detail.title}</AccordionTrigger>
                      <AccordionContent className="text-base">
                        <ul className="list-disc space-y-2 pl-5">
                          {detail.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              {way.guide && (
                <Link
                  href={way.guide}
                  className="inline-flex min-h-11 items-center font-semibold underline decoration-current/40 underline-offset-4 hover:decoration-current"
                >
                  {way.guideLabel}
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>

      <section id="ratings" className="scroll-mt-6 space-y-3 rounded-3xl bg-[#092b46] p-6 text-white sm:p-10">
        <h2>One putting rating across competitions</h2>
        <p className="max-w-2xl leading-relaxed text-slate-100">
          Your putting rating starts at 1500. Eligible rated rounds in leagues
          and standalone events, and rated one-on-one matches, all contribute
          to that same rating. League standings have their own season points
          based on where you finish in league events.
        </p>
      </section>

      <section className="rounded-3xl border bg-card p-6 sm:p-10">
        <h2 className="text-3xl tracking-tight">Pick a day and invite someone</h2>
        <p className="mt-3 max-w-2xl leading-relaxed">
          Open <strong>Compete</strong> in the app. Allow location access on your
          phone to see active leagues and events nearest to you first. Joining a
          league or event or accepting a match is free. Creating a competition
          requires a dgputt subscription.
        </p>
        <div className="mt-6">
          <AppStoreLinks />
        </div>
      </section>
    </div>
  );
}
