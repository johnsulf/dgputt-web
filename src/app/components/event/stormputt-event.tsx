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

const METER_DST_NORMAL = ["5m", "6m", "7m", "8m", "9m", "10m"];
const FEET_DST_NORMAL = ["16ft", "20ft", "23ft", "26ft", "30ft", "33ft"];
const METER_DST_LONG = ["10m", "11m", "12m", "13m", "14m", "15m"];
const FEET_DST_LONG = ["33ft", "36ft", "40ft", "43ft", "46ft", "50ft"];

function getDistanceLabels(dstIndex?: number): {
  meter: string[];
  feet: string[];
} {
  if (dstIndex === 1) return { meter: METER_DST_LONG, feet: FEET_DST_LONG };
  return { meter: METER_DST_NORMAL, feet: FEET_DST_NORMAL };
}

interface PlayerRow {
  uid: string;
  name: string;
  place: number;
  distances: number[];
  distancePutts: number[];
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
      const distancePutts = Array.from({ length: NUM_DISTANCES }, () => 0);
      let totalHits = 0;
      let totalPutts = 0;

      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        const hps = round.hitsPerSequence ?? [];
        const pps = round.puttsPerSequence ?? [];
        for (let i = 0; i < NUM_DISTANCES; i++) {
          distances[i] += hps[i] ?? 0;
          distancePutts[i] += pps[i] ?? 0;
        }
        totalHits += round.hits ?? 0;
        totalPutts += round.putts ?? 0;
      }

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        distances,
        distancePutts,
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
          distancePutts: Array.from({ length: NUM_DISTANCES }, () => 0),
          hits: 0,
          putts: 0,
          hitPercent: 0,
          dns,
        };
      }

      const hps = round.hitsPerSequence ?? [];
      const pps = round.puttsPerSequence ?? [];
      const distances = Array.from(
        { length: NUM_DISTANCES },
        (_, i) => hps[i] ?? 0,
      );
      const distancePutts = Array.from(
        { length: NUM_DISTANCES },
        (_, i) => pps[i] ?? 0,
      );

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        distances,
        distancePutts,
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

function ResultsTable({
  rows,
  distanceLabels,
}: {
  rows: PlayerRow[];
  distanceLabels: { meter: string[]; feet: string[] };
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          {distanceLabels.meter.map((label, i) => (
            <TableHead key={i} className="w-14 text-center">
              <div>{label}</div>
              <div className="text-[10px] font-normal text-muted-foreground">
                {distanceLabels.feet[i]}
              </div>
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
            {row.distances.map((d, i) => {
              const p = row.distancePutts[i] ?? 0;
              const pct = p > 0 ? (d / p) * 100 : 0;
              return (
                <TableCell key={i} className="text-center">
                  {row.dns ? (
                    "-"
                  ) : (
                    <div>
                      <span>{d}</span>
                      {p > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          {pct.toFixed(0)}%
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>
              );
            })}
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

  const distanceLabels = useMemo(
    () => getDistanceLabels(event.dstIndex),
    [event.dstIndex],
  );

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

  // Only totals when a single round
  if (maxRounds <= 1) {
    return <ResultsTable rows={totals} distanceLabels={distanceLabels} />;
  }

  return (
    <Tabs defaultValue="totals">
      <TabsList>
        <TabsTrigger value="totals">Totals</TabsTrigger>
        {Array.from({ length: maxRounds }, (_, i) => {
          const roundNum = maxRounds - i;
          return (
            <TabsTrigger key={roundNum} value={`round-${roundNum - 1}`}>
              Round {roundNum}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="totals" className="mt-4">
        <ResultsTable rows={totals} distanceLabels={distanceLabels} />
      </TabsContent>

      {roundData.map((rows, i) => (
        <TabsContent key={i} value={`round-${i}`} className="mt-4">
          <ResultsTable rows={rows} distanceLabels={distanceLabels} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
