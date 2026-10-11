import type { LeagueEvent, LeagueEventMatch } from "@/app/interfaces/league";
import {
  buildLeaderboardRows,
  buildParticipants,
  getMatchesByRound,
  isFinished,
  isStarted,
  isWalkover,
  parseScore,
  TEAM_SEPARATOR,
  isFloatingTeams,
  sideName,
  sideParticipantIds,
} from "@/lib/cornhole-utils";

// Derived view state shared by the cornhole event page and the TV board.

export type MatchStatus = "live" | "final" | "upcoming";

/** Which colour a side's score bar gets. */
export type BarState = "winner" | "loser" | "leading" | "trailing";

/** A score of this many points fills the bar. */
const BAR_FULL_SCORE = 12;

export interface MatchSideView {
  name: string;
  /** Doubles with a team name: "Player1 / Player2", shown under the name. */
  players?: string;
  score: number;
  barPct: number;
  bar: BarState;
  lost: boolean;
}

export interface MatchView {
  key: string;
  label: string;
  status: MatchStatus;
  progress: string;
  /** Set for a walkover: the player with no opponent this round. */
  walkoverPlayer?: string;
  sides: [MatchSideView, MatchSideView];
}

export interface LiveScore {
  me: number;
  opp: number;
}

export interface StandingRow {
  id: string;
  position: number;
  name: string;
  pdgaNumber?: string;
  division?: string;
  hitLabel: string;
  wins: number;
  /** Places gained (positive) or lost (negative) this round. */
  movement: number;
  /** Status of this participant's match this round, if they have one. */
  matchState?: MatchStatus;
  /** Live score of this participant's current match, while it is playing. */
  now?: LiveScore;
  /**
   * Brackets only: the stage this participant was knocked out in, as the
   * app's code ("QF", "SF", "F"), or "W" for the champion. Unset while
   * still in.
   */
  out?: string;
}

export interface RoundStats {
  finished: number;
  playing: number;
  total: number;
}

export interface CornholeLiveState {
  rounds: LeagueEventMatch[][];
  /**
   * The round being played, or -1 before any round exists. Usually the latest
   * round; a bracket creates every round up front, so there it is the first
   * one still being played.
   */
  currentRoundIndex: number;
  /** Name per round: "Round 1", or a bracket stage such as "Semifinals". */
  roundLabels: string[];
  /** Short name per round for the round switcher: "R1" or "Semi". */
  roundShortLabels: string[];
  isLive: boolean;
  roundStats: RoundStats;
  standings: StandingRow[];
}

function compareByNumberThenId(
  a: LeagueEventMatch,
  b: LeagueEventMatch,
): number {
  if (a.number != null && b.number != null && a.number !== b.number) {
    return a.number - b.number;
  }
  if (a.number != null && b.number == null) return -1;
  if (b.number != null && a.number == null) return 1;
  return (a.shortId ?? a.id ?? "").localeCompare(b.shortId ?? b.id ?? "");
}

/** Stable match order (match number). Never re-sorted by status while live. */
export function sortMatchesStable(
  matches: LeagueEventMatch[],
): LeagueEventMatch[] {
  return [...matches].sort(compareByNumberThenId);
}

/** A bracket: every round is created up front, through to the final. */
export function isBracket(event: LeagueEvent): boolean {
  return event.competitionType === "bracket";
}

/** A side with a real player or team, not a BYE or a "Winner A1" slot. */
function isDecided(side: LeagueEventMatch["player1"]): boolean {
  const uid = side.uid ?? "";
  return uid.length > 0 && uid !== "BYE";
}

function hasScore(match: LeagueEventMatch): boolean {
  return [match.player1, match.player2].some(
    (side) => parseScore(side.score) > 0 || (side.sequences?.length ?? 0) > 0,
  );
}

/**
 * A bracket writes every match as started when it is drawn, so there a
 * match is only live once both players are known and scoring has begun.
 */
export function matchStatus(
  match: LeagueEventMatch,
  bracket = false,
): MatchStatus {
  if (isFinished(match) || isWalkover(match)) return "final";
  if (bracket) {
    return isDecided(match.player1) &&
      isDecided(match.player2) &&
      hasScore(match)
      ? "live"
      : "upcoming";
  }
  if (isStarted(match)) return "live";
  return "upcoming";
}

/**
 * The round being played. A bracket's later rounds exist from the start, so
 * it is the first round with a match still to finish (the final once all are
 * done); otherwise it is the latest round.
 */
export function activeRoundIndex(
  event: LeagueEvent,
  rounds: LeagueEventMatch[][],
): number {
  if (!isBracket(event)) return rounds.length - 1;
  const open = rounds.findIndex((round) =>
    round.some((m) => matchStatus(m, true) !== "final"),
  );
  return open === -1 ? rounds.length - 1 : open;
}

/** The side that won a finished match: 1, 2, or undefined for no winner. */
function winningSide(match: LeagueEventMatch): 1 | 2 | undefined {
  if (match.player2.uid === "BYE") return 1;
  if (match.player1.uid === "BYE") return 2;
  if (match.player1.winner === true) return 1;
  if (match.player2.winner === true) return 2;
  const s1 = parseScore(match.player1.score);
  const s2 = parseScore(match.player2.score);
  if (s1 > s2) return 1;
  if (s2 > s1) return 2;
  return undefined;
}

/**
 * Where each bracket participant went out: the short stage name of the
 * finished match they lost ("QF", "SF", "F"), or "W" for whoever won the
 * final.
 */
function bracketExits(
  event: LeagueEvent,
  rounds: LeagueEventMatch[][],
): Map<string, string> {
  const { participants, memberToTeam, isDoubles } = buildParticipants(event);
  const ids = (side: LeagueEventMatch["player1"]) =>
    sideParticipantIds(event, side, isDoubles, participants, memberToTeam);
  const out = new Map<string, string>();

  rounds.forEach((round, r) => {
    const stage = stageCode(rounds.length, r);
    const isFinal = r === rounds.length - 1;
    for (const match of round) {
      if (!isFinished(match)) continue;
      const winner = winningSide(match);
      if (winner == null) continue;
      const loser = winner === 1 ? match.player2 : match.player1;
      for (const id of ids(loser)) out.set(id, stage);
      if (isFinal) {
        const champ = winner === 1 ? match.player1 : match.player2;
        for (const id of ids(champ)) out.set(id, "W");
      }
    }
  });
  return out;
}

/** Everyone drawn into a bracket: a side in any of its matches. */
function bracketEntrants(
  event: LeagueEvent,
  rounds: LeagueEventMatch[][],
): Set<string> {
  const { participants, memberToTeam, isDoubles } = buildParticipants(event);
  const drawn = new Set<string>();
  for (const match of rounds.flat()) {
    for (const side of [match.player1, match.player2]) {
      for (const id of sideParticipantIds(
        event,
        side,
        isDoubles,
        participants,
        memberToTeam,
      )) {
        drawn.add(id);
      }
    }
  }
  return drawn;
}

// Bracket stage names, counted back from the final (as the app names them).
const STAGES = [
  "Final",
  "Semifinals",
  "Quarterfinals",
  "Round of 16",
  "Round of 32",
];
const SHORT_STAGES = ["Final", "Semi", "Quarter", "R16", "R32"];
const STAGE_CODES = ["F", "SF", "QF", "R16", "R32"];

/** The app's stage code for a bracket round: "QF", "SF", "F", ... */
function stageCode(roundCount: number, index: number): string {
  return STAGE_CODES[roundCount - 1 - index] ?? `R${index + 1}`;
}

export function roundLabel(
  event: LeagueEvent,
  index: number,
  roundCount: number,
  short = false,
): string {
  if (isBracket(event)) {
    const fromFinal = roundCount - 1 - index;
    const stage = (short ? SHORT_STAGES : STAGES)[fromFinal];
    if (stage) return stage;
  }
  return short ? `R${index + 1}` : `Round ${index + 1}`;
}

function frameCount(match: LeagueEventMatch): number {
  return Math.max(
    match.player1.sequences?.length ?? 0,
    match.player2.sequences?.length ?? 0,
  );
}

export function buildMatchView(
  event: LeagueEvent,
  match: LeagueEventMatch,
  index: number,
): MatchView {
  const status = matchStatus(match, isBracket(event));
  const walkover = isWalkover(match);
  const scores = [
    parseScore(match.player1.score),
    parseScore(match.player2.score),
  ];
  const hasWinnerFlag =
    match.player1.winner === true || match.player2.winner === true;
  const frames = frameCount(match);

  const side = (i: 0 | 1): MatchSideView => {
    const player = i === 0 ? match.player1 : match.player2;
    const score = scores[i];
    const oppScore = scores[1 - i];
    const won =
      status === "final" &&
      (walkover
        ? player.uid !== "BYE"
        : player.winner === true || (!hasWinnerFlag && score > oppScore));
    const lost = status === "final" && !won;

    const name = sideName(event, player);
    const players = (player.members ?? [])
      .map((m) => (m.displayName ?? "").trim())
      .filter(Boolean)
      .join(TEAM_SEPARATOR);

    return {
      name,
      players:
        players && !isFloatingTeams(event) && players !== name
          ? players
          : undefined,
      score,
      barPct: Math.min(score / BAR_FULL_SCORE, 1) * 100,
      bar: won
        ? "winner"
        : lost
          ? "loser"
          : status === "live" && score > oppScore
            ? "leading"
            : "trailing",
      lost,
    };
  };

  const label = String(match.number ?? match.shortId ?? index + 1);
  const walkoverSide =
    match.player1.uid === "BYE" ? match.player2 : match.player1;

  return {
    key: match.id ?? match.shortId ?? `match-${index}`,
    label,
    status,
    walkoverPlayer: walkover ? sideName(event, walkoverSide) : undefined,
    progress: walkover
      ? ""
      : status === "live"
        ? frames > 0
          ? `Frame ${frames}`
          : "Starting"
        : status === "final"
          ? `${frames} frame${frames === 1 ? "" : "s"}`
          : !isDecided(match.player1) || !isDecided(match.player2)
            ? "Waiting for players"
            : "Waiting for basket",
    sides: [side(0), side(1)],
  };
}

export function buildCornholeLiveState(event: LeagueEvent): CornholeLiveState {
  const rounds = getMatchesByRound(event);
  const bracket = isBracket(event);
  const currentRoundIndex = activeRoundIndex(event, rounds);
  const roundLabels = rounds.map((_, i) => roundLabel(event, i, rounds.length));
  const roundShortLabels = rounds.map((_, i) =>
    roundLabel(event, i, rounds.length, true),
  );
  const currentMatches = rounds[currentRoundIndex] ?? [];
  const isLive = !event.finished && currentMatches.length > 0;

  // Walkovers are not played on a board, so they don't count as progress.
  const statuses = currentMatches
    .filter((m) => !isWalkover(m))
    .map((m) => matchStatus(m, bracket));
  const roundStats: RoundStats = {
    finished: statuses.filter((s) => s === "final").length,
    playing: statuses.filter((s) => s === "live").length,
    total: statuses.length,
  };

  const rows = buildLeaderboardRows(event);

  // Movement compares against the standings before the current round. The
  // first round has nothing to compare with, so it shows no movement.
  const prevPosition = new Map<string, number>();
  if (currentRoundIndex > 0) {
    const previousRounds = rounds.slice(0, currentRoundIndex);
    const prevRows = buildLeaderboardRows({
      ...event,
      matchesByRound: previousRounds,
      matches: previousRounds.flat(),
    });
    for (const row of prevRows) {
      prevPosition.set(row.participant.id, row.basePosition);
    }
  }

  const nowByParticipant = new Map<string, LiveScore>();
  const stateByParticipant = new Map<string, MatchStatus>();
  if (isLive) {
    const { participants, memberToTeam, isDoubles } = buildParticipants(event);
    for (const match of currentMatches) {
      const status = matchStatus(match, bracket);
      const live = status === "live";
      const s1 = parseScore(match.player1.score);
      const s2 = parseScore(match.player2.score);
      const ids = (side: LeagueEventMatch["player1"]) =>
        sideParticipantIds(event, side, isDoubles, participants, memberToTeam);
      for (const id of ids(match.player1)) {
        stateByParticipant.set(id, status);
        if (live) nowByParticipant.set(id, { me: s1, opp: s2 });
      }
      for (const id of ids(match.player2)) {
        stateByParticipant.set(id, status);
        if (live) nowByParticipant.set(id, { me: s2, opp: s1 });
      }
    }
  }

  const outById = bracket ? bracketExits(event, rounds) : new Map();
  // A bracket lists only who was drawn into it, not everyone registered.
  const drawn = bracket ? bracketEntrants(event, rounds) : null;

  const standings: StandingRow[] = rows
    .filter((row) => !drawn || drawn.has(row.participant.id))
    .map((row) => {
      const id = row.participant.id;
      const prev = prevPosition.get(id);
      return {
        id,
        position: row.basePosition,
        name: row.participant.name,
        pdgaNumber: row.participant.pdgaNumber,
        division: row.participant.division,
        hitLabel: row.attempts > 0 ? `${Math.round(row.hitPct * 100)}%` : "-",
        wins: row.wins,
        movement: prev != null ? prev - row.basePosition : 0,
        matchState: stateByParticipant.get(id),
        now: nowByParticipant.get(id),
        out: outById.get(id),
      };
    });

  return {
    rounds,
    currentRoundIndex,
    roundLabels,
    roundShortLabels,
    isLive,
    roundStats,
    standings,
  };
}
