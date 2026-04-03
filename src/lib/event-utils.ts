import type { LeagueEvent } from "@/app/interfaces/league";

export interface CategorizedEvents {
  nextEvent: LeagueEvent | null;
  ongoingEvents: LeagueEvent[];
  upcomingEvents: LeagueEvent[];
  finishedEvents: LeagueEvent[];
  incompleteEvents: LeagueEvent[];
  pastSeasonEvents: LeagueEvent[];
}

/**
 * Categorize and sort league events into buckets, mirroring Flutter logic.
 */
export function categorizeEvents(
  events: LeagueEvent[],
  activeSeasonId?: string,
): CategorizedEvents {
  const sorted = [...events].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const finished: LeagueEvent[] = [];
  const ongoing: LeagueEvent[] = [];
  const upcoming: LeagueEvent[] = [];
  const incomplete: LeagueEvent[] = [];
  const pastSeason: LeagueEvent[] = [];

  for (const event of sorted) {
    // Partition past-season events first
    if (
      activeSeasonId &&
      event.seasonId &&
      event.seasonId !== activeSeasonId
    ) {
      pastSeason.push(event);
      continue;
    }

    if (event.finished) {
      finished.push(event);
    } else if ((event.currentRound ?? 0) > 0) {
      ongoing.push(event);
    } else {
      // Check if date is in the past
      if (event.date) {
        const eventDate = new Date(event.date);
        const eventDay = new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
        );
        if (eventDay < today) {
          incomplete.push(event);
          continue;
        }
      }
      upcoming.push(event);
    }
  }

  // Promote first upcoming to "next event" if no ongoing events
  let nextEvent: LeagueEvent | null = null;
  if (ongoing.length === 0 && upcoming.length > 0) {
    nextEvent = upcoming.shift()!;
  }

  return {
    nextEvent,
    ongoingEvents: ongoing,
    upcomingEvents: upcoming,
    finishedEvents: finished,
    incompleteEvents: incomplete,
    pastSeasonEvents: pastSeason,
  };
}

/**
 * Format event date string for display.
 */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Human-friendly format label.
 */
export function formatLabel(format?: string): string {
  switch (format) {
    case "stormputt":
      return "StormPutt";
    case "stations":
      return "Stations";
    case "cornhole":
      return "Cornhole";
    default:
      return format ?? "";
  }
}

/**
 * Human-friendly player mode label.
 */
export function playerModeLabel(mode?: string): string {
  switch (mode) {
    case "doubles":
      return "Doubles";
    case "singles":
      return "Singles";
    default:
      return "";
  }
}
