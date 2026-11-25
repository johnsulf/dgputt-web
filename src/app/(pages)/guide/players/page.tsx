import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AppStoreLinks } from "@/app/components/app-store-links";
import { ScreenshotPreview } from "@/app/components/screenshot-preview";

export const metadata: Metadata = pageMetadata({
  path: "/guide/players",
  title: "How to Join and Play in a Putting League | dgputt",
  description:
    "Find a dgputt putting league, register for your first event, check in, play your round and follow your results and season standings.",
});

const topics = [
  { id: "join", label: "Find and register" },
  { id: "check-in", label: "Check in" },
  { id: "play", label: "Play and score" },
  { id: "results", label: "Follow results" },
];

const eventTypes = [
  {
    name: "Classic",
    description: "Play at the scheduled time. Wait for the organiser to start the round, then check the app for your group or opponent. Take turns on the same basket when playing in a group.",
  },
  {
    name: "Flex",
    description: "Play during the event window at the listed venue, or wherever you are if the event is online. Start when you’re ready. If groups are enabled, use Join group to join or create one before scoring.",
  },
  {
    name: "Bracket",
    description: "Check the bracket for your opponent and follow the organiser’s start instructions. Winners advance to the next round.",
  },
];

export default function LeaguePlayerGuidePage() {
  const leagueScreenshot = {
    src: "/images/screenshots/leagues.webp",
    alt: "The Events tab in a dgputt league showing an online Stations event",
  };
  const resultsScreenshot = {
    src: "/images/screenshots/event_cornhole.webp",
    alt: "A league event’s Table tab showing players’ wins and hit percentages",
  };

  return (
    <div className="space-y-10 px-4 py-8 sm:space-y-12 sm:px-10 sm:py-12">
      <header className="space-y-4">
        <Link href="/guide" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          League guide
        </Link>
        <div className="space-y-4 rounded-3xl bg-[#092b46] p-6 text-white sm:p-10">
          <h1 className="text-4xl/tight! tracking-tight sm:text-5xl/tight!">How to join a putting league</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-100">
            Find your league, sign up for an event and see how you did. You’ll
            need a free dgputt account to register. Check with the organiser
            about any event fee.
          </p>
          <a href="#join" className="inline-flex min-h-11 items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-[#ffe16a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            Find your first event
          </a>
        </div>
      </header>

      <nav aria-label="Player guide sections" className="grid grid-cols-2 gap-2 rounded-2xl border bg-card p-2 sm:grid-cols-4">
        {topics.map(({ id, label }) => (
          <a key={id} href={`#${id}`} className="flex min-h-11 items-center justify-center rounded-xl px-2 py-2 text-center text-sm font-semibold underline decoration-current/40 underline-offset-4 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">
            {label}
          </a>
        ))}
      </nav>

      <section id="join" className="grid scroll-mt-8 gap-5 md:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="space-y-4">
          <h2>Find a league and register</h2>
          <ol className="list-decimal space-y-3 pl-6 marker:font-bold">
            <li>Open the dgputt app and sign in or create a free account.</li>
            <li>
              Tap <strong>Compete</strong> and choose <strong>Leagues</strong>.
              If dgputt has access to your phone’s location, active leagues and
              events are listed nearest first. Use <strong>Search leagues</strong>{" "}
              to find a league by name.
            </li>
            <li>Open the league’s <strong>Events</strong> tab, pick an upcoming event and tap <strong>Register</strong>. Registration is for each event you want to play.</li>
            <li>If asked, enter the PIN from the organiser and choose your division. For doubles, follow the event’s instructions for choosing a partner or getting paired.</li>
          </ol>
          <p className="rounded-xl border-l-4 border-secondary bg-card px-4 py-3">
            If <strong>Register</strong> is missing, check whether registration has opened or ask the organiser if the event is full.
          </p>
          <AppStoreLinks />
        </div>
        <figure className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#092b46] p-5 text-white">
          <ScreenshotPreview {...leagueScreenshot} className="rounded-2xl">
            <Image
              src={leagueScreenshot.src}
              alt={leagueScreenshot.alt}
              width={1320}
              height={2868}
              className="h-auto w-32 rounded-2xl"
            />
          </ScreenshotPreview>
          <figcaption className="text-center text-sm">Open the league’s Events tab to find a round.</figcaption>
        </figure>
      </section>

      <section id="check-in" className="scroll-mt-8 space-y-4 border-t pt-8">
        <h2>Know when to show up</h2>
        <p>After registering, tap <strong>What Now?</strong> when it’s shown on the event page. It explains the start, gives check-in instructions and lets you add the event to your calendar. Look in <strong>Messages</strong> for updates from the organiser.</p>
        <p>If the organiser pinned the location, open the event menu and tap <strong>Venue</strong> to see where to meet on the map.</p>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["Player check-in", "Tap Check In when you arrive. The button appears 15 minutes before the start."],
            ["Admin check-in", "Find the organiser or check-in desk when you arrive."],
            ["Auto check-in", "Keep the app open near the venue. If you aren’t checked in automatically, use Check In when it appears."],
            ["No check-in", "You’re checked in when you register. Flex events don’t require a separate check-in."],
          ].map(([label, description]) => (
            <div key={label} className="space-y-1 rounded-2xl border bg-card p-4">
              <dt className="font-semibold">{label}</dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="play" className="scroll-mt-8 space-y-4 border-t pt-8">
        <h2>Play your round and enter scores</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {eventTypes.map(({ name, description }) => (
            <div key={name} className="space-y-2 rounded-2xl border bg-card p-4">
              <h3 className="text-xl/tight!">{name}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
        <p className="rounded-xl bg-[#092b46] px-5 py-4 text-white">
          Use <strong>Enter score</strong> when it’s available. If you’re playing in a group or a match, agree on one person to enter the scores. If a score looks wrong, ask the organiser to correct it.
        </p>
        <Link href="/guide#formats" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
          How StormPutt, Stations and Cornhole are played
        </Link>
      </section>

      <section id="results" className="grid scroll-mt-8 gap-5 border-t pt-8 md:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="space-y-4">
          <h2>See your results and follow the season</h2>
          <dl className="divide-y rounded-2xl border bg-card">
            <div className="space-y-1 p-4">
              <dt className="font-semibold">Event results</dt>
              <dd>Open the event’s <strong>Table</strong> for the overall results. Use the round tabs for individual rounds, or the bracket for elimination results.</dd>
            </div>
            <div className="space-y-1 p-4">
              <dt className="font-semibold">League standings</dt>
              <dd>Open the league’s <strong>Leaderboard</strong> and choose <strong>Standings</strong> to see your season points. The league may count only your best results. Use <strong>Scores</strong> for round results.</dd>
            </div>
            <div className="space-y-1 p-4">
              <dt className="font-semibold">Putting rating</dt>
              <dd>Eligible rated events can move your personal rating. Check it in the league’s <strong>Players</strong> tab.</dd>
            </div>
          </dl>
          <Link href="/leagues" className="inline-flex min-h-11 items-center rounded-xl bg-secondary px-4 py-2 font-semibold text-secondary-foreground hover:bg-[#ffe16a]">
            Browse leagues on the web
          </Link>
          <p className="text-sm">
            Sign in with your dgputt account to view leagues on the web. Register
            and enter scores in the app. <Link href="/guide#web-results" className="font-semibold underline underline-offset-4">See an example of web results.</Link>
          </p>
        </div>
        <figure className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#092b46] p-5 text-white">
          <ScreenshotPreview {...resultsScreenshot} className="rounded-2xl">
            <Image
              src={resultsScreenshot.src}
              alt={resultsScreenshot.alt}
              width={1320}
              height={2868}
              className="h-auto w-32 rounded-2xl"
            />
          </ScreenshotPreview>
          <figcaption className="text-center text-sm">Tap Table for the event results.</figcaption>
        </figure>
      </section>
    </div>
  );
}
