import type { LeagueEvent, LeagueEventPlayer } from "@/app/interfaces/league";
import type { RoundStats } from "@/lib/cornhole-live";
import {
  computeStationsTotals,
  getDistanceUnit,
  getStationDistance,
  getStations,
} from "@/lib/stations-utils";
import {
  groupPlayersForDoubles,
  teamMembersById,
  type TeamMember,
} from "@/lib/stormputt-utils";
import { activeIndex, roundGroup } from "@/lib/live-progress";
import { convertDistance, type DistanceUnit } from "@/lib/view-settings";

// Derived view state shared by the Stations event page and the TV board.

export type StationRoundStatus = "putting" | "finished" | "not-started" | "dns";

export interface StationInfo {
  /** "S1", "S2", ... */
  number: string;
  /** Station description from the event setup, e.g. "Straddle". */
  description: string;
  distance: string | null;
  putts: number;
  points: number;
}

export interface StationCell {
  state: "done" | "current" | "todo" | "dns";
  hits: number;
  putts: number;
}

export interface StationRoundProgress {
  status: StationRoundStatus;
  /** Station being putted now, or -1 when not putting. */
  currentStation: number;
  cells: StationCell[];
  /** Round points: hits x station points. */
  roundPoints: number;
  /** Group number this round, when the round is grouped. */
  group?: number;
}

/** One player of a doubles team. */
export interface StationsMemberView {
  name: string;
  hitLabel: string;
  round: StationRoundProgress;
}

export interface StationsStandingRow {
  id: string;
  position: number;
  name: string;
  pdgaNumber?: string;
  division?: string;
  hitLabel: string;
  score: number;
  /** Places gained (positive) or lost (negative) this round. */
  movement: number;
  /** Event hit rate per station (0-1), or null with no putts there yet. */
  stationRates: (number | null)[];
  /** Event hits and putts per station. */
  stationHits: number[];
  stationPutts: number[];
  /** Current-round progress for this player. */
  round: StationRoundProgress;
  /** The two players of a doubles team; `round` and `score` are combined. */
  members?: StationsMemberView[];
}

export interface StationsLiveState {
  stations: StationInfo[];
  roundCount: number;
  /** Latest round that exists, or -1 before any round. */
  currentRoundIndex: number;
  isLive: boolean;
  /** Finished / putting counts; the total leaves out players who are DNS. */
  roundStats: RoundStats;
  standings: StationsStandingRow[];
  /** Players in stable (registration) order, for the round view. */
  participants: [string, LeagueEventPlayer][];
  /** Doubles teams' individual players, keyed by team id. */
  teams: Map<string, TeamMember[]>;
}

export function stationInfo(
  event: LeagueEvent,
  displayUnit?: DistanceUnit,
): StationInfo[] {
  const unit = getDistanceUnit(event);
  return getStations(event).map((s, i) => {
    const distance = getStationDistance(s, unit);
    return {
      number: `S${i + 1}`,
      description: s.labelOverride?.trim() || `Station ${i + 1}`,
      distance:
        distance && displayUnit
          ? convertDistance(distance, displayUnit)
          : distance,
      putts: s.putts,
      points: s.weight,
    };
  });
}

/** `points` holds each station's points per hit, one entry per station. */
export function stationRoundProgress(
  player: LeagueEventPlayer,
  roundIndex: number,
  points: number[],
): StationRoundProgress {
  const n = points.length;
  const round = player.rounds?.[roundIndex];
  const hps = round?.hitsPerSequence ?? [];
  const pps = round?.puttsPerSequence ?? [];

  // New rounds are created with zero-filled lists, so a station counts as
  // done once putts are logged there.
  const done = Array.from({ length: n }, (_, i) => (pps[i] ?? 0) > 0);
  const doneCount = done.filter(Boolean).length;
  const roundPoints = points.reduce((sum, p, i) => sum + (hps[i] ?? 0) * p, 0);

  let status: StationRoundStatus;
  if (round?.dns) {
    status = "dns";
  } else if (doneCount === 0) {
    status = round?.finished || round?.dnf ? "finished" : "not-started";
  } else if (round?.finished || round?.dnf || doneCount >= n) {
    status = "finished";
  } else {
    status = "putting";
  }

  const currentStation = status === "putting" ? activeIndex(done) : -1;

  return {
    status,
    currentStation,
    cells: done.map((isDone, i) => ({
      state:
        status === "dns"
          ? "dns"
          : isDone
            ? "done"
            : i === currentStation
              ? "current"
              : "todo",
      hits: hps[i] ?? 0,
      putts: pps[i] ?? 0,
    })),
    roundPoints,
    group: roundGroup(round),
  };
}

function withRoundsBefore(
  players: Record<string, LeagueEventPlayer>,
  roundIndex: number,
): Record<string, LeagueEventPlayer> {
  return Object.fromEntries(
    Object.entries(players).map(([id, p]) => [
      id,
      { ...p, rounds: p.rounds?.slice(0, roundIndex) },
    ]),
  );
}

export function buildStationsLiveState(
  event: LeagueEvent,
  displayUnit?: DistanceUnit,
): StationsLiveState {
  const defs = getStations(event);
  const stations = stationInfo(event, displayUnit);
  const points = stations.map((s) => s.points);
  const raw = event.players ?? {};
  // Doubles are shown per team, so merge team members first.
  const isDoubles = event.playerMode === "doubles";
  const players = isDoubles
    ? groupPlayersForDoubles(raw, event.pairNames)
    : raw;
  const teams = isDoubles
    ? teamMembersById(raw)
    : new Map<string, TeamMember[]>();
  const participants = Object.entries(players);

  const roundCount = Math.max(
    0,
    ...participants.map(([, p]) => p.rounds?.length ?? 0),
  );
  const currentRoundIndex = roundCount - 1;
  const isLive = !event.finished && roundCount > 0;

  const progressById = new Map(
    participants.map(([id, p]) => [
      id,
      stationRoundProgress(p, currentRoundIndex, points),
    ]),
  );
  const statuses = [...progressById.values()].map((r) => r.status);
  const roundStats: RoundStats = {
    finished: statuses.filter((s) => s === "finished").length,
    playing: statuses.filter((s) => s === "putting").length,
    total: statuses.filter((s) => s !== "dns").length,
  };

  // Movement compares against the standings from completed rounds only.
  const prevPlace = new Map<string, number>();
  if (currentRoundIndex > 0) {
    for (const row of computeStationsTotals(
      withRoundsBefore(players, currentRoundIndex),
      defs,
    )) {
      prevPlace.set(row.uid, row.place);
    }
  }

  const standings = computeStationsTotals(players, defs).map((row) => {
    const prev = prevPlace.get(row.uid);
    const members = teams.get(row.uid)?.map((m) => {
      const own = computeStationsTotals({ [m.uid]: m.player }, defs)[0];
      return {
        name: m.name,
        hitLabel:
          own && own.totalPutts > 0 ? `${Math.round(own.hitPercent)}%` : "-",
        round: stationRoundProgress(m.player, currentRoundIndex, points),
      };
    });
    return {
      id: row.uid,
      position: row.place,
      name: row.name,
      pdgaNumber: row.pdgaNumber,
      division: players[row.uid]?.division,
      hitLabel: row.totalPutts > 0 ? `${Math.round(row.hitPercent)}%` : "-",
      score: row.totalScore,
      movement: prev != null ? prev - row.place : 0,
      stationRates: row.stationHits.map((hits, i) => {
        const putts = row.stationPutts[i] ?? 0;
        return putts > 0 ? hits / putts : null;
      }),
      stationHits: row.stationHits,
      stationPutts: row.stationPutts,
      round:
        progressById.get(row.uid) ??
        stationRoundProgress(players[row.uid] ?? {}, currentRoundIndex, points),
      members,
    };
  });

  return {
    stations,
    roundCount,
    currentRoundIndex,
    isLive,
    roundStats,
    standings,
    participants,
    teams,
  };
}
