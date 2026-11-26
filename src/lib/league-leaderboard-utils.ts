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
  points: number;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  position: number;
  /** Points from the best N event results. */
  totalPoints: number;
  /** Points over every event before the league's cutoff. */
  allPoints: number;
  eventCount: number;
  wins: number;
  seconds: number;
  thirds: number;
  /** Share of putts made across all qualifying events, 0–1, or -1 with no putts. */
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

function standingsEvents(
  league: LeagueInstance,
  opts?: StandingsOpts,
): LeagueEvent[] {
  return (league.events ?? []).filter((e) => {
    if (!e.finished) return false;
    if (opts?.seasonFilter && e.seasonId !== opts.seasonFilter) return false;
    return opts?.formatFilter
      ? scoreFormatOf(e) === opts.formatFilter
      : e.countsInAllFormats !== false;
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
 * Build the league leaderboard from finished events, optionally filtered by season and format.
 * The league's counting share determines how many results count in the combined standings.
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
      placements: EventPlacement[];
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
      });
    }
  }

  // Build leaderboard entries
  type UnrankedEntry = Omit<LeaderboardEntry, "position">;
  const entries: UnrankedEntry[] = [];
  for (const [uid, { name, placements, hits, putts }] of playerMap) {
    const allPoints = placements.reduce((sum, p) => sum + p.points, 0);
    const totalPoints =
      counting == null
        ? allPoints
        : placements
            .map((p) => p.points)
            .sort((a, b) => b - a)
            .slice(0, counting)
            .reduce((sum, points) => sum + points, 0);

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

  const compareRank = (a: UnrankedEntry, b: UnrankedEntry) =>
    b.totalPoints - a.totalPoints || b.hitPct - a.hitPct;
  entries.sort(
    (a, b) => compareRank(a, b) || a.name.localeCompare(b.name),
  );

  let position = 0;
  return entries.map((entry, index) => {
    if (index === 0 || compareRank(entries[index - 1], entry) !== 0) {
      position = index + 1;
    }
    return { ...entry, position };
  });
}
