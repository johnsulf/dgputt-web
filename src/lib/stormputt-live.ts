import type { LeagueEvent, LeagueEventPlayer } from "@/app/interfaces/league";
import type { RoundStats } from "@/lib/cornhole-live";
import {
  NUM_DISTANCES,
  computeTotals,
  groupPlayersForDoubles,
  teamMembersById,
  type TeamMember,
} from "@/lib/stormputt-utils";
import { activeIndex, roundGroup } from "@/lib/live-progress";

// Derived view state shared by the StormPutt event page and the TV board.

export type PlayerRoundStatus = "putting" | "finished" | "not-started";

export interface DistanceCell {
  state: "done" | "current" | "todo";
  hits: number;
  putts: number;
}

export interface RoundProgress {
  status: PlayerRoundStatus;
  /** Distance being putted now, or -1 when not putting. */
  currentDistance: number;
  cells: DistanceCell[];
  roundHits: number;
  /** Group number this round, when the round is grouped. */
  group?: number;
}

/** One player of a doubles team. */
export interface StormPuttMemberView {
  name: string;
  hitLabel: string;
  round: RoundProgress;
}

export interface StormPuttStandingRow {
  id: string;
  position: number;
  name: string;
  pdgaNumber?: string;
  division?: string;
  hitLabel: string;
  hits: number;
  /** Places gained (positive) or lost (negative) this round. */
  movement: number;
  /** Event hit rate per distance (0-1), or null with no putts there yet. */
  distanceRates: (number | null)[];
  /** Current-round progress for this participant. */
  round: RoundProgress;
  /** The two players of a doubles team; `round` and `hits` are combined. */
  members?: StormPuttMemberView[];
}

export interface StormPuttLiveState {
  roundCount: number;
  /** Latest round that exists, or -1 before any round. */
  currentRoundIndex: number;
  isLive: boolean;
  roundStats: RoundStats;
  standings: StormPuttStandingRow[];
  /** Participants in stable (registration) order, for the round view. */
  participants: [string, LeagueEventPlayer][];
  /** Doubles teams' individual players, keyed by team id. */
  teams: Map<string, TeamMember[]>;
}

export function roundProgress(
  player: LeagueEventPlayer,
  roundIndex: number,
): RoundProgress {
  const round = player.rounds?.[roundIndex];
  const hps = round?.hitsPerSequence ?? [];
  const pps = round?.puttsPerSequence ?? [];
  const done = Array.from(
    { length: NUM_DISTANCES },
    (_, i) => (pps[i] ?? 0) > 0 || (hps[i] ?? 0) > 0,
  );
  const doneCount = done.filter(Boolean).length;
  const roundHits = round?.hits ?? hps.reduce((sum, h) => sum + (h ?? 0), 0);

  let status: PlayerRoundStatus;
  if (!round || round.dns || doneCount === 0) {
    status = round?.finished || round?.dnf ? "finished" : "not-started";
  } else if (round.finished || round.dnf || doneCount >= NUM_DISTANCES) {
    status = "finished";
  } else {
    status = "putting";
  }

  const currentDistance = status === "putting" ? activeIndex(done) : -1;

  return {
    status,
    currentDistance,
    cells: done.map((isDone, i) => ({
      state: isDone ? "done" : i === currentDistance ? "current" : "todo",
      hits: hps[i] ?? 0,
      putts: pps[i] ?? 0,
    })),
    roundHits,
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

export function buildStormPuttLiveState(
  event: LeagueEvent,
): StormPuttLiveState {
  const raw = event.players ?? {};
  // Doubles are shown per team, so merge team members first.
  const players =
    event.playerMode === "doubles"
      ? groupPlayersForDoubles(raw, event.pairNames)
      : raw;
  const participants = Object.entries(players);
  const teams =
    event.playerMode === "doubles"
      ? teamMembersById(raw)
      : new Map<string, TeamMember[]>();

  const roundCount = Math.max(
    0,
    ...participants.map(([, p]) => p.rounds?.length ?? 0),
  );
  const currentRoundIndex = roundCount - 1;
  const isLive = !event.finished && roundCount > 0;

  const progressById = new Map(
    participants.map(([id, p]) => [id, roundProgress(p, currentRoundIndex)]),
  );
  const statuses = [...progressById.values()].map((r) => r.status);
  const roundStats: RoundStats = {
    finished: statuses.filter((s) => s === "finished").length,
    playing: statuses.filter((s) => s === "putting").length,
    total: statuses.length,
  };

  // Movement compares against the standings from completed rounds only.
  const prevPlace = new Map<string, number>();
  if (currentRoundIndex > 0) {
    for (const row of computeTotals(
      withRoundsBefore(players, currentRoundIndex),
    )) {
      prevPlace.set(row.uid, row.place);
    }
  }

  const standings = computeTotals(players).map((row) => {
    const prev = prevPlace.get(row.uid);
    const members = teams.get(row.uid)?.map((m) => {
      const own = computeTotals({ [m.uid]: m.player })[0];
      return {
        name: m.name,
        hitLabel: own && own.putts > 0 ? `${Math.round(own.hitPercent)}%` : "-",
        round: roundProgress(m.player, currentRoundIndex),
      };
    });
    return {
      id: row.uid,
      position: row.place,
      name: row.name,
      pdgaNumber: row.pdgaNumber,
      division: players[row.uid]?.division,
      hitLabel: row.putts > 0 ? `${Math.round(row.hitPercent)}%` : "-",
      hits: row.hits,
      movement: prev != null ? prev - row.place : 0,
      distanceRates: row.distances.map((hits, i) => {
        const putts = row.distancePutts[i] ?? 0;
        return putts > 0 ? hits / putts : null;
      }),
      round:
        progressById.get(row.uid) ??
        roundProgress(players[row.uid] ?? {}, currentRoundIndex),
      members,
    };
  });

  return {
    roundCount,
    currentRoundIndex,
    isLive,
    roundStats,
    standings,
    participants,
    teams,
  };
}

/** Distance range for the chip, e.g. "5–10 m" or "16–33 ft". */
export function distanceRangeLabel(distances: string[]): string {
  const unit = distances[0]?.endsWith("ft") ? "ft" : "m";
  const strip = (d?: string) => d?.replace(unit, "") ?? "";
  return `${strip(distances[0])}–${strip(distances[distances.length - 1])} ${unit}`;
}
