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

export default function GuidePage() {
  return (
    <div className="px-4 py-8 sm:px-16 space-y-16">
      {/* Hero */}
      <section className="space-y-4 max-w-3xl">
        <h1>League Admin Guide</h1>
        <p className="text-lg">
          Everything you need to know about creating and running leagues and
          events in dgputt. League features require a premium subscription.
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
                Flexible scheduling — can be played online or in-person. Players
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
                events — use league templates, global templates, or personal
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
                2026"). Set the active season — leaderboards can be filtered by
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
                count, and weights. Save layouts as templates for reuse — you
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
                for byes. Manage players — edit, remove, check-in/out, and
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
                leaderboard — a full-screen, real-time display designed for TVs
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
          permanently removes it and all its data — a confirmation is required.
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
                face each other as the event progresses — keeps competition
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
    </div>
  );
}
