"use client";

import { useMemo, useState } from "react";
import type {
  LeagueEvent,
  LeagueEventMatch,
  LeagueEventPlayer,
  MatchMember,
} from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";

interface CornholeEventProps {
  event: LeagueEvent;
}

interface Participant {
  id: string;
  name: string;
  division?: string;
  members: string[];
}

interface LeaderboardRow {
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

interface LeaderboardTableRow {
  id: string;
  position: number;
  playerName: string;
  division?: string;
  hitPctLabel: string;
  hitPctValue: number;
  wins: number;
}

function parseScore(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function getMatchesByRound(event: LeagueEvent): LeagueEventMatch[][] {
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

function isFinished(match: LeagueEventMatch): boolean {
  return match.finished === true;
}

function isStarted(match: LeagueEventMatch): boolean {
  if (match.started === true) return true;
  return isFinished(match);
}

function isWalkover(match: LeagueEventMatch): boolean {
  const p1 = match.player1.uid ?? "";
  const p2 = match.player2.uid ?? "";
  return p1 === "BYE" || p2 === "BYE";
}

function compareByNumberThenId(
  a: LeagueEventMatch,
  b: LeagueEventMatch,
): number {
  const aNumber = a.number;
  const bNumber = b.number;

  if (aNumber != null || bNumber != null) {
    if (aNumber != null && bNumber != null && aNumber !== bNumber) {
      return aNumber - bNumber;
    }
    if (aNumber != null) return -1;
    if (bNumber != null) return 1;
  }

  const aId = a.shortId ?? a.id ?? "";
  const bId = b.shortId ?? b.id ?? "";
  return aId.localeCompare(bId);
}

function sortMatchesForRound(matches: LeagueEventMatch[]): LeagueEventMatch[] {
  return [...matches].sort((a, b) => {
    const statusRank = (m: LeagueEventMatch) => {
      if (isFinished(m)) return 2;
      if (isStarted(m)) return 0;
      return 1;
    };

    const rankDiff = statusRank(a) - statusRank(b);
    if (rankDiff !== 0) return rankDiff;

    const numberDiff = compareByNumberThenId(a, b);
    if (numberDiff !== 0) return numberDiff;

    const aWalkover = isWalkover(a);
    const bWalkover = isWalkover(b);
    if (aWalkover !== bWalkover) {
      return aWalkover ? 1 : -1;
    }

    return 0;
  });
}

function getPointsForSet(hits: number): number {
  if (hits <= 0) return 0;
  if (hits === 1) return 1;
  if (hits === 2) return 3;
  return 0;
}

function percent(hits: number, attempts: number): number {
  if (attempts <= 0) return -1;
  return hits / attempts;
}

function buildParticipants(event: LeagueEvent): {
  participants: Map<string, Participant>;
  memberToTeam: Map<string, string>;
  isDoubles: boolean;
} {
  const players = event.players ?? {};
  const entries = Object.entries(players).filter(
    ([, player]) => !player.isDummy,
  );
  const isDoubles = event.playerMode === "doubles";
  const participants = new Map<string, Participant>();
  const memberToTeam = new Map<string, string>();

  if (!isDoubles) {
    for (const [uid, player] of entries) {
      participants.set(uid, {
        id: uid,
        name: player.displayName ?? player.name ?? "Unknown",
        division: player.division,
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

function resolveParticipantId(
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

function ensureParticipant(
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

function buildLeaderboardRows(event: LeagueEvent): LeaderboardRow[] {
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

function MatchHeader({ match }: { match: LeagueEventMatch }) {
  const leftName = match.player1.displayName ?? match.player1.uid ?? "Unknown";
  const rightName = match.player2.displayName ?? match.player2.uid ?? "Unknown";
  const leftScore = parseScore(match.player1.score);
  const rightScore = parseScore(match.player2.score);
  const finished = isFinished(match);
  const started = isStarted(match);
  const hasWinnerFlag =
    match.player1.winner === true || match.player2.winner === true;

  const leftWinner = finished
    ? match.player1.winner === true ||
      (!hasWinnerFlag && leftScore > rightScore)
    : false;
  const rightWinner = finished
    ? match.player2.winner === true ||
      (!hasWinnerFlag && rightScore > leftScore)
    : false;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {match.shortId
              ? `Match ${match.shortId}`
              : match.number != null
                ? `Match ${match.number}`
                : "Match"}
          </span>
        </div>
        <Badge
          variant={finished ? "secondary" : started ? "outline" : "destructive"}
          className="text-[10px]"
        >
          {finished ? "Finished" : started ? "Ongoing" : "Not started"}
        </Badge>
      </div>

      {isWalkover(match) ? (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
          <div className="truncate font-semibold">{leftName}</div>
          <div className="rounded-full bg-muted px-3 py-1 text-xs">
            Walkover
          </div>
          <div className="truncate text-right font-semibold">{rightName}</div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
          <div className="px-2 py-1">
            <div className="truncate text-right">
              <span className={leftWinner ? "font-semibold" : "font-medium"}>
                {leftName}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-muted px-3 py-2 text-center">
            <div className="text-base font-bold tabular-nums">
              {leftScore} - {rightScore}
            </div>
          </div>

          <div className="px-2 py-1">
            <div className="truncate">
              <span className={rightWinner ? "font-semibold" : "font-medium"}>
                {rightName}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function sequenceRows(match: LeagueEventMatch) {
  const leftSequences = match.player1.sequences ?? [];
  const rightSequences = match.player2.sequences ?? [];
  const max = Math.max(leftSequences.length, rightSequences.length);
  let leftRunningTotal = 0;
  let rightRunningTotal = 0;

  return Array.from({ length: max }, (_, index) => {
    const leftHits = parseScore(leftSequences[index]);
    const rightHits = parseScore(rightSequences[index]);
    const leftPoints = getPointsForSet(leftHits);
    const rightPoints = getPointsForSet(rightHits);
    leftRunningTotal += leftPoints;
    rightRunningTotal += rightPoints;

    return {
      setNumber: index + 1,
      leftHits,
      rightHits,
      leftPoints,
      rightPoints,
      leftRunningTotal,
      rightRunningTotal,
    };
  });
}

function memberHitPercentage(member: MatchMember): string {
  const sequences = member.sequences ?? [];
  if (sequences.length === 0) return "-";

  const hits = sequences.reduce((sum, value) => sum + parseScore(value), 0);
  const attempts = sequences.length * 2;
  if (attempts <= 0) return "-";

  const pct = Math.round((hits / attempts) * 100);
  return `${pct}%`;
}

function MatchDetails({ match }: { match: LeagueEventMatch }) {
  const sets = sequenceRows(match);
  const leftMembers = match.player1.members ?? [];
  const rightMembers = match.player2.members ?? [];
  const leftName = match.player1.displayName ?? match.player1.uid ?? "Unknown";
  const rightName = match.player2.displayName ?? match.player2.uid ?? "Unknown";

  return (
    <div className="space-y-4">
      {sets.length > 0 ? (
        <div className="rounded-2xl border">
          <div>
            {sets.map((set) => {
              const leftWinsSet = set.leftPoints > set.rightPoints;
              const rightWinsSet = set.rightPoints > set.leftPoints;

              return (
                <div
                  key={set.setNumber}
                  className="grid grid-cols-[1fr_auto_1fr] items-center border-b px-3 py-2 text-sm last:border-b-0"
                >
                  <div className="text-right tabular-nums">
                    <span
                      className={
                        leftWinsSet ? "font-semibold" : "text-muted-foreground"
                      }
                    >
                      {set.leftPoints}p
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({set.leftHits}/2)
                    </span>
                  </div>
                  <div className="px-4 text-center text-xs font-semibold text-muted-foreground">
                    <div>Set {set.setNumber}</div>
                    <div className="text-[11px] font-medium">
                      ({set.leftRunningTotal}-{set.rightRunningTotal})
                    </div>
                  </div>
                  <div className="tabular-nums">
                    <span
                      className={
                        rightWinsSet ? "font-semibold" : "text-muted-foreground"
                      }
                    >
                      {set.rightPoints}p
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({set.rightHits}/2)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No set details yet.</p>
      )}

      {(leftMembers.length > 0 || rightMembers.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              {leftName}
            </h4>
            {leftMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No member stats</p>
            ) : (
              <div className="space-y-1">
                {leftMembers.map((member) => (
                  <div
                    key={member.uid ?? member.displayName}
                    className="flex justify-between text-sm"
                  >
                    <span>{member.displayName ?? member.uid ?? "Unknown"}</span>
                    <span className="text-muted-foreground">
                      {memberHitPercentage(member)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              {rightName}
            </h4>
            {rightMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No member stats</p>
            ) : (
              <div className="space-y-1">
                {rightMembers.map((member) => (
                  <div
                    key={member.uid ?? member.displayName}
                    className="flex justify-between text-sm"
                  >
                    <span>{member.displayName ?? member.uid ?? "Unknown"}</span>
                    <span className="text-muted-foreground">
                      {memberHitPercentage(member)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RoundResults({
  roundIndex,
  matches,
}: {
  roundIndex: number;
  matches: LeagueEventMatch[];
}) {
  const sorted = useMemo(() => sortMatchesForRound(matches), [matches]);

  return (
    <div className="space-y-3">
      {sorted.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No matches for round {roundIndex + 1}.
        </p>
      ) : (
        <Accordion>
          {sorted.map((match, idx) => {
            const itemValue = `${match.id ?? match.shortId ?? roundIndex}-${idx}`;

            return (
              <AccordionItem key={itemValue} value={itemValue}>
                <AccordionTrigger>
                  <MatchHeader match={match} />
                </AccordionTrigger>
                <AccordionContent>
                  <MatchDetails match={match} />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}

function Leaderboard({
  rows,
  isDoubles,
}: {
  rows: LeaderboardRow[];
  isDoubles: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "position", desc: false },
  ]);

  const tableRows = useMemo<LeaderboardTableRow[]>(
    () =>
      rows.map((row) => ({
        id: row.participant.id,
        position: row.basePosition,
        playerName: row.participant.name,
        division: row.participant.division,
        hitPctLabel:
          row.attempts > 0 ? `${Math.round(row.hitPct * 100)}%` : "-",
        hitPctValue: row.hitPct,
        wins: row.wins,
      })),
    [rows],
  );

  const columns = useMemo<ColumnDef<LeaderboardTableRow>[]>(
    () => [
      {
        accessorKey: "position",
        header: "#",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.position}</span>
        ),
      },
      {
        accessorKey: "playerName",
        header: "Player",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.playerName}</span>
            {isDoubles && row.original.division ? (
              <span className="text-xs text-muted-foreground">
                Division {row.original.division.toUpperCase()}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "hitPctValue",
        header: "Hit%",
        cell: ({ row }) => row.original.hitPctLabel,
      },
      {
        accessorKey: "wins",
        header: "Wins",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.wins}</span>
        ),
      },
    ],
    [isDoubles],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return (
    <Card className="rounded-3xl border py-4 shadow-none">
      <CardContent className="space-y-4 px-3 sm:px-5">
        <h3 className="text-base font-semibold">Leaderboard</h3>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortState = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "position"
                          ? "w-12 text-center"
                          : header.id === "hitPctValue"
                            ? "w-24 text-center"
                            : header.id === "wins"
                              ? "w-20 text-center"
                              : undefined
                      }
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          className={
                            header.id === "position" ||
                            header.id === "hitPctValue" ||
                            header.id === "wins"
                              ? "mx-auto inline-flex items-center gap-1"
                              : "inline-flex items-center gap-1"
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span className="text-xs text-muted-foreground">
                            {sortState === "asc"
                              ? "▲"
                              : sortState === "desc"
                                ? "▼"
                                : "↕"}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={
                      cell.column.id === "position" ||
                      cell.column.id === "hitPctValue" ||
                      cell.column.id === "wins"
                        ? "text-center"
                        : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-muted-foreground"
                >
                  No players yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CornholeEvent({ event }: CornholeEventProps) {
  const roundsFromData = useMemo(() => getMatchesByRound(event), [event]);
  const rows = useMemo(() => buildLeaderboardRows(event), [event]);
  const isDoubles = event.playerMode === "doubles";

  const computedRoundCount = Math.max(event.rounds ?? 0, roundsFromData.length);
  const roundCount = computedRoundCount > 0 ? computedRoundCount : 1;

  const rounds = useMemo(() => {
    return Array.from({ length: roundCount }, (_, roundIndex) => {
      return roundsFromData[roundIndex] ?? [];
    });
  }, [roundCount, roundsFromData]);

  const hasAnyPlayers = Object.keys(event.players ?? {}).some(
    (uid) => event.players?.[uid]?.isDummy !== true,
  );

  const isStarted =
    event.finished === true ||
    (event.currentRound ?? 0) > 0 ||
    rounds.some((round) => round.length > 0);

  if (!isStarted) {
    return (
      <Card className="rounded-3xl border py-4 shadow-none">
        <CardContent className="px-4 sm:px-6">
          <h3 className="mb-4 text-base font-semibold">Registered Players</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead className="w-24 text-center">Division</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(event.players ?? {})
                .filter(([, player]) => !player.isDummy)
                .map(([uid, player]) => (
                  <TableRow key={uid}>
                    <TableCell className="font-medium">
                      {player.displayName ?? player.name ?? "Unknown"}
                    </TableCell>
                    <TableCell className="text-center">
                      {player.division ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}

              {!hasAnyPlayers && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No players registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const roundOrder = Array.from(
    { length: roundCount },
    (_, index) => roundCount - 1 - index,
  );

  return (
    <Tabs defaultValue="leaderboard">
      <div className="w-full overflow-x-auto pb-1">
        <TabsList className="min-w-max">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          {roundOrder.map((roundIndex) => (
            <TabsTrigger key={roundIndex} value={`round-${roundIndex}`}>
              Round {roundIndex + 1}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="leaderboard" className="mt-4">
        <Leaderboard rows={rows} isDoubles={isDoubles} />
      </TabsContent>

      {roundOrder.map((roundIndex) => (
        <TabsContent
          key={roundIndex}
          value={`round-${roundIndex}`}
          className="mt-4"
        >
          <RoundResults
            roundIndex={roundIndex}
            matches={rounds[roundIndex] ?? []}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
