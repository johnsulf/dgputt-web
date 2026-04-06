import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { computeTotals as computeStormPuttTotals } from "./stormputt-utils";
import { computeStationsTotals, getStations } from "./stations-utils";
import { buildLeaderboardRows as buildCornholeRows } from "./cornhole-utils";

function pointsForPlace(place: number, completed: boolean): number {
  if (!completed) return 0;
  switch (place) {
    case 1:
      return 12;
    case 2:
      return 10;
    case 3:
      return 8;
    case 4:
      return 6;
    case 5:
      return 5;
    case 6:
      return 4;
    case 7:
      return 3;
    default:
      return 2;
  }
}

export interface EventPlacement {
  eventId: string;
  eventTitle: string;
  format: string;
  place: number;
  points: number;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  totalPoints: number;
  validPoints: number;
  eventCount: number;
  placements: EventPlacement[];
}

function isStormPutt(format?: string): boolean {
  return format === "stormputt" || format === "stormputt18";
}

/**
 * Extract player placements from a single event.
 * Returns a map of uid → { place, name } for each participant.
 * For doubles events, both team members get the team's placement.
 */
function getEventPlacements(
  event: LeagueEvent,
): Map<string, { place: number; name: string }> {
  const result = new Map<string, { place: number; name: string }>();
  const players = event.players ?? {};
  const isDoubles = event.playerMode === "doubles";

  if (isStormPutt(event.format)) {
    const rows = computeStormPuttTotals(players, isDoubles);
    for (const row of rows) {
      if (row.dns || row.dnf || row.place === 0) continue;
      if (isDoubles) {
        // row.uid is the pairId for grouped teams
        const pairId = row.uid;
        for (const [uid, p] of Object.entries(players)) {
          if ((p.pairId ?? uid) === pairId) {
            result.set(uid, {
              place: row.place,
              name: p.displayName ?? p.name ?? "Unknown",
            });
          }
        }
      } else {
        result.set(row.uid, { place: row.place, name: row.name });
      }
    }
  } else if (event.format === "stations") {
    const stations = getStations(event);
    const rows = computeStationsTotals(players, stations);
    for (const row of rows) {
      if (row.dns || row.dnf || row.place === 0) continue;
      result.set(row.uid, { place: row.place, name: row.name });
    }
  } else if (event.format === "cornhole") {
    const rows = buildCornholeRows(event);
    for (const row of rows) {
      if (row.basePosition === 0) continue;
      if (isDoubles && row.participant.members.length > 0) {
        for (const memberUid of row.participant.members) {
          const memberPlayer = players[memberUid];
          result.set(memberUid, {
            place: row.basePosition,
            name: memberPlayer?.displayName ?? memberPlayer?.name ?? memberUid,
          });
        }
      } else {
        result.set(row.participant.id, {
          place: row.basePosition,
          name: row.participant.name,
        });
      }
    }
  }

  return result;
}

/**
 * Build the league leaderboard from all finished events.
 * Optionally filters events by format.
 * Uses `validRounds` to only count the top N scoring events per player.
 */
export function buildLeagueLeaderboard(
  league: LeagueInstance,
  opts?: { seasonFilter?: string | null; formatFilter?: string | null },
): LeaderboardEntry[] {
  const events = league.events ?? [];
  const validRounds = league.validRounds ?? 10;

  // Only include finished events, optionally filtered by season and format
  const relevantEvents = events.filter((e) => {
    if (!e.finished) return false;
    if (opts?.seasonFilter && e.seasonId !== opts.seasonFilter) return false;
    if (opts?.formatFilter && e.format !== opts.formatFilter) {
      // Handle stormputt18 grouped under stormputt filter
      if (opts.formatFilter === "stormputt" && e.format === "stormputt18")
        return true;
      if (opts.formatFilter === "stormputt18" && e.format === "stormputt")
        return true;
      return false;
    }
    return true;
  });

  // Accumulate placements per player across events
  const playerMap = new Map<
    string,
    { name: string; placements: EventPlacement[] }
  >();

  for (const event of relevantEvents) {
    const placements = getEventPlacements(event);
    for (const [uid, { place, name }] of placements) {
      let entry = playerMap.get(uid);
      if (!entry) {
        entry = { name, placements: [] };
        playerMap.set(uid, entry);
      }
      // Keep the most recent name
      entry.name = name;
      entry.placements.push({
        eventId: event.id,
        eventTitle: event.title ?? "Untitled",
        format: event.format ?? "",
        place,
        points: pointsForPlace(place, true),
      });
    }
  }

  // Build leaderboard entries
  const entries: LeaderboardEntry[] = [];
  for (const [uid, { name, placements }] of playerMap) {
    const totalPoints = placements.reduce((sum, p) => sum + p.points, 0);

    // Valid points: sum of top N event scores
    const sortedPoints = placements.map((p) => p.points).sort((a, b) => b - a);
    const validPoints = sortedPoints
      .slice(0, validRounds)
      .reduce((sum, p) => sum + p, 0);

    entries.push({
      uid,
      name,
      totalPoints,
      validPoints,
      eventCount: placements.length,
      placements,
    });
  }

  // Sort by valid points descending, then total points, then name
  entries.sort(
    (a, b) =>
      b.validPoints - a.validPoints ||
      b.totalPoints - a.totalPoints ||
      a.name.localeCompare(b.name),
  );

  return entries;
}

/** Get the unique event formats that have finished events. */
export function getFinishedFormats(
  league: LeagueInstance,
  seasonFilter?: string | null,
): string[] {
  const events = league.events ?? [];
  const formats = new Set<string>();
  for (const e of events) {
    if (!e.finished) continue;
    if (seasonFilter && e.seasonId !== seasonFilter) continue;
    if (e.format) formats.add(e.format);
  }
  return Array.from(formats).sort();
}
