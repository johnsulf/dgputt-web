"use client";

import { useMemo } from "react";
import type { LeagueEvent, LeagueEventPlayer } from "@/app/interfaces/league";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlayerRow {
  uid: string;
  name: string;
  place: number;
  distances: number[];
  hits: number;
  putts: number;
  hitPercent: number;
  dns?: boolean;
  dnf?: boolean;
}

const NUM_DISTANCES = 6;

function computeTotals(
  players: Record<string, LeagueEventPlayer>,
): PlayerRow[] {
  const rows: Omit<PlayerRow, "place">[] = Object.entries(players)
    .filter(([, p]) => p.isDummy !== true)
    .map(([uid, player]) => {
      const distances = Array.from({ length: NUM_DISTANCES }, () => 0);
      let totalHits = 0;
      let totalPutts = 0;

      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        const hps = round.hitsPerSequence ?? [];
        for (let i = 0; i < NUM_DISTANCES; i++) {
          distances[i] += hps[i] ?? 0;
        }
        totalHits += round.hits ?? 0;
        totalPutts += round.putts ?? 0;
      }

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        distances,
        hits: totalHits,
        putts: totalPutts,
        hitPercent: totalPutts > 0 ? (totalHits / totalPutts) * 100 : 0,
      };
    })
    .sort((a, b) => b.hits - a.hits || b.hitPercent - a.hitPercent);

  return assignPlaces(rows);
}

function computeRound(
  players: Record<string, LeagueEventPlayer>,
  roundIndex: number,
): PlayerRow[] {
  const rows: Omit<PlayerRow, "place">[] = Object.entries(players)
    .filter(([, p]) => p.isDummy !== true)
    .map(([uid, player]) => {
      const round = player.rounds?.[roundIndex];
      const dns = round?.dns === true;
      const dnf = round?.dnf === true;

      if (!round || dns) {
        return {
          uid,
          name: player.displayName ?? player.name ?? "Unknown",
          distances: Array.from({ length: NUM_DISTANCES }, () => 0),
          hits: 0,
          putts: 0,
          hitPercent: 0,
          dns,
        };
      }

      const hps = round.hitsPerSequence ?? [];
      const distances = Array.from(
        { length: NUM_DISTANCES },
        (_, i) => hps[i] ?? 0,
      );

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        distances,
        hits: round.hits ?? 0,
        putts: round.putts ?? 0,
        hitPercent:
          (round.putts ?? 0) > 0
            ? ((round.hits ?? 0) / (round.putts ?? 0)) * 100
            : 0,
        dns,
        dnf,
      };
    })
    .sort((a, b) => {
      if (a.dns || a.dnf) return 1;
      if (b.dns || b.dnf) return -1;
      return b.hits - a.hits || b.hitPercent - a.hitPercent;
    });

  return assignPlaces(rows);
}

function assignPlaces(rows: Omit<PlayerRow, "place">[]): PlayerRow[] {
  let currentPlace = 1;
  return rows.map((row, i) => {
    if (row.dns || row.dnf) return { ...row, place: 0 };
    if (
      i > 0 &&
      !rows[i - 1].dns &&
      !rows[i - 1].dnf &&
      (row.hits !== rows[i - 1].hits ||
        row.hitPercent !== rows[i - 1].hitPercent)
    ) {
      currentPlace = i + 1;
    }
    return { ...row, place: currentPlace };
  });
}

function ResultsTable({ rows }: { rows: PlayerRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          {Array.from({ length: NUM_DISTANCES }, (_, i) => (
            <TableHead key={i} className="w-10 text-center">
              D{i + 1}
            </TableHead>
          ))}
          <TableHead className="w-16 text-center">Hit%</TableHead>
          <TableHead className="w-14 text-center">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.uid}>
            <TableCell className="text-center font-medium">
              {row.dns ? (
                <Badge variant="outline" className="text-xs">
                  DNS
                </Badge>
              ) : row.dnf ? (
                <Badge variant="destructive" className="text-xs">
                  DNF
                </Badge>
              ) : (
                row.place
              )}
            </TableCell>
            <TableCell className="font-medium">{row.name}</TableCell>
            {row.distances.map((d, i) => (
              <TableCell key={i} className="text-center">
                {row.dns ? "-" : d}
              </TableCell>
            ))}
            <TableCell className="text-center">
              {row.dns ? "-" : `${row.hitPercent.toFixed(1)}%`}
            </TableCell>
            <TableCell className="text-center font-semibold">
              {row.dns ? "-" : row.hits}
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={NUM_DISTANCES + 4}
              className="py-8 text-center text-muted-foreground"
            >
              No results yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function PlayersRegistrationTable({
  players,
}: {
  players: Record<string, LeagueEventPlayer>;
}) {
  const rows = Object.entries(players)
    .filter(([, p]) => p.isDummy !== true)
    .map(([uid, p]) => ({
      uid,
      name: p.displayName ?? p.name ?? "Unknown",
      pdgaNumber: p.pdgaNumber,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <h3 className="mb-3 font-semibold">Registered Players</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="w-28">PDGA#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.uid}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.pdgaNumber ?? "-"}</TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={2}
                className="py-8 text-center text-muted-foreground"
              >
                No players registered yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface StormPuttEventProps {
  event: LeagueEvent;
}

export function StormPuttEvent({ event }: StormPuttEventProps) {
  const players = event.players ?? {};

  const hasStarted = (event.currentRound ?? 0) > 0 || event.finished;

  const maxRounds = useMemo(
    () =>
      Math.max(0, ...Object.values(players).map((p) => p.rounds?.length ?? 0)),
    [players],
  );

  const totals = useMemo(
    () => (hasStarted ? computeTotals(players) : []),
    [players, hasStarted],
  );

  const roundData = useMemo(
    () =>
      hasStarted
        ? Array.from({ length: maxRounds }, (_, i) => computeRound(players, i))
        : [],
    [players, maxRounds, hasStarted],
  );

  if (!hasStarted) {
    return <PlayersRegistrationTable players={players} />;
  }

  return (
    <Tabs defaultValue="totals">
      <TabsList>
        <TabsTrigger value="totals">Totals</TabsTrigger>
        {Array.from({ length: maxRounds }, (_, i) => (
          <TabsTrigger key={i} value={`round-${i}`}>
            Round {i + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="totals" className="mt-4">
        <ResultsTable rows={totals} />
      </TabsContent>

      {roundData.map((rows, i) => (
        <TabsContent key={i} value={`round-${i}`} className="mt-4">
          <ResultsTable rows={rows} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
