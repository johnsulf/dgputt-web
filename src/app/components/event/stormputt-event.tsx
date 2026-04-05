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
import {
  type PlayerRow,
  NUM_DISTANCES,
  getDistanceLabels,
  computeTotals,
  computeRound,
} from "@/lib/stormputt-utils";

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

  // Only leaderboard when a single round
  if (maxRounds <= 1) {
    return <ResultsTable rows={totals} distanceLabels={distanceLabels} />;
  }

  return (
    <Tabs defaultValue="leaderboard">
      <TabsList>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        {Array.from({ length: maxRounds }, (_, i) => {
          const roundNum = maxRounds - i;
          return (
            <TabsTrigger key={roundNum} value={`round-${roundNum - 1}`}>
              Round {roundNum}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="leaderboard" className="mt-4">
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
