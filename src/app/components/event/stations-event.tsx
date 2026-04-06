"use client";

import { useMemo, useState } from "react";
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
  getStationDistance,
  getDistanceUnit,
  computeStationsTotals,
  computeStationsRound,
} from "@/lib/stations-utils";

function ResultsTable({
  rows,
  stations,
  showWeight,
  distanceUnit,
  showThru,
  totalRounds,
}: {
  rows: StationsPlayerRow[];
  stations: StationDef[];
  showWeight: boolean;
  distanceUnit: string;
  showThru?: boolean;
  totalRounds?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10 text-center">#</TableHead>
          <TableHead>Player</TableHead>
          {showThru && (
            <TableHead className="w-14 text-center">Thru</TableHead>
          )}
          {stations.map((s, i) => {
            const dist = getStationDistance(s, distanceUnit);
            return (
              <TableHead key={s.key} className="w-14 text-center">
                <div>{getStationLabel(s, i)}</div>
                <div className="text-[10px] font-normal text-muted-foreground">
                  {dist ?? "\u00A0"}
                </div>
                {showWeight && (
                  <div className="text-[10px] font-normal text-muted-foreground">
                    {s.weight !== 1 ? `×${s.weight}` : "\u00A0"}
                  </div>
                )}
              </TableHead>
            );
          })}
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
            {showThru && (
              <TableCell className="text-center text-muted-foreground">
                {row.dns ? "-" : `${row.roundsPlayed}/${totalRounds}`}
              </TableCell>
            )}
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
              colSpan={stations.length + 4 + (showThru ? 1 : 0)}
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

  const divisions = useMemo(() => {
    const divs = new Set<string>();
    for (const player of Object.values(players)) {
      if (player.division) divs.add(player.division);
    }
    return Array.from(divs).sort();
  }, [players]);

  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);

  const filteredPlayers = useMemo(() => {
    if (!selectedDivision) return players;
    const filtered: Record<string, LeagueEventPlayer> = {};
    for (const [uid, player] of Object.entries(players)) {
      if (player.division === selectedDivision) {
        filtered[uid] = player;
      }
    }
    return filtered;
  }, [players, selectedDivision]);

  const stations = useMemo(() => getStations(event), [event]);
  const distanceUnit = useMemo(() => getDistanceUnit(event), [event]);
  const showWeight = useMemo(
    () => stations.some((s) => s.weight !== 1),
    [stations],
  );

  const maxRounds = useMemo(
    () =>
      Math.max(
        0,
        ...Object.values(filteredPlayers).map((p) => p.rounds?.length ?? 0),
      ),
    [filteredPlayers],
  );

  const totalRounds = event.rounds ?? maxRounds;

  const totals = useMemo(
    () => (hasStarted ? computeStationsTotals(filteredPlayers, stations) : []),
    [filteredPlayers, stations, hasStarted],
  );

  const roundData = useMemo(
    () =>
      hasStarted
        ? Array.from({ length: maxRounds }, (_, i) =>
            computeStationsRound(filteredPlayers, stations, i),
          )
        : [],
    [filteredPlayers, stations, maxRounds, hasStarted],
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

  const divisionFilter = divisions.length > 0 && (
    <div className="mb-4 flex flex-wrap gap-2">
      <Badge
        variant={selectedDivision === null ? "default" : "outline"}
        className="cursor-pointer"
        onClick={() => setSelectedDivision(null)}
      >
        All
      </Badge>
      {divisions.map((div) => (
        <Badge
          key={div}
          variant={selectedDivision === div ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedDivision(div)}
        >
          {div}
        </Badge>
      ))}
    </div>
  );

  if (maxRounds <= 1) {
    return (
      <div>
        {divisionFilter}
        <ResultsTable
          rows={totals}
          stations={stations}
          showWeight={showWeight}
          distanceUnit={distanceUnit}
        />
      </div>
    );
  }

  return (
    <div>
      {divisionFilter}
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
            distanceUnit={distanceUnit}
            showThru={maxRounds > 1}
            totalRounds={totalRounds}
          />
        </TabsContent>

        {roundData.map((rows, i) => (
          <TabsContent key={i} value={`round-${i}`} className="mt-4">
            <ResultsTable
              rows={rows}
              stations={stations}
              showWeight={showWeight}
              distanceUnit={distanceUnit}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
