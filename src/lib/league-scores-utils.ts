import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { groupPlayersForDoubles, teamMembersById } from "./stormputt-utils";
import { getStations } from "./stations-utils";
import { buildLeaderboardRows, isFloatingTeams } from "./cornhole-utils";
import { DEFAULT_SHARE, shareCount } from "./points-system";

export type ScoreBase = "cornhole" | "stormputt" | "stations";

/** "cornhole", "stormputt:doubles", ... Doubles are their own format. */
export type ScoreFormat = ScoreBase | `${ScoreBase}:doubles`;

const BASE_ORDER: ScoreBase[] = ["cornhole", "stormputt", "stations"];

const BASE_LABEL: Record<ScoreBase, string> = {
  cornhole: "Cornhole",
  stormputt: "StormPutt",
  stations: "Stations",
};

export function scoreFormatLabel(format: ScoreFormat): string {
  const [base, doubles] = format.split(":") as [ScoreBase, string?];
  return doubles ? `${BASE_LABEL[base]} Doubles` : BASE_LABEL[base];
}

export function isCornholeScore(format: ScoreFormat): boolean {
  return format.split(":")[0] === "cornhole";
}

function scoreBase(event: LeagueEvent): ScoreBase | null {
  switch (event.format) {
    case "cornhole":
      return "cornhole";
    case "stormputt":
    case "stormputt18":
      return "stormputt";
    case "stations":
      return "stations";
    default:
      return null;
  }
}

export function scoreFormatOf(event: LeagueEvent): ScoreFormat | null {
  const base = scoreBase(event);
  if (!base) return null;
  return event.playerMode === "doubles" ? `${base}:doubles` : base;
}

function finishedEvents(
  league: LeagueInstance,
  seasonFilter?: string | null,
): LeagueEvent[] {
  return (league.events ?? []).filter(
    (e) => e.finished && (!seasonFilter || e.seasonId === seasonFilter),
  );
}

/** The score formats that have finished events, in display order. */
export function getScoreFormats(
  league: LeagueInstance,
  seasonFilter?: string | null,
): ScoreFormat[] {
  const present = new Set<ScoreFormat>();
  for (const event of finishedEvents(league, seasonFilter)) {
    const format = scoreFormatOf(event);
    if (format) present.add(format);
  }
  return [
    ...BASE_ORDER,
    ...BASE_ORDER.map((b) => `${b}:doubles` as ScoreFormat),
  ].filter((f) => present.has(f));
}

export function getAvailableScoreFormat(
  formats: ScoreFormat[],
  picked: ScoreFormat | null,
): ScoreFormat | undefined {
  return picked && formats.includes(picked) ? picked : undefined;
}

/**
 * Pair IDs are specific to an event. Only a known roster can identify a team
 * across events.
 */
function teamScoreKey(
  eventId: string,
  teamId: string,
  memberUids: string[],
): string {
  return memberUids.length >= 2
    ? `team:${JSON.stringify([...memberUids].sort())}`
    : `event-team:${JSON.stringify([eventId, teamId])}`;
}

export interface CornholeScoreRow {
  key: string;
  name: string;
  played: number;
  won: number;
  lost: number;
  hits: number;
  attempts: number;
  /** 0-1, or -1 when no bags were thrown. */
  hitPct: number;
}

/** Cornhole: ranked on matches won, then hit percentage. */
export function buildCornholeScores(
  league: LeagueInstance,
  format: ScoreFormat,
  seasonFilter?: string | null,
): CornholeScoreRow[] {
  const map = new Map<string, CornholeScoreRow>();

  for (const event of finishedEvents(league, seasonFilter)) {
    if (scoreFormatOf(event) !== format) continue;
    const isTeam = event.playerMode === "doubles" && !isFloatingTeams(event);

    for (const row of buildLeaderboardRows(event)) {
      const { id, name, memberUids } = row.participant;
      const key = isTeam ? teamScoreKey(event.id, id, memberUids) : id;
      let entry = map.get(key);
      if (!entry) {
        entry = {
          key,
          name,
          played: 0,
          won: 0,
          lost: 0,
          hits: 0,
          attempts: 0,
          hitPct: -1,
        };
        map.set(key, entry);
      }
      entry.name = name;
      entry.played += row.matchesPlayed;
      entry.won += row.matchesWon;
      entry.lost += row.matchesLost;
      entry.hits += row.hits;
      entry.attempts += row.attempts;
    }
  }

  const rows = [...map.values()].filter((r) => r.played > 0);
  for (const r of rows) {
    r.hitPct = r.attempts > 0 ? r.hits / r.attempts : -1;
  }
  return rows.sort(
    (a, b) =>
      b.won - a.won || b.hitPct - a.hitPct || a.name.localeCompare(b.name),
  );
}

export interface RoundScoreRow {
  key: string;
  name: string;
  rounds: number;
  /** Hits over all rounds. */
  hits: number;
  putts: number;
  /** 0-100. */
  hitPct: number;
  /** Hits in the best N rounds, which the ranking uses. */
  bestHits: number;
}

interface RoundScores {
  rows: RoundScoreRow[];
  counting: number | null;
  total: number;
}

/** Rank StormPutt and Stations by hits in the rounds that count. */
export function buildRoundScores(
  league: LeagueInstance,
  format: ScoreFormat,
  {
    seasonFilter,
    formatSelected = false,
  }: {
    seasonFilter?: string | null;
    formatSelected?: boolean;
  } = {},
): RoundScores {
  let total = 0;
  const map = new Map<
    string,
    { name: string; hits: number[]; putts: number }
  >();

  for (const event of finishedEvents(league, seasonFilter)) {
    if (scoreFormatOf(event) !== format || !event.players) continue;
    const isDoubles = event.playerMode === "doubles";
    const isStations = event.format === "stations";
    const numStations = isStations ? getStations(event).length : 0;
    const raw = event.players;
    total +=
      event.rounds && event.rounds > 0
        ? event.rounds
        : Object.values(raw).reduce(
            (rounds, player) => Math.max(rounds, player.rounds?.length ?? 0),
            0,
          );
    const players = isDoubles
      ? groupPlayersForDoubles(raw, event.pairNames, event.pairDivisions)
      : raw;
    const membersByTeam = isDoubles ? teamMembersById(raw) : undefined;

    for (const [uid, player] of Object.entries(players)) {
      const name = player.displayName ?? player.name ?? "Unknown";
      const key = isDoubles
        ? teamScoreKey(
            event.id,
            uid,
            membersByTeam?.get(uid)?.map((member) => member.uid) ?? [],
          )
        : uid;
      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        if (round.finished !== true) continue;
        const hits = isStations
          ? (round.hitsPerSequence ?? [])
              .slice(0, numStations)
              .reduce((a, b) => a + b, 0)
          : (round.hits ?? 0);
        const putts = isStations
          ? (round.puttsPerSequence ?? [])
              .slice(0, numStations)
              .reduce((a, b) => a + b, 0)
          : (round.putts ?? 0);

        let entry = map.get(key);
        if (!entry) {
          entry = { name, hits: [], putts: 0 };
          map.set(key, entry);
        }
        entry.name = name;
        entry.hits.push(hits);
        entry.putts += putts;
      }
    }
  }

  const share = shareCount(league.validRoundsShare ?? DEFAULT_SHARE, total);
  const counting = formatSelected || share >= total ? null : share;
  const rows: RoundScoreRow[] = [];
  for (const [key, { name, hits, putts }] of map) {
    const totalHits = hits.reduce((a, b) => a + b, 0);
    const bestHits =
      counting == null
        ? totalHits
        : hits
            .sort((a, b) => b - a)
            .slice(0, counting)
            .reduce((sum, roundHits) => sum + roundHits, 0);
    rows.push({
      key,
      name,
      rounds: hits.length,
      hits: totalHits,
      putts,
      hitPct: putts > 0 ? (totalHits / putts) * 100 : 0,
      bestHits,
    });
  }
  rows.sort(
    (a, b) =>
      b.bestHits - a.bestHits ||
      b.hitPct - a.hitPct ||
      a.name.localeCompare(b.name),
  );
  return { rows, counting, total };
}
