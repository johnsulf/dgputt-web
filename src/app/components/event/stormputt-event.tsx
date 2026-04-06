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
  type PlayerRow,
  NUM_DISTANCES,
  getDistanceLabels,
  computeTotals,
  computeRound,
} from "@/lib/stormputt-utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

function ResultsTable({
  rows,
  distanceLabels,
  showThru,
  totalRounds,
}: {
  rows: PlayerRow[];
  distanceLabels: { meter: string[]; feet: string[] };
  showThru?: boolean;
  totalRounds?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 z-10 w-10 bg-background text-center">
            #
          </TableHead>
          <TableHead className="sticky left-10 z-10 bg-background">
            Player
          </TableHead>
          {distanceLabels.meter.map((label, i) => (
            <TableHead key={i} className="w-14 text-center">
              <div>{label}</div>
              <div className="text-[10px] font-normal text-muted-foreground">
                {distanceLabels.feet[i]}
              </div>
            </TableHead>
          ))}
          {showThru && <TableHead className="w-14 text-center">Thru</TableHead>}
          <TableHead className="w-16 text-center">Hit%</TableHead>
          <TableHead className="w-14 text-center">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.uid}>
            <TableCell className="sticky left-0 z-10 bg-background text-center font-medium">
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
            <TableCell className="sticky left-10 z-10 bg-background font-medium">
              <div className="flex items-center gap-2">
                {row.name}
                {row.pdgaNumber && (
                  <a
                    href={`https://www.pdga.com/player/${row.pdgaNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                    style={{
                      background: "linear-gradient(to left, #008d6f, #003F6A)",
                    }}
                  >
                    #{row.pdgaNumber}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
                  </a>
                )}
              </div>
            </TableCell>
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
            {showThru && (
              <TableCell className="text-center text-muted-foreground">
                {row.dns ? "-" : `${row.roundsPlayed}/${totalRounds}`}
              </TableCell>
            )}
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
              colSpan={NUM_DISTANCES + 4 + (showThru ? 1 : 0)}
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

interface StormPuttEventProps {
  event: LeagueEvent;
}

export function StormPuttEvent({ event }: StormPuttEventProps) {
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

  const distanceLabels = useMemo(
    () => getDistanceLabels(event.dstIndex),
    [event.dstIndex],
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
    () => (hasStarted ? computeTotals(filteredPlayers) : []),
    [filteredPlayers, hasStarted],
  );

  const roundData = useMemo(
    () =>
      hasStarted
        ? Array.from({ length: maxRounds }, (_, i) =>
            computeRound(filteredPlayers, i),
          )
        : [],
    [filteredPlayers, maxRounds, hasStarted],
  );

  if (!hasStarted) {
    return <PlayersRegistrationTable players={players} />;
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

  // Only leaderboard when a single round
  if (maxRounds <= 1) {
    return (
      <div>
        {divisionFilter}
        <ResultsTable rows={totals} distanceLabels={distanceLabels} />
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
            distanceLabels={distanceLabels}
            showThru={maxRounds > 1}
            totalRounds={totalRounds}
          />
        </TabsContent>

        {roundData.map((rows, i) => (
          <TabsContent key={i} value={`round-${i}`} className="mt-4">
            <ResultsTable rows={rows} distanceLabels={distanceLabels} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
