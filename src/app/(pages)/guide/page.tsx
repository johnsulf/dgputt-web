import type { Metadata } from "next";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata: Metadata = {
  title: "League Admin Guide - dgputt",
  description:
    "Step-by-step guide for running dgputt leagues and events. Event types, formats, pairing systems, and tournament director tools.",
};

export default function GuidePage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-16">
      {/* Hero */}
      <section className="space-y-4 max-w-3xl">
        <h1>League Admin Guide</h1>
        <p className="text-lg">
          Everything you need to know about creating and running leagues and
          events in dgputt - from the mobile app to the web.
        </p>
        <div className="flex gap-3">
          <a
            href="#app"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            dgputt App
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="#web"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            dgputt Web
          </a>
        </div>
      </section>

      {/* ── dgputt App ── */}
      <section id="app" className="space-y-4 max-w-3xl">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl">dgputt App</h2>
          <Badge variant="secondary">Mobile</Badge>
        </div>
        <p className="text-muted-foreground">
          League management, event creation, scoring, and administration are all
          handled in the dgputt mobile app. League features require a premium
          subscription.
        </p>
      </section>

      {/* Event Types & Formats */}
      <section className="space-y-4 max-w-3xl">
        <h2>Event Types</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Classic</AccordionTrigger>
            <AccordionContent>
              <p>
                Standard tournament with groups at an organized location.
                Players compete in structured rounds at the same time and place.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Flex</AccordionTrigger>
            <AccordionContent>
              <p>
                Flexible scheduling - can be played online or in-person. Players
                complete rounds on their own time. No check-in required.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Team</AccordionTrigger>
            <AccordionContent>
              <p>
                Doubles or team-based competition. Players pair up and compete
                as teams with custom or randomly generated pairings.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Bracket</AccordionTrigger>
            <AccordionContent>
              <p>
                Single or double elimination tournament. Head-to-head matches
                with bracket progression. Requires player check-in and supports
                optional seeding.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2>Event Formats</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>StormPutt</AccordionTrigger>
            <AccordionContent>
              <p>
                The standard dgputt format. 18 or 36 putts (3 or 6 per station
                across 6 stations). Lowest score wins. The most popular format
                for league events.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Cornhole</AccordionTrigger>
            <AccordionContent>
              <p>
                Head-to-head match play with configurable target points,
                win-by-2, and max sets. Supports Swiss pairing (matched by
                standings) or round-robin (fixed schedule) pairing systems.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Stations</AccordionTrigger>
            <AccordionContent>
              <p>
                Fully customizable format. Set distance, putt count, weights,
                and tags per station. Save layouts as templates for reuse across
                events - use league templates, global templates, or personal
                ones.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Creating a League */}
      <section className="space-y-4 max-w-3xl">
        <h2>Creating a League</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Basic setup</AccordionTrigger>
            <AccordionContent>
              <p>
                Go to <strong>Compete → Create League</strong> in the app. Fill
                in the league title (required), location (auto-detected or
                manual), an optional logo, an optional PIN to restrict who can
                join, and a contact email.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Seasons</AccordionTrigger>
            <AccordionContent>
              <p>
                Enable seasons to organize events by time period (e.g. "Spring
                2026"). Set the active season - leaderboards can be filtered by
                season so you can crown a champion at the end of each one.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Divisions</AccordionTrigger>
            <AccordionContent>
              <p>
                Define division codes (max 4 characters, e.g. MPO, FPO, MA40).
                Players select their division when registering for events.
                Leaderboards and standings can be filtered by division.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Valid rounds</AccordionTrigger>
            <AccordionContent>
              <p>
                Set how many of a player&apos;s best rounds count toward
                leaderboard standings (e.g. top 10 of 12). This allows players
                to drop their worst results over the course of a season.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Creating an Event */}
      <section className="space-y-4 max-w-3xl">
        <h2>Creating an Event</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Event basics</AccordionTrigger>
            <AccordionContent>
              <p>
                Open your league and tap <strong>Create Event</strong>. Fill in
                the title, description, date/time, and location. Select the
                event type (Classic, Flex, Team, or Bracket) and the format
                (StormPutt, Cornhole, or Stations). Choose player mode (Singles
                or Doubles).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Groups &amp; registration</AccordionTrigger>
            <AccordionContent>
              <p>
                Enable or disable groups and set min/max group size. Optionally
                set a registration limit (player cap). For bracket events,
                check-in is required. Assign the event to a division and season.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Cornhole-specific settings</AccordionTrigger>
            <AccordionContent>
              <p>
                Configure the target points to win (default: 11), toggle
                win-by-2, and set an optional max sets limit. Pairing can be
                Swiss (matched by standings) or round robin (fixed schedule).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Stations format</AccordionTrigger>
            <AccordionContent>
              <p>
                Create custom station layouts with per-station distance, putt
                count, and weights. Save layouts as templates for reuse - you
                can use league templates, global templates, or personal
                templates.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Running an Event */}
      <section className="space-y-4 max-w-3xl">
        <h2>Running an Event</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Registration management</AccordionTrigger>
            <AccordionContent>
              <p>
                Open and close registration at any time. Search for dgputt users
                and add them directly. Copy player rosters from previous events
                with optional filtering by top N in standings. Add dummy players
                for byes. Manage players - edit, remove, check-in/out, and
                reassign divisions.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Round management</AccordionTrigger>
            <AccordionContent>
              <p>
                Start a round (validates that groups are ready), pause and
                resume rounds as needed, create additional rounds, finish
                rounds, or delete unpopulated rounds. Each round tracks scoring
                independently.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Score management</AccordionTrigger>
            <AccordionContent>
              <p>
                Manually edit any player&apos;s score per round. Mark players as
                DNF (Did Not Finish) or DNS (Did Not Start). Save and finalize
                rounds when scoring is complete.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Doubles &amp; team management</AccordionTrigger>
            <AccordionContent>
              <p>
                For team events, assign pairs manually with custom team names,
                or use the random pairing feature to auto-generate teams.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Bracket management</AccordionTrigger>
            <AccordionContent>
              <p>
                Generate the initial bracket from checked-in players with
                optional seeding. Edit match results manually. Winners
                automatically advance through bracket stages. Navigate through
                rounds to see tournament progression.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Communication</AccordionTrigger>
            <AccordionContent>
              <p>
                Broadcast announcements to all event participants directly from
                the event management screen. Players also have access to an
                event chat.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Live leaderboard</AccordionTrigger>
            <AccordionContent>
              <p>
                During an ongoing event, league admins can open the live
                leaderboard - a full-screen, real-time display designed for TVs
                and projectors. It includes dark/light theme, adjustable table
                density, and an auto-rotate feature that cycles between totals
                and current round views every 15 seconds.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Leaderboards */}
      <section className="space-y-4 max-w-3xl">
        <h2>Leaderboards</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Scores View</CardTitle>
              <CardDescription>
                Players ranked by best round scores. Respects the &quot;valid
                rounds&quot; setting so only each player&apos;s best results
                count.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Standings View</CardTitle>
              <CardDescription>
                Cumulative points and wins across events in a season. Filter by
                division, season, or format.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <p>
          Player detail views show PDGA numbers, country, per-round scores with
          best/worst highlighting. Admins can export leaderboards as PDF for
          printing.
        </p>
      </section>

      {/* Event Lifecycle */}
      <section className="space-y-4 max-w-3xl">
        <h2>Event Lifecycle</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Create",
            "Open registration",
            "Start rounds",
            "Score & manage",
            "Finish event",
          ].map((step, i) => (
            <Badge key={step} variant="outline" className="text-sm px-3 py-1">
              {i + 1}. {step}
            </Badge>
          ))}
        </div>
        <p>
          Events can be edited at any time (format is locked once scoring
          begins). Finished events can be reopened if needed. Deleting an event
          permanently removes it and all its data - a confirmation is required.
        </p>
      </section>

      {/* Pairing Systems */}
      <section className="space-y-4 max-w-3xl">
        <h2>Pairing Systems</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Swiss Pairing</CardTitle>
              <CardDescription>
                Players are paired based on current standings. Top performers
                face each other as the event progresses - keeps competition
                close and fair at every level.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Round Robin</CardTitle>
              <CardDescription>
                A fixed schedule where every player faces a set number of
                opponents across rounds. Ensures everyone gets the same number
                of matches.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* ── dgputt Web ── */}
      <section id="web" className="space-y-4 max-w-3xl pt-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl">dgputt Web</h2>
          <Badge variant="secondary">This site</Badge>
        </div>
        <p className="text-muted-foreground">
          The dgputt website lets you browse leagues, view event results and
          leaderboards, and follow live events. Accessing leagues requires
          logging in with a dgputt account - to create one, download the dgputt
          app and register first.
        </p>
      </section>

      {/* Browsing Leagues */}
      <section className="space-y-4 max-w-3xl">
        <h2>Browsing Leagues</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Finding leagues</AccordionTrigger>
            <AccordionContent>
              <p>
                The{" "}
                <Link
                  href="/leagues"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Leagues
                </Link>{" "}
                page shows all leagues you have access to. Use the search bar to
                filter by name. Switch between tabs to view your favourite
                leagues, featured leagues, or all available leagues.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>League detail page</AccordionTrigger>
            <AccordionContent>
              <p>
                Each league has its own page with the league name, location,
                season info, and contact details. Use the{" "}
                <strong>Events</strong> and <strong>Leaderboard</strong> tabs to
                navigate between event listings and overall standings.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Season filter</AccordionTrigger>
            <AccordionContent>
              <p>
                Leagues with seasons enabled show a season selector. Switching
                seasons filters both the event list and the leaderboard to only
                show data from that season.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Event Views */}
      <section className="space-y-4 max-w-3xl">
        <h2>Event Results</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>StormPutt &amp; StormPutt 18</AccordionTrigger>
            <AccordionContent>
              <p>
                Event pages show a leaderboard with per-distance hit counts, hit
                percentages, and total score. Multi-round events have tabs to
                switch between the overall leaderboard and individual rounds. A
                &quot;Thru&quot; column shows how many rounds each player has
                completed.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Cornhole</AccordionTrigger>
            <AccordionContent>
              <p>
                Cornhole events display a sortable leaderboard with wins, hit
                percentage, and strength of schedule. Below the leaderboard,
                individual match results are shown per round with scores and
                sequence details.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Stations</AccordionTrigger>
            <AccordionContent>
              <p>
                Stations events show per-station hit counts, hit percentages,
                and weighted scores. Station headers display the station
                distance and weight when applicable.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Divisions &amp; doubles</AccordionTrigger>
            <AccordionContent>
              <p>
                All event views support division filtering - tap a division
                badge to show only players in that division. Doubles events
                automatically group team members and display team names.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>PDGA links</AccordionTrigger>
            <AccordionContent>
              <p>
                Players with a PDGA number show a badge next to their name that
                links directly to their PDGA player profile.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* League Leaderboard */}
      <section className="space-y-4 max-w-3xl">
        <h2>League Leaderboard</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Points system</AccordionTrigger>
            <AccordionContent>
              <p>
                The league leaderboard ranks players by points earned across all
                finished events. Points are awarded based on placement:
                1st&nbsp;=&nbsp;12, 2nd&nbsp;=&nbsp;10, 3rd&nbsp;=&nbsp;8,
                4th&nbsp;=&nbsp;6, 5th&nbsp;=&nbsp;5, 6th&nbsp;=&nbsp;4,
                7th&nbsp;=&nbsp;3, and 8th or lower&nbsp;=&nbsp;2 points.
                Players who don&apos;t complete an event receive 0 points.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Valid rounds</AccordionTrigger>
            <AccordionContent>
              <p>
                Leagues can limit how many event scores count (e.g. best 6 of
                10). When a player has played more events than the valid rounds
                limit, only their top scores count. The leaderboard shows an
                info badge with the counting rule.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Format filter</AccordionTrigger>
            <AccordionContent>
              <p>
                When a league has events in multiple formats, a dropdown lets
                you filter the leaderboard by format (e.g. show only StormPutt
                results or only Cornhole results).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Doubles</AccordionTrigger>
            <AccordionContent>
              <p>
                In doubles events, both team members receive points based on
                their team&apos;s placement. These points count toward each
                player&apos;s individual league leaderboard total.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Live View */}
      <section className="space-y-4 max-w-3xl">
        <h2>Live Event View</h2>
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Real-time updates</AccordionTrigger>
            <AccordionContent>
              <p>
                Ongoing events have a <strong>Live</strong> button that opens a
                full-screen, real-time leaderboard. Scores update automatically
                as players submit results - positions animate smoothly as the
                rankings change.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem>
            <AccordionTrigger>Display settings</AccordionTrigger>
            <AccordionContent>
              <p>
                The live view is designed for TVs and projectors. Use the
                settings menu to toggle between dark and light themes, adjust
                table density (small, medium, large), and select which round to
                display or show totals.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
