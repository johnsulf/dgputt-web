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
  type StationDef,
  type StationsPlayerRow,
  getStations,
  getStationLabel,
  computeStationsTotals,
  computeStationsRound,
} from "@/lib/stations-utils";

function ResultsTable({
  rows,
  stations,
  showWeight,
}: {
  rows: StationsPlayerRow[];
  stations: StationDef[];
  showWeight: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          {stations.map((s, i) => (
            <TableHead key={s.key} className="w-14 text-center">
              <div>{getStationLabel(s, i)}</div>
              {showWeight && s.weight !== 1 && (
                <div className="text-[10px] font-normal text-muted-foreground">
                  ×{s.weight}
                </div>
              )}
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
            {row.stationHits.map((h, i) => {
              const p = row.stationPutts[i] ?? 0;
              const score = row.stationScores[i] ?? 0;
              return (
                <TableCell key={i} className="text-center">
                  {row.dns ? (
                    "-"
                  ) : (
                    <div>
                      <span>{score}</span>
                      {p > 0 && (
                        <div className="text-[10px] text-muted-foreground">
                          {h}/{p}
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
              {row.dns ? "-" : row.totalScore}
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={stations.length + 4}
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

interface StationsEventProps {
  event: LeagueEvent;
}

export function StationsEvent({ event }: StationsEventProps) {
  const players = event.players ?? {};
  const hasStarted = (event.currentRound ?? 0) > 0 || event.finished;

  const stations = useMemo(() => getStations(event), [event]);
  const showWeight = useMemo(
    () => stations.some((s) => s.weight !== 1),
    [stations],
  );

  const maxRounds = useMemo(
    () =>
      Math.max(0, ...Object.values(players).map((p) => p.rounds?.length ?? 0)),
    [players],
  );

  const totals = useMemo(
    () => (hasStarted ? computeStationsTotals(players, stations) : []),
    [players, stations, hasStarted],
  );

  const roundData = useMemo(
    () =>
      hasStarted
        ? Array.from({ length: maxRounds }, (_, i) =>
            computeStationsRound(players, stations, i),
          )
        : [],
    [players, stations, maxRounds, hasStarted],
  );

  if (!hasStarted) {
    return <PlayersRegistrationTable players={players} />;
  }

  if (stations.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No stations configured for this event.
      </p>
    );
  }

  if (maxRounds <= 1) {
    return (
      <ResultsTable rows={totals} stations={stations} showWeight={showWeight} />
    );
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
        <ResultsTable
          rows={totals}
          stations={stations}
          showWeight={showWeight}
        />
      </TabsContent>

      {roundData.map((rows, i) => (
        <TabsContent key={i} value={`round-${i}`} className="mt-4">
          <ResultsTable
            rows={rows}
            stations={stations}
            showWeight={showWeight}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
