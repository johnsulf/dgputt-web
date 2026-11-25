import type {
  LeagueEvent,
  LeagueEventPlayer,
  LeagueInstance,
} from "@/app/interfaces/league";
import {
  pointsForPlace,
  shareCount,
  STANDARD_POINTS_SYSTEM,
} from "./points-system";
import { scoreFormatOf, type ScoreFormat } from "./league-scores-utils";
import {
  computeTotals as computeStormPuttTotals,
  groupPlayersForDoubles,
} from "./stormputt-utils";
import { computeStationsTotals, getStations } from "./stations-utils";
import {
  buildLeaderboardRows as buildCornholeRows,
  isFloatingTeams,
} from "./cornhole-utils";

export interface EventPlacement {
  eventId: string;
  eventTitle: string;
  format: string;
  place: number;
  /** After the same-night reduction. */
  points: number;
}

/** Share of points an extra event on the same night pays. */
const SAME_NIGHT_FACTOR = 0.5;

/**
 * Events of one format on one date are one night. A player's best result that
 * night pays in full and their other results at half, rounded up.
 */
function nightKey(event: LeagueEvent): string {
  const day = event.date?.slice(0, 10);
  return day
    ? `${day}|${scoreFormatOf(event) ?? event.format ?? ""}`
    : event.id;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  /** Points that count: the best N adjusted event results. */
  totalPoints: number;
  /** Adjusted points over every event, the tiebreak behind totalPoints. */
  allPoints: number;
  eventCount: number;
  wins: number;
  seconds: number;
  thirds: number;
  /** Share of putts made over the counted events, 0-1, or -1 with no putts. */
  hitPct: number;
  placements: EventPlacement[];
}

interface EventResult {
  place: number;
  name: string;
  hits: number;
  putts: number;
}

/** A player's own hits and putts over their finished rounds. */
function playerHitsPutts(
  player: LeagueEventPlayer,
  stationCount?: number,
): { hits: number; putts: number } {
  let hits = 0;
  let putts = 0;
  for (const round of player.rounds ?? []) {
    if (round.dns === true || round.dnf === true) continue;
    if (round.finished !== true) continue;
    if (stationCount != null) {
      const sum = (v?: number[]) =>
        (v ?? []).slice(0, stationCount).reduce((a, b) => a + b, 0);
      hits += sum(round.hitsPerSequence);
      putts += sum(round.puttsPerSequence);
    } else {
      hits += round.hits ?? 0;
      putts += round.putts ?? 0;
    }
  }
  return { hits, putts };
}

function isStormPutt(format?: string): boolean {
  return format === "stormputt" || format === "stormputt18";
}

/**
 * Extract player placements from a single event.
 * Returns a map of uid → { place, name, hits, putts } for each participant.
 * For doubles events, both team members get the team's placement.
 */
function getEventPlacements(event: LeagueEvent): Map<string, EventResult> {
  const result = new Map<string, EventResult>();
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
              ...playerHitsPutts(p),
            });
          }
        }
      } else {
        result.set(row.uid, {
          place: row.place,
          name: row.name,
          ...playerHitsPutts(players[row.uid] ?? {}),
        });
      }
    }
  } else if (event.format === "stations") {
    const stations = getStations(event);
    const rows = computeStationsTotals(
      isDoubles
        ? groupPlayersForDoubles(players, event.pairNames, event.pairDivisions)
        : players,
      stations,
    );
    for (const row of rows) {
      if (row.dns || row.dnf || row.place === 0) continue;
      if (isDoubles) {
        // row.uid is the pairId for grouped teams
        for (const [uid, p] of Object.entries(players)) {
          if ((p.pairId ?? uid) === row.uid) {
            result.set(uid, {
              place: row.place,
              name: p.displayName ?? p.name ?? "Unknown",
              ...playerHitsPutts(p, stations.length),
            });
          }
        }
      } else {
        result.set(row.uid, {
          place: row.place,
          name: row.name,
          ...playerHitsPutts(players[row.uid] ?? {}, stations.length),
        });
      }
    }
  } else if (event.format === "cornhole") {
    const rows = buildCornholeRows(event);
    // Floating teams are ranked per player, so their rows are already players.
    const teamRows = isDoubles && !isFloatingTeams(event);
    for (const row of rows) {
      if (row.basePosition === 0) continue;
      if (teamRows) {
        // Look up individual player UIDs sharing the team's pairId
        const teamId = row.participant.id;
        for (const [uid, p] of Object.entries(players)) {
          if ((p.pairId ?? uid) === teamId) {
            result.set(uid, {
              place: row.basePosition,
              name: p.displayName ?? p.name ?? "Unknown",
              hits: row.hits,
              putts: row.attempts,
            });
          }
        }
      } else {
        result.set(row.participant.id, {
          place: row.basePosition,
          name: row.participant.name,
          hits: row.hits,
          putts: row.attempts,
        });
      }
    }
  }

  return result;
}

type StandingsOpts = {
  seasonFilter?: string | null;
  formatFilter?: ScoreFormat | null;
};

/**
 * The finished events standings add up, by season and format. An event that
 * opts out of Overall gives no standings points anywhere.
 */
function standingsEvents(
  league: LeagueInstance,
  opts?: StandingsOpts,
): LeagueEvent[] {
  return (league.events ?? []).filter((e) => {
    if (!e.finished) return false;
    if (opts?.seasonFilter && e.seasonId !== opts.seasonFilter) return false;
    if (e.countsInAllFormats === false) return false;
    if (opts?.formatFilter && scoreFormatOf(e) !== opts.formatFilter)
      return false;
    return true;
  });
}

/**
 * How many events count in a player's total. The league's share applies to the
 * league as a whole; a format picked on purpose shows everything it has.
 * `counting` is null when every event counts.
 */
export function standingsCutoff(
  league: LeagueInstance,
  opts?: StandingsOpts,
): { counting: number | null; total: number } {
  const total = standingsEvents(league, opts).length;
  if (opts?.formatFilter) return { counting: null, total };
  const counting = shareCount(league.validRoundsShare ?? "twoThirds", total);
  return { counting: counting >= total ? null : counting, total };
}

/**
 * Build the league leaderboard from all finished events.
 * Optionally filters events by season and format. Each player's best `validRounds` results count, with a reduction
 * for extra events on the same night.
 */
export function buildLeagueLeaderboard(
  league: LeagueInstance,
  opts?: StandingsOpts,
): LeaderboardEntry[] {
  const relevantEvents = standingsEvents(league, opts);
  const system = league.pointsSystem ?? STANDARD_POINTS_SYSTEM;
  const { counting } = standingsCutoff(league, opts);

  // Accumulate placements per player across events
  const playerMap = new Map<
    string,
    {
      name: string;
      placements: (EventPlacement & { night: string })[];
      hits: number;
      putts: number;
    }
  >();

  for (const event of relevantEvents) {
    const placements = getEventPlacements(event);
    for (const [uid, { place, name, hits, putts }] of placements) {
      let entry = playerMap.get(uid);
      if (!entry) {
        entry = { name, placements: [], hits: 0, putts: 0 };
        playerMap.set(uid, entry);
      }
      // Keep the most recent name
      entry.name = name;
      entry.hits += hits;
      entry.putts += putts;
      entry.placements.push({
        eventId: event.id,
        eventTitle: event.title ?? "Untitled",
        format: event.format ?? "",
        place,
        points: pointsForPlace(system, place),
        night: nightKey(event),
      });
    }
  }

  // Build leaderboard entries
  const entries: LeaderboardEntry[] = [];
  for (const [uid, { name, placements, hits, putts }] of playerMap) {
    // Within a night the best result pays in full, the rest at half.
    const byNight = new Map<string, EventPlacement[]>();
    for (const p of placements) {
      byNight.set(p.night, [...(byNight.get(p.night) ?? []), p]);
    }
    for (const group of byNight.values()) {
      group.sort((a, b) => b.points - a.points);
      group.slice(1).forEach((p) => {
        p.points = Math.ceil(p.points * SAME_NIGHT_FACTOR);
      });
    }

    // Only the best N adjusted results count.
    const totalPoints = placements
      .map((p) => p.points)
      .sort((a, b) => b - a)
      .slice(0, counting ?? undefined)
      .reduce((sum, p) => sum + p, 0);
    const allPoints = placements.reduce((sum, p) => sum + p.points, 0);

    const wins = placements.filter((p) => p.place === 1).length;
    const seconds = placements.filter((p) => p.place === 2).length;
    const thirds = placements.filter((p) => p.place === 3).length;

    entries.push({
      uid,
      name,
      totalPoints,
      allPoints,
      eventCount: placements.length,
      wins,
      seconds,
      thirds,
      hitPct: putts > 0 ? hits / putts : -1,
      placements,
    });
  }

  // Sort by total points descending, then name
  entries.sort(
    (a, b) =>
      b.totalPoints - a.totalPoints ||
      b.allPoints - a.allPoints ||
      a.name.localeCompare(b.name),
  );

  return entries;
}
