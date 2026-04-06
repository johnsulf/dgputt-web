import type {
  LeagueEvent,
  LeagueEventMatch,
  LeagueEventPlayer,
} from "@/app/interfaces/league";

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

export function buildParticipants(event: LeagueEvent): {
  participants: Map<string, Participant>;
  memberToTeam: Map<string, string>;
  isDoubles: boolean;
} {
  const players = event.players ?? {};
  const entries = Object.entries(players);
  const isDoubles = event.playerMode === "doubles";
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
    const teamName = names.length > 0 ? names.slice(0, 2).join(" / ") : teamId;

    participants.set(teamId, {
      id: teamId,
      name: teamName,
      division: members[0]?.division,
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

  for (const roundMatches of rounds) {
    for (const match of roundMatches) {
      if (!isFinished(match)) continue;

      const p1Id = resolveParticipantId(
        match.player1.uid,
        isDoubles,
        participants,
        memberToTeam,
      );
      const p2Id = resolveParticipantId(
        match.player2.uid,
        isDoubles,
        participants,
        memberToTeam,
      );

      ensureParticipant(participants, p1Id, match.player1.displayName ?? p1Id);
      ensureParticipant(participants, p2Id, match.player2.displayName ?? p2Id);

      const p1Valid = p1Id.length > 0 && p1Id !== "BYE";
      const p2Valid = p2Id.length > 0 && p2Id !== "BYE";

      const p1Score = parseScore(match.player1.score);
      const p2Score = parseScore(match.player2.score);

      if (p1Valid) {
        scoreDiff.set(p1Id, (scoreDiff.get(p1Id) ?? 0) + (p1Score - p2Score));
        roundsPlayed.set(p1Id, (roundsPlayed.get(p1Id) ?? 0) + 1);
      }
      if (p2Valid) {
        scoreDiff.set(p2Id, (scoreDiff.get(p2Id) ?? 0) + (p2Score - p1Score));
        roundsPlayed.set(p2Id, (roundsPlayed.get(p2Id) ?? 0) + 1);
      }

      if (p1Valid && p2Id === "BYE") {
        wins.set(p1Id, (wins.get(p1Id) ?? 0) + 1);
      } else if (p2Valid && p1Id === "BYE") {
        wins.set(p2Id, (wins.get(p2Id) ?? 0) + 1);
      } else if (p1Valid || p2Valid) {
        if (match.player1.winner === true && p1Valid) {
          wins.set(p1Id, (wins.get(p1Id) ?? 0) + 1);
        } else if (match.player2.winner === true && p2Valid) {
          wins.set(p2Id, (wins.get(p2Id) ?? 0) + 1);
        } else if (p1Valid && p1Score > p2Score) {
          wins.set(p1Id, (wins.get(p1Id) ?? 0) + 1);
        } else if (p2Valid && p2Score > p1Score) {
          wins.set(p2Id, (wins.get(p2Id) ?? 0) + 1);
        }
      }

      if (p1Valid && p2Valid) {
        matchesPlayed.set(p1Id, (matchesPlayed.get(p1Id) ?? 0) + 1);
        matchesPlayed.set(p2Id, (matchesPlayed.get(p2Id) ?? 0) + 1);
      }

      if (p1Valid) {
        const seq = match.player1.sequences ?? [];
        const seqHits = seq.reduce((sum, value) => sum + parseScore(value), 0);
        hits.set(p1Id, (hits.get(p1Id) ?? 0) + seqHits);
        attempts.set(p1Id, (attempts.get(p1Id) ?? 0) + seq.length * 2);
      }
      if (p2Valid) {
        const seq = match.player2.sequences ?? [];
        const seqHits = seq.reduce((sum, value) => sum + parseScore(value), 0);
        hits.set(p2Id, (hits.get(p2Id) ?? 0) + seqHits);
        attempts.set(p2Id, (attempts.get(p2Id) ?? 0) + seq.length * 2);
      }
    }
  }

  const winPct = (id: string): number => {
    const roundsForPlayer = roundsPlayed.get(id) ?? 0;
    if (roundsForPlayer <= 0) return 0;
    return (wins.get(id) ?? 0) / roundsForPlayer;
  };

  for (const roundMatches of rounds) {
    for (const match of roundMatches) {
      if (!isFinished(match)) continue;

      const p1Id = resolveParticipantId(
        match.player1.uid,
        isDoubles,
        participants,
        memberToTeam,
      );
      const p2Id = resolveParticipantId(
        match.player2.uid,
        isDoubles,
        participants,
        memberToTeam,
      );

      const p1Valid = p1Id.length > 0 && p1Id !== "BYE";
      const p2Valid = p2Id.length > 0 && p2Id !== "BYE";
      if (!p1Valid || !p2Valid) continue;

      oppWinPctSum.set(p1Id, (oppWinPctSum.get(p1Id) ?? 0) + winPct(p2Id));
      oppWinPctSum.set(p2Id, (oppWinPctSum.get(p2Id) ?? 0) + winPct(p1Id));
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
