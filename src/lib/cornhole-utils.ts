import type {
  LeagueEvent,
  LeagueEventMatch,
  LeagueEventPlayer,
  MatchSide,
} from "@/app/interfaces/league";

// The app's cornhole distance picker, indexed by the event's dstIndex. The
// two lists line up: 4m is 13ft, 15m is 50ft.
const CORNHOLE_DST_METER = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const CORNHOLE_DST_FEET = [13, 16, 20, 23, 26, 30, 33, 36, 40, 43, 46, 50];

/**
 * The event's throwing distance, e.g. "7 m" or "23 ft", or undefined when
 * none was chosen (the app writes 99 for that).
 */
export function cornholeDistanceLabel(
  event: LeagueEvent,
  unit: "m" | "ft",
): string | undefined {
  const i = event.dstIndex;
  if (i == null || i < 0 || i >= CORNHOLE_DST_METER.length) return undefined;
  return unit === "ft"
    ? `${CORNHOLE_DST_FEET[i]} ft`
    : `${CORNHOLE_DST_METER[i]} m`;
}

export interface Participant {
  id: string;
  name: string;
  division?: string;
  pdgaNumber?: string;
  members: string[];
}

export interface LeaderboardRow {
  participant: Participant;
  wins: number;
  scoreDiff: number;
  hits: number;
  attempts: number;
  hitPct: number;
  sos: number;
  matchesPlayed: number;
  roundsPlayed: number;
  basePosition: number;
}

export function parseScore(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

export function getMatchesByRound(event: LeagueEvent): LeagueEventMatch[][] {
  if (event.matchesByRound && event.matchesByRound.length > 0) {
    return event.matchesByRound.map((round) => round ?? []);
  }

  if (!event.matches || event.matches.length === 0) {
    return [];
  }

  const grouped: LeagueEventMatch[][] = [];
  for (const match of event.matches) {
    const roundIndex = match.roundIndex ?? 0;
    if (!grouped[roundIndex]) grouped[roundIndex] = [];
    grouped[roundIndex].push(match);
  }

  return grouped.map((round) => round ?? []);
}

export function isFinished(match: LeagueEventMatch): boolean {
  return match.finished === true;
}

export function isStarted(match: LeagueEventMatch): boolean {
  if (match.started === true) return true;
  return isFinished(match);
}

export function isWalkover(match: LeagueEventMatch): boolean {
  const p1 = match.player1.uid ?? "";
  const p2 = match.player2.uid ?? "";
  return p1 === "BYE" || p2 === "BYE";
}

export function percent(hits: number, attempts: number): number {
  if (attempts <= 0) return -1;
  return hits / attempts;
}

/**
 * Doubles whose teams are redrawn every round. A floating team lasts a single
 * round and is never named, so it is shown as its players and scored per
 * player. Only cornhole generates rounds to redraw teams for.
 */
export function isFloatingTeams(event: LeagueEvent): boolean {
  return (
    event.playerMode === "doubles" &&
    event.format === "cornhole" &&
    event.doublesPairingMode === "float"
  );
}

export const TEAM_SEPARATOR = " / ";
export const FLOATING_SEPARATOR = " & ";

/** The name a match side shows: the team name, else its players. */
export function sideName(event: LeagueEvent, side: MatchSide): string {
  const uid = side.uid ?? "";
  const fallback = side.displayName ?? (uid || "Unknown");
  if (event.playerMode !== "doubles" || !uid || uid === "BYE") return fallback;

  const memberNames = (side.members ?? [])
    .map((m) => (m.displayName ?? "").trim())
    .filter((name) => name.length > 0);

  if (isFloatingTeams(event)) {
    return memberNames.length > 0
      ? memberNames.join(FLOATING_SEPARATOR)
      : fallback;
  }

  const pairNames = event.pairNames ?? {};
  const pairId = pairNames[uid] ? uid : event.players?.[uid]?.pairId;
  const named = pairId ? pairNames[pairId] : undefined;
  if (named) return named;

  return memberNames.length > 0 ? memberNames.join(TEAM_SEPARATOR) : fallback;
}

export function buildParticipants(event: LeagueEvent): {
  participants: Map<string, Participant>;
  memberToTeam: Map<string, string>;
  isDoubles: boolean;
} {
  const players = event.players ?? {};
  const entries = Object.entries(players);
  // Floating teams are scored per player, so they build like singles.
  const isDoubles = event.playerMode === "doubles" && !isFloatingTeams(event);
  const participants = new Map<string, Participant>();
  const memberToTeam = new Map<string, string>();

  if (!isDoubles) {
    for (const [uid, player] of entries) {
      participants.set(uid, {
        id: uid,
        name: player.displayName ?? player.name ?? "Unknown",
        division: player.division,
        pdgaNumber: player.pdgaNumber || undefined,
        members: [player.displayName ?? player.name ?? "Unknown"],
      });
    }
    return { participants, memberToTeam, isDoubles };
  }

  const teamMembers = new Map<string, LeagueEventPlayer[]>();

  for (const [uid, player] of entries) {
    const teamId = player.pairId ?? uid;
    if (!teamMembers.has(teamId)) teamMembers.set(teamId, []);
    teamMembers.get(teamId)?.push(player);
    memberToTeam.set(uid, teamId);
  }

  for (const [teamId, members] of teamMembers.entries()) {
    const names = members
      .map((m) => m.displayName ?? m.name ?? "Unknown")
      .filter((name) => name.trim().length > 0);
    const teamName =
      event.pairNames?.[teamId] ??
      (names.length > 0 ? names.slice(0, 2).join(TEAM_SEPARATOR) : teamId);

    participants.set(teamId, {
      id: teamId,
      name: teamName,
      division: event.pairDivisions?.[teamId] ?? members[0]?.division,
      members: names,
    });
  }

  return { participants, memberToTeam, isDoubles };
}

export function resolveParticipantId(
  uid: string | undefined,
  isDoubles: boolean,
  participants: Map<string, Participant>,
  memberToTeam: Map<string, string>,
): string {
  if (!uid) return "";
  if (uid === "BYE") return "BYE";
  if (!isDoubles) return uid;
  if (participants.has(uid)) return uid;
  return memberToTeam.get(uid) ?? uid;
}

/**
 * The participants a match side counts towards. One, except with floating
 * teams: there both members take the team's result.
 */
export function sideParticipantIds(
  event: LeagueEvent,
  side: MatchSide,
  isDoubles: boolean,
  participants: Map<string, Participant>,
  memberToTeam: Map<string, string>,
): string[] {
  if (side.uid === "BYE") return [];
  if (isFloatingTeams(event)) {
    return (side.members ?? [])
      .map((m) => m.uid ?? "")
      .filter((uid) => uid.length > 0);
  }
  const id = resolveParticipantId(
    side.uid,
    isDoubles,
    participants,
    memberToTeam,
  );
  return id ? [id] : [];
}

/** The bags a participant landed on a side: their own when floating. */
function sideSequences(
  event: LeagueEvent,
  side: MatchSide,
  participantId: string,
): number[] {
  if (!isFloatingTeams(event)) return side.sequences ?? [];
  const member = side.members?.find((m) => m.uid === participantId);
  return member?.sequences ?? [];
}

export function ensureParticipant(
  participants: Map<string, Participant>,
  id: string,
  fallbackName: string,
): void {
  if (!id || id === "BYE" || participants.has(id)) return;
  participants.set(id, {
    id,
    name: fallbackName || "Unknown",
    members: fallbackName ? [fallbackName] : ["Unknown"],
  });
}

export function buildLeaderboardRows(event: LeagueEvent): LeaderboardRow[] {
  const rounds = getMatchesByRound(event);
  const { participants, memberToTeam, isDoubles } = buildParticipants(event);

  const wins = new Map<string, number>();
  const scoreDiff = new Map<string, number>();
  const hits = new Map<string, number>();
  const attempts = new Map<string, number>();
  const matchesPlayed = new Map<string, number>();
  const roundsPlayed = new Map<string, number>();
  const oppWinPctSum = new Map<string, number>();

  for (const participantId of participants.keys()) {
    wins.set(participantId, 0);
    scoreDiff.set(participantId, 0);
    hits.set(participantId, 0);
    attempts.set(participantId, 0);
    matchesPlayed.set(participantId, 0);
    roundsPlayed.set(participantId, 0);
    oppWinPctSum.set(participantId, 0);
  }

  const add = (map: Map<string, number>, id: string, value: number) =>
    map.set(id, (map.get(id) ?? 0) + value);

  const sidesOf = (match: LeagueEventMatch): [string[], string[]] => {
    const ids = ([match.player1, match.player2] as const).map((side) =>
      sideParticipantIds(event, side, isDoubles, participants, memberToTeam),
    );
    ids.forEach((list, i) => {
      const side = i === 0 ? match.player1 : match.player2;
      for (const id of list) {
        if (!participants.has(id)) {
          const member = side.members?.find((m) => m.uid === id);
          ensureParticipant(
            participants,
            id,
            member?.displayName ?? sideName(event, side),
          );
        }
      }
    });
    return [ids[0], ids[1]];
  };

  for (const roundMatches of rounds) {
    for (const match of roundMatches) {
      if (!isFinished(match)) continue;

      const [side1, side2] = sidesOf(match);
      const bye1 = match.player1.uid === "BYE";
      const bye2 = match.player2.uid === "BYE";
      const p1Score = parseScore(match.player1.score);
      const p2Score = parseScore(match.player2.score);

      for (const id of side1) add(scoreDiff, id, p1Score - p2Score);
      for (const id of side2) add(scoreDiff, id, p2Score - p1Score);
      for (const id of [...side1, ...side2]) add(roundsPlayed, id, 1);

      // A bye is a win. Otherwise the winner flag decides, falling back to
      // the score where the flag was never written.
      let winners: string[] = [];
      if (bye2) winners = side1;
      else if (bye1) winners = side2;
      else if (match.player1.winner === true) winners = side1;
      else if (match.player2.winner === true) winners = side2;
      else if (p1Score > p2Score) winners = side1;
      else if (p2Score > p1Score) winners = side2;
      for (const id of winners) add(wins, id, 1);

      if (side1.length > 0 && side2.length > 0) {
        for (const id of [...side1, ...side2]) add(matchesPlayed, id, 1);
      }

      const tally = (id: string, side: MatchSide) => {
        const seq = sideSequences(event, side, id);
        add(
          hits,
          id,
          seq.reduce((sum, value) => sum + parseScore(value), 0),
        );
        add(attempts, id, seq.length * 2);
      };
      for (const id of side1) tally(id, match.player1);
      for (const id of side2) tally(id, match.player2);
    }
  }

  const winPct = (id: string): number => {
    const roundsForPlayer = roundsPlayed.get(id) ?? 0;
    if (roundsForPlayer <= 0) return 0;
    return (wins.get(id) ?? 0) / roundsForPlayer;
  };

  // A floating opponent is a team of one or two, so its strength is the
  // average of the players who made it up.
  const sidePct = (ids: string[]): number =>
    ids.reduce((sum, id) => sum + winPct(id), 0) / ids.length;

  for (const roundMatches of rounds) {
    for (const match of roundMatches) {
      if (!isFinished(match)) continue;

      const [side1, side2] = sidesOf(match);
      if (side1.length === 0 || side2.length === 0) continue;

      const pct1 = sidePct(side1);
      const pct2 = sidePct(side2);
      for (const id of side1) add(oppWinPctSum, id, pct2);
      for (const id of side2) add(oppWinPctSum, id, pct1);
    }
  }

  const baseSorted = [...participants.values()].sort((a, b) => {
    const winsDiff = (wins.get(b.id) ?? 0) - (wins.get(a.id) ?? 0);
    if (winsDiff !== 0) return winsDiff;

    const hitDiff =
      percent(hits.get(b.id) ?? 0, attempts.get(b.id) ?? 0) -
      percent(hits.get(a.id) ?? 0, attempts.get(a.id) ?? 0);
    if (hitDiff !== 0) return hitDiff;

    const bMatches = matchesPlayed.get(b.id) ?? 0;
    const aMatches = matchesPlayed.get(a.id) ?? 0;
    const bSos = bMatches > 0 ? (oppWinPctSum.get(b.id) ?? 0) / bMatches : -1;
    const aSos = aMatches > 0 ? (oppWinPctSum.get(a.id) ?? 0) / aMatches : -1;
    if (bSos !== aSos) return bSos - aSos;

    const diffCmp = (scoreDiff.get(b.id) ?? 0) - (scoreDiff.get(a.id) ?? 0);
    if (diffCmp !== 0) return diffCmp;

    return a.name.localeCompare(b.name);
  });

  const basePosition = new Map<string, number>();
  baseSorted.forEach((participant, index) => {
    basePosition.set(participant.id, index + 1);
  });

  return baseSorted.map((participant) => {
    const played = matchesPlayed.get(participant.id) ?? 0;
    const sos =
      played > 0 ? (oppWinPctSum.get(participant.id) ?? 0) / played : -1;

    return {
      participant,
      wins: wins.get(participant.id) ?? 0,
      scoreDiff: scoreDiff.get(participant.id) ?? 0,
      hits: hits.get(participant.id) ?? 0,
      attempts: attempts.get(participant.id) ?? 0,
      hitPct: percent(
        hits.get(participant.id) ?? 0,
        attempts.get(participant.id) ?? 0,
      ),
      sos,
      matchesPlayed: played,
      roundsPlayed: roundsPlayed.get(participant.id) ?? 0,
      basePosition: basePosition.get(participant.id) ?? 0,
    };
  });
}
