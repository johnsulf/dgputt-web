"use client";

import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  formatEventDate,
  formatLabel,
  playerModeLabel,
} from "@/lib/event-utils";
import Link from "next/link";
import { StormPuttEvent } from "./stormputt-event";
import { CornholeEvent } from "./cornhole-event";
import { StationsEvent } from "./stations-event";

interface EventViewProps {
  league: LeagueInstance;
  event: LeagueEvent;
}

function eventStatusBadge(event: LeagueEvent) {
  if (event.finished) {
    return (
      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
        Finished
      </Badge>
    );
  }
  if ((event.currentRound ?? 0) > 0) {
    return (
      <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">
        Ongoing &ndash; Round {event.currentRound}
        {event.rounds ? ` / ${event.rounds}` : ""}
      </Badge>
    );
  }
  return <Badge variant="outline">Not Started</Badge>;
}

export function EventView({ league, event }: EventViewProps) {
  const playerCount = event.players ? Object.keys(event.players).length : 0;
  const isStormPutt =
    event.format === "stormputt" || event.format === "stormputt18";
  const isCornhole = event.format === "cornhole";
  const isStations = event.format === "stations";

  // These formats have their own header and a wide layout, so on desktop
  // they break out of the site's max-width column.
  if (isCornhole || isStormPutt || isStations) {
    return (
      <div className="px-4 pt-7 pb-14 sm:px-8 lg:relative lg:left-1/2 lg:w-[min(1280px,100vw-2rem)] lg:-translate-x-1/2 lg:px-12">
        {isCornhole ? (
          <CornholeEvent league={league} event={event} />
        ) : isStormPutt ? (
          <StormPuttEvent league={league} event={event} />
        ) : (
          <StationsEvent league={league} event={event} />
        )}
      </div>
    );
  }

  return (
    <div className="p-4">
      <Link href={`/leagues/${league.id}`}>
        <Button variant="outline">Back to League</Button>
      </Link>

      {/* Header */}
      <div className="mt-4 rounded-3xl bg-secondary/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold">
            {event.title || "Untitled Event"}
          </h1>
        </div>

        {event.date && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatEventDate(event.date)}
          </p>
        )}

        {event.location && (
          <p className="text-sm text-muted-foreground">{event.location}</p>
        )}

        {event.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {eventStatusBadge(event)}
          {event.format && (
            <Badge variant="secondary">{formatLabel(event.format)}</Badge>
          )}
          {event.playerMode && event.playerMode !== "singles" && (
            <Badge variant="outline">{playerModeLabel(event.playerMode)}</Badge>
          )}
          {playerCount > 0 && (
            <Badge variant="outline">
              {playerCount} player{playerCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {event.rounds && (
            <Badge variant="outline">
              {event.rounds} round{event.rounds !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        <Alert>
          <AlertTitle>
            {formatLabel(event.format)} events are under construction
          </AlertTitle>
          <AlertDescription>
            Event view for {formatLabel(event.format) || "this format"} is
            currently being implemented. We appreciate your patience and look
            forward to sharing it with you soon!
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
