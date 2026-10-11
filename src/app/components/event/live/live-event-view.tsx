"use client";

import type { LeagueEvent } from "@/app/interfaces/league";
import { LiveStormPuttBoard } from "./live-stormputt";
import { LiveCornholeBoard } from "./live-cornhole";
import { LiveStationsBoard } from "./live-stations";

interface LiveEventViewProps {
  event: LeagueEvent;
  /** Not shown on the boards; kept so callers don't need to change. */
  leagueTitle?: string;
}

/** Full-screen TV board for the event's format. */
export function LiveEventView({ event }: LiveEventViewProps) {
  switch (event.format) {
    case "cornhole":
      return <LiveCornholeBoard event={event} />;
    case "stormputt":
    case "stormputt18":
      return <LiveStormPuttBoard event={event} />;
    case "stations":
      return <LiveStationsBoard event={event} />;
    default:
      return (
        <div className="flex h-dvh items-center justify-center bg-[#121212] text-[#8B8B8B]">
          Live view is not available for this event format.
        </div>
      );
  }
}
