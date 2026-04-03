"use client";

import type { LeagueInstance } from "@/app/interfaces/league";
import { categorizeEvents } from "@/lib/event-utils";
import { EventCard } from "./event-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EventsTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

export function EventsTab({ league, seasonFilter }: EventsTabProps) {
  const events = league.events ?? [];

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">No events yet.</p>
      </div>
    );
  }

  // When a specific season is selected, filter events to only that season
  const filteredEvents = seasonFilter
    ? events.filter((e) => e.seasonId === seasonFilter)
    : events;

  const {
    nextEvent,
    ongoingEvents,
    upcomingEvents,
    finishedEvents,
    incompleteEvents,
    pastSeasonEvents,
  } = categorizeEvents(
    filteredEvents,
    seasonFilter ? undefined : league.activeSeasonId,
  );

  const hasAny =
    nextEvent ||
    ongoingEvents.length > 0 ||
    upcomingEvents.length > 0 ||
    finishedEvents.length > 0 ||
    incompleteEvents.length > 0 ||
    pastSeasonEvents.length > 0;

  if (!hasAny) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          No events found for this season.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Next Event */}
      {nextEvent && ongoingEvents.length === 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold">Next Event</h3>
          <EventCard event={nextEvent} variant="highlight" />
        </section>
      )}

      {/* Ongoing */}
      {ongoingEvents.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold">
            {ongoingEvents.length === 1 ? "Ongoing Event" : "Ongoing Events"}
          </h3>
          <div className="flex flex-col gap-2">
            {ongoingEvents.map((event) => (
              <EventCard key={event.id} event={event} variant="ongoing" />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingEvents.length > 0 && (
        <Accordion>
          <AccordionItem value="upcoming">
            <AccordionTrigger>
              <h3 className="text-sm font-bold">
                Upcoming Events ({upcomingEvents.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Finished */}
      {finishedEvents.length > 0 && (
        <Accordion>
          <AccordionItem value="finished">
            <AccordionTrigger>
              <h3 className="text-sm font-bold">
                Finished Events ({finishedEvents.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {[...finishedEvents].reverse().map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Incomplete */}
      {incompleteEvents.length > 0 && (
        <Accordion>
          <AccordionItem value="incomplete">
            <AccordionTrigger>
              <h3 className="text-sm font-bold">
                Incomplete Events ({incompleteEvents.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {incompleteEvents.map((event) => (
                  <EventCard key={event.id} event={event} variant="incomplete" />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Past Seasons */}
      {pastSeasonEvents.length > 0 && !seasonFilter && (
        <Accordion>
          <AccordionItem value="past-seasons">
            <AccordionTrigger>
              <h3 className="text-sm font-bold">
                Past Seasons ({pastSeasonEvents.length})
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {pastSeasonEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
