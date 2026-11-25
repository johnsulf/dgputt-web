import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd, pageMetadata, SITE_URL } from "@/lib/seo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { AppStoreLinks } from "@/app/components/app-store-links";
import { ScreenshotPreview } from "@/app/components/screenshot-preview";
import { RatingCalculation } from "./rating-calculation";
import {
  benefits,
  faqs,
  quickStart,
  sections,
  type GuideItem,
  type GuideSection,
} from "./content";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/guide",
    title: "How to Run a Putting League - Setup Guide | dgputt",
    description:
      "Learn how to start and run a disc golf putting league, online or in person. Setup steps, formats, scoring, standings and live leaderboards. Players join free.",
  }),
  keywords: [
    "how to run a putting league",
    "disc golf putting league",
    "putting league software",
    "online putting league",
    "putting tournament",
    "disc golf league app",
  ],
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/guide`,
    url: `${SITE_URL}/guide`,
    name: "How to run a putting league",
    about: "Running disc golf putting leagues",
    dateModified: "2026-11-20",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "dgputt", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "League guide",
        item: `${SITE_URL}/guide`,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to run a putting league online with dgputt",
    step: quickStart.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

type Grid = { head: string[]; rows: string[][] };

function GuideTable({ table }: { table: Grid }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table className="text-base">
        <TableHeader className="bg-muted">
          <TableRow>
            {table.head.map((h, i) => (
              <TableHead key={i} scope="col" className="whitespace-normal">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row, r) => (
            <TableRow key={r}>
              {row.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="p-3 text-left font-medium">
                    {cell}
                  </th>
                ) : (
                  <TableCell key={c} className="whitespace-normal">
                    {cell}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ItemBody({ item }: { item: GuideItem }) {
  return (
    <div className="space-y-3">
      {item.text && <p>{item.text}</p>}
      {item.bullets && (
        <ul className="list-disc space-y-1 pl-5">
          {item.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {item.table && <GuideTable table={item.table} />}
    </div>
  );
}

function GuideDetails({ items, children }: { items: GuideItem[]; children?: ReactNode }) {
  return (
    <Accordion className="bg-card">
      {items.map((item) => (
        <AccordionItem key={item.title}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>
            <ItemBody item={item} />
          </AccordionContent>
        </AccordionItem>
      ))}
      {children}
    </Accordion>
  );
}

function GuideTabList({ label, names }: { label: string; names: string[] }) {
  return (
    <TabsList aria-label={label} className="grid h-auto! w-full grid-cols-3 rounded-xl border bg-card p-1">
      {names.map((name) => (
        <TabsTrigger key={name} value={name} className="min-h-11 rounded-lg px-1 data-active:bg-secondary data-active:text-secondary-foreground dark:data-active:bg-secondary dark:data-active:text-secondary-foreground">
          {name}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

const formatSummaries = [
  {
    name: "StormPutt",
    headline: "Six distances",
    label: "Take a step back at each station",
    use: "A straightforward first league round",
  },
  {
    name: "Stations",
    headline: "Build your own format",
    label: "Choose the distances, scoring and rules",
    use: "From obstacle courses to timed challenges",
  },
  {
    name: "Cornhole",
    headline: "Head-to-head",
    label: "Play an opponent, one set at a time",
    use: "Swiss or round-robin pairing",
  },
];

function FormatPicker({ items }: { items: GuideItem[] }) {
  return (
    <Tabs defaultValue="StormPutt" className="gap-3">
      <GuideTabList label="Event formats" names={formatSummaries.map(({ name }) => name)} />
      {formatSummaries.map(({ name, headline, label, use }) => {
        const format = items.find((item) => item.title === name);
        const extras = name === "Stations"
          ? items.filter((item) => item.title === "Stations win conditions")
          : [];
        return (
          <TabsContent key={name} value={name} keepMounted className="space-y-4 rounded-2xl border bg-card p-4 text-base focus-visible:ring-2 focus-visible:ring-ring sm:p-6">
            <div className="grid items-center gap-4 rounded-xl bg-[#092b46] p-4 text-white sm:grid-cols-[1fr_1fr] sm:p-5">
              <div>
                <p className="font-display text-3xl font-bold text-[#ffda33]">{headline}</p>
                <p className="text-slate-100">{label}</p>
              </div>
              <p className="font-semibold sm:justify-self-end sm:text-right">{use}</p>
            </div>
            {format && <ItemBody item={format} />}
            {extras.length > 0 && <GuideDetails items={extras} />}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}

const eventStages = [
  {
    name: "Before play",
    actions: ["Open registration", "Check in players if required", "Set up teams, then groups as needed"],
    details: ["Players", "Teams (doubles)", "Groups"],
  },
  {
    name: "During play",
    actions: ["Start the round", "Check scores as they come in", "Message players if plans change"],
    details: ["Rounds", "Scores", "Communication"],
  },
  {
    name: "Finish",
    actions: ["Review the scores", "Finish the event", "Share the results"],
    details: ["Finishing", "Finished-event summary", "Changing your mind"],
  },
];

function EventDayGuide({ items }: { items: GuideItem[] }) {
  return (
    <Tabs defaultValue={eventStages[0].name} className="gap-3">
      <GuideTabList label="Event day stages" names={eventStages.map(({ name }) => name)} />
      {eventStages.map(({ name, actions, details }) => (
        <TabsContent key={name} value={name} keepMounted className="space-y-3 text-base focus-visible:ring-2 focus-visible:ring-ring">
          <ol className="grid gap-3 rounded-2xl bg-[#092b46] p-4 text-white sm:grid-cols-3 sm:p-5">
            {actions.map((action, index) => (
              <li key={action} className="flex items-center gap-3 font-medium sm:items-start">
                <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                  {index + 1}
                </span>
                <span className="sm:pt-1">{action}</span>
              </li>
            ))}
          </ol>
          <GuideDetails items={items.filter((item) => details.includes(item.title))} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function RatingOverview() {
  return (
    <dl className="w-fit rounded-2xl bg-[#092b46] px-6 py-4 text-white">
      <dt className="font-semibold text-slate-100">Starting rating</dt>
      <dd className="mt-1 font-display text-4xl font-bold text-[#ffda33]">1500</dd>
    </dl>
  );
}

function GetTheApp({ heading }: { heading: string }) {
  return (
    <section id="get-the-app" className="scroll-mt-8 space-y-4 rounded-3xl border bg-card p-6 sm:p-8">
      <h2>{heading}</h2>
      <p className="max-w-xl leading-relaxed">
        Open Compete and choose Leagues in the dgputt app. Players can join for
        free. Hosting a league requires a subscription.
      </p>
      <AppStoreLinks />
    </section>
  );
}

const guideTopics = [
  {
    title: "Set up",
    links: [
      ["quick-start", "Quick start"],
      ["leagues", "Create league"],
      ["creating-an-event", "League event setup"],
    ],
  },
  {
    title: "Run an event",
    links: [
      ["formats", "Game formats"],
      ["td-tools", "TD tools"],
      ["brackets", "Brackets"],
    ],
  },
  {
    title: "Play and follow",
    links: [
      ["players", "Player experience"],
      ["ratings", "Putting rating"],
      ["web", "Results on the web"],
      ["live-view", "Live leaderboard"],
      ["faq", "FAQ"],
    ],
  },
];

function GuideTopicLinks() {
  return (
    <nav aria-label="Guide topics" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-1">
        {guideTopics.map((group) => (
          <div key={group.title} className="group/topic max-sm:last:col-span-2">
            <p className="mb-1 text-sm font-semibold">{group.title}</p>
            <ul className="max-sm:group-last/topic:grid max-sm:group-last/topic:grid-cols-2">
              {group.links.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="flex min-h-9 items-center rounded-md text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </nav>
  );
}

function GuideIndex() {
  return (
    <aside id="guide-topics" className="scroll-mt-6 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto">
      <details className="rounded-2xl border bg-card p-4 lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg font-display text-lg font-bold focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          On this page
          <span aria-hidden="true" className="size-2 rotate-45 border-r-2 border-b-2" />
        </summary>
        <div className="mt-3 border-t pt-4"><GuideTopicLinks /></div>
      </details>
      <div className="hidden rounded-2xl border bg-card p-5 lg:block">
        <p className="mb-4 font-display text-lg font-bold">On this page</p>
        <GuideTopicLinks />
      </div>
    </aside>
  );
}

function ReferenceSection({ section }: { section: GuideSection }) {
  return (
    <section id={section.id} className="scroll-mt-8 space-y-4">
      <h2>{section.title}</h2>
      {section.intro && <p>{section.intro}</p>}
      {section.id === "ratings" && <RatingOverview />}
      {section.id === "players" && (
        <Link href="/guide/players" className="inline-flex min-h-11 items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-[#ffe16a]">
          Read the player guide
        </Link>
      )}
      {section.items && (section.id === "formats" ? (
        <FormatPicker items={section.items} />
      ) : section.id === "td-tools" ? (
        <EventDayGuide items={section.items} />
      ) : (
        <GuideDetails items={section.items}>
          {section.id === "ratings" && (
            <AccordionItem>
              <AccordionTrigger>How are ratings calculated?</AccordionTrigger>
              <AccordionContent>
                <RatingCalculation />
              </AccordionContent>
            </AccordionItem>
          )}
        </GuideDetails>
      ))}
    </section>
  );
}

export default function GuidePage() {
  const screenshot = {
    src: "/images/screenshots/leagues.webp",
    alt: "Leagues in the dgputt app with an ongoing online Stations event",
  };

  return (
    <div className="space-y-12 px-4 py-8 sm:space-y-16 sm:px-10 sm:py-12">
      {structuredData.map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}

      <header className="space-y-4">
        <nav aria-label="Breadcrumb" className="text-sm">
          <Link href="/" className="hover:underline">
            dgputt
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <span aria-current="page">League guide</span>
        </nav>
        <div className="grid overflow-hidden rounded-3xl bg-[#092b46] text-white md:grid-cols-[minmax(0,1fr)_minmax(0,0.58fr)]">
          <div className="flex flex-col justify-center px-6 py-8 sm:p-10 lg:p-12">
            <h1 className="max-w-xl text-4xl/tight! tracking-tight sm:text-5xl/tight!">
              How to run a putting league
            </h1>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-100">
              Bring your putting crew back week after week. Run events in the
              dgputt app, follow the season standings and see how your putting
              rating changes as you play.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#quick-start"
                className="inline-flex min-h-11 items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-[#ffe16a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Set up your league
              </a>
              <a
                href="#ratings"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/50 px-4 py-2 font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                How ratings work
              </a>
              <Link
                href="/guide/players"
                className="inline-flex min-h-11 items-center rounded-xl border border-white/50 px-4 py-2 font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Join as a player
              </Link>
            </div>
          </div>
          <figure className="flex flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,#1a6880,transparent_75%)] px-6 pb-8 md:p-8">
            <ScreenshotPreview {...screenshot} className="rounded-[1.5rem] sm:rounded-[1.75rem]">
              <Image
                src={screenshot.src}
                alt={screenshot.alt}
                width={1320}
                height={2868}
                loading="eager"
                className="h-auto w-28 rounded-[1.5rem] border-4 border-[#061b2c] sm:w-40 sm:rounded-[1.75rem]"
              />
            </ScreenshotPreview>
            <figcaption className="text-center text-sm text-slate-100">
              Browse leagues and their events in the app.
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <GuideIndex />
        <div className="min-w-0 space-y-10 [&>section+section]:border-t [&>section+section]:pt-8 [&_[data-slot=accordion-content]]:text-base [&_[data-slot=accordion-trigger]]:text-base [&_[data-slot=accordion-trigger]]:focus-visible:outline-2 [&_[data-slot=accordion-trigger]]:focus-visible:-outline-offset-2 [&_[data-slot=accordion-trigger]]:focus-visible:outline-ring">
          <section id="quick-start" className="scroll-mt-8 space-y-4">
            <h2>How to start a putting league in 5 steps</h2>
            <ol className="divide-y rounded-2xl border bg-card">
              {quickStart.map((step, i) => (
                <li key={step.title} className="flex gap-4 p-4 sm:p-5">
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
                    {i + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-xl/tight!">{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href="#get-the-app" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
              Get the dgputt app
            </a>
          </section>

          <section className="space-y-4">
            <h2>Why run your putting league on dgputt</h2>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 [&>div:first-child]:rounded-2xl [&>div:first-child]:border [&>div:first-child]:border-l-4 [&>div:first-child]:border-l-secondary [&>div:first-child]:bg-card [&>div:first-child]:p-4 sm:[&>div:first-child]:col-span-2">
              {benefits.map((benefit) => (
                <div key={benefit.title}>
                  <dt className="font-semibold">{benefit.title}</dt>
                  <dd className="text-foreground/80">{benefit.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          {sections.map((section) => (
            <ReferenceSection key={section.id} section={section} />
          ))}

          <WebGuide />
          <GuideFaq />
          <GetTheApp heading="Get dgputt and start your league" />
        </div>
      </div>
    </div>
  );
}

function WebGuide() {
  const screenshot = {
    src: "/images/screenshots/web-stormputt-event.jpg",
    alt: "A live StormPutt event showing overall standings with hit rates by distance, plus individual scores and progress for round two.",
  };

  return (
    <section id="web" aria-labelledby="web-heading" className="scroll-mt-8 space-y-8">
      <div className="rounded-3xl bg-[#092b46] p-5 text-white sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
          <div className="space-y-2">
            <h2 id="web-heading" className="m-0 text-white">dgputt Web</h2>
            <p className="max-w-lg text-white/90">
              Follow a putting night as scores come in, see who leads the
              season, or put the live leaderboard on a screen at your venue.
            </p>
          </div>
          <Link href="/leagues" className="inline-flex min-h-11 w-fit items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-[#ffe16a]">
            Browse leagues
          </Link>
        </div>
        <p className="mt-4 border-t border-white/20 pt-4 text-sm text-white/90">
          Sign in with your dgputt account, then search for your league by name.
          Use the mobile app to create an account, register for an event and
          enter scores.
        </p>
      </div>

      <section aria-labelledby="web-results" className="space-y-4">
        <h3 id="web-results" className="scroll-mt-8 font-display text-xl font-bold">Find event results</h3>
        <p>
          Open your league and choose <strong>Events</strong>. Select an ongoing
          event to follow live scores, or look under <strong>Finished Events</strong>{" "}
          for past results. If your league uses seasons, select the season you
          want first.
        </p>
        <figure className="overflow-hidden rounded-2xl border bg-card">
          <ScreenshotPreview {...screenshot} className="w-full focus-visible:-outline-offset-4">
            <Image
              src={screenshot.src}
              alt={screenshot.alt}
              width={1162}
              height={684}
              sizes="(min-width: 1100px) 770px, (min-width: 1024px) calc(100vw - 330px), (min-width: 640px) calc(100vw - 82px), calc(100vw - 34px)"
              className="h-auto w-full"
            />
          </ScreenshotPreview>
          <figcaption className="border-t px-4 py-3 text-sm sm:px-5">
            StormPutt event page with sample scores.
          </figcaption>
        </figure>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>What each format shows</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>StormPutt</strong> shows total hits and hit rates by
                  distance. Use the round buttons to see how each player putted
                  in that round.
                </li>
                <li>
                  <strong>Stations</strong> shows per-station results and the
                  scores earned under the event’s scoring rules.
                </li>
                <li>
                  <strong>Cornhole</strong> shows standings and head-to-head
                  match scores. Choose a round to see its matches.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Divisions, teams and player profiles</AccordionTrigger>
            <AccordionContent>
              <p>
                Use the division filters when shown. Doubles results group players
                by team. Select a player’s PDGA number where it appears to open
                their PDGA profile.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section aria-labelledby="web-standings" className="space-y-4 border-t pt-6">
        <h3 id="web-standings" className="scroll-mt-8 font-display text-xl font-bold">Check the league standings</h3>
        <p>
          Open the league’s <strong>Leaderboard</strong>. Use <strong>Standings</strong>{" "}
          for points earned by placing in finished events, and <strong>Scores</strong>{" "}
          for putting results by format. Use the player search to find your name.
        </p>
        <figure className="space-y-4 rounded-2xl border bg-card p-5 sm:p-6">
          <figcaption>
            <p className="font-display text-xl font-bold">How many results count?</p>
            <p className="mt-1">
              With the 2/3 rule and 12 eligible events, each player’s best 8
              results count toward their standings. All 12 events stay in the
              league history.
            </p>
          </figcaption>
          <div aria-hidden="true" className="grid grid-cols-12 gap-1 sm:gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <span key={index} className={index < 8 ? "h-5 rounded-sm bg-secondary" : "h-5 rounded-sm border border-dashed border-foreground/45"} />
            ))}
          </div>
          <div aria-hidden="true" className="grid grid-cols-12 gap-1 text-sm font-semibold">
            <span className="col-span-8">Best 8 count</span>
            <span className="col-span-4">4 dropped</span>
          </div>
        </figure>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>How event points add up</AccordionTrigger>
            <AccordionContent>
              <p>
                The standard points table starts with 25 for first place, 18 for
                second and 15 for third. A league can use its own table and
                minimum points for finishing. In doubles, both teammates earn
                points for their team’s finish.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Season, format and counting rules</AccordionTrigger>
            <AccordionContent>
              <p>
                Switch seasons to compare standings. In <strong>All Formats</strong>,
                the league can count the best half,
                two-thirds or all eligible results. Select a specific format to
                see its standings with every eligible result counted.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section id="live-view" aria-labelledby="live-view-heading" className="scroll-mt-8 space-y-2 rounded-2xl border-l-4 border-secondary bg-card p-5 sm:p-6">
        <h3 id="live-view-heading" className="font-display text-xl font-bold">Show the live leaderboard on a TV</h3>
        <p>
          Sign in as a league admin and open an ongoing StormPutt, Stations or
          Cornhole event. Select <strong>Open TV view</strong> and put that tab on
          a TV or projector. The board updates automatically as scores come in.
        </p>
        <p className="text-sm text-muted-foreground">
          To change the display theme, choose <strong>Settings</strong> on the
          event page and set <strong>TV view</strong> to <strong>Dark</strong> or{" "}
          <strong>Light</strong> before opening the board.
        </p>
      </section>
    </section>
  );
}

function GuideFaq() {
  return (
    <section id="faq" className="scroll-mt-8 space-y-4">
      <h2>Frequently asked questions</h2>
      <Accordion>
        {faqs.map((f) => (
          <AccordionItem key={f.q}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>
              <p>{f.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="text-muted-foreground">
        Need inspiration? See the StormPutt 2022/23 League in the app: a weekly
        league with 19 events from November 2022 to March 2023.
      </p>
    </section>
  );
}
