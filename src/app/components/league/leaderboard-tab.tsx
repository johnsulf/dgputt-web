"use client";

import { useMemo } from "react";
import type { LeagueInstance } from "@/app/interfaces/league";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

interface PlayerScore {
  uid: string;
  displayName: string;
  totalHits: number;
  totalPutts: number;
  roundCount: number;
  avgHits: number;
  avgPercent: number;
  bestHits: number;
  bestPercent: number;
  pos: number;
}

export function LeaderboardTab({ league, seasonFilter }: LeaderboardTabProps) {
  const validRounds = league.validRounds ?? 10;
  const events = league.events ?? [];

  const players = useMemo(() => {
    const finishedEvents = events.filter((e) => {
      if (!e.finished) return false;
      if (
        seasonFilter &&
        e.seasonId &&
        e.seasonId !== seasonFilter
      )
        return false;
      return true;
    });

    if (finishedEvents.length === 0) return [];

    // Aggregate all rounds per player
    const playerRounds: Record<
      string,
      { name: string; rounds: { hits: number; putts: number }[] }
    > = {};

    for (const event of finishedEvents) {
      if (!event.players) continue;

      for (const [uid, pdata] of Object.entries(event.players)) {
        if (!pdata.rounds) continue;

        const name = pdata.displayName || pdata.name || uid;
        if (!playerRounds[uid]) {
          playerRounds[uid] = { name, rounds: [] };
        }

        for (const r of pdata.rounds) {
          if (r.dns || r.dnf) continue;

          let hits = 0;
          let putts = 0;

          if (r.hitsPerSequence && r.hitsPerSequence.length > 0) {
            hits = r.hitsPerSequence.reduce((a, b) => a + b, 0);
          } else {
            hits = r.hits ?? 0;
          }

          if (r.puttsPerSequence && r.puttsPerSequence.length > 0) {
            putts = r.puttsPerSequence.reduce((a, b) => a + b, 0);
          } else if (r.hitsPerSequence && r.hitsPerSequence.length > 0) {
            putts = r.hitsPerSequence.length * 2;
          } else {
            putts = r.putts ?? 0;
          }

          playerRounds[uid].rounds.push({ hits, putts });
        }
      }
    }

    // Build scores
    const scores: PlayerScore[] = [];
    for (const [uid, data] of Object.entries(playerRounds)) {
      const sorted = [...data.rounds].sort((a, b) => b.hits - a.hits);
      const valid = sorted.slice(0, validRounds);

      if (valid.length === 0) continue;

      const totalHits = valid.reduce((s, r) => s + r.hits, 0);
      const totalPutts = valid.reduce((s, r) => s + r.putts, 0);
      const avgHits = totalHits / valid.length;
      const avgPercent = totalPutts > 0 ? (totalHits / totalPutts) * 100 : 0;
      const best = valid[0];
      const bestPercent =
        best.putts > 0 ? (best.hits / best.putts) * 100 : 0;

      scores.push({
        uid,
        displayName: data.name,
        totalHits,
        totalPutts,
        roundCount: data.rounds.length,
        avgHits: Math.round(avgHits * 10) / 10,
        avgPercent: Math.round(avgPercent * 10) / 10,
        bestHits: best.hits,
        bestPercent: Math.round(bestPercent),
        pos: 0,
      });
    }

    // Sort by total hits desc
    scores.sort((a, b) => b.totalHits - a.totalHits);

    // Assign positions with ties
    for (let i = 0; i < scores.length; i++) {
      if (i === 0) {
        scores[i].pos = 1;
      } else if (scores[i].totalHits === scores[i - 1].totalHits) {
        scores[i].pos = scores[i - 1].pos;
      } else {
        scores[i].pos = i + 1;
      }
    }

    return scores;
  }, [events, validRounds, seasonFilter]);

  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">
          No finished events with results yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Scores</AlertTitle>
        <AlertDescription>
          Best {validRounds} rounds per player. Full standings and stats views
          coming soon.
        </AlertDescription>
      </Alert>

      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Rounds</TableHead>
              <TableHead className="text-right">Best {validRounds}</TableHead>
              <TableHead className="text-right max-sm:hidden">
                Avg Hits
              </TableHead>
              <TableHead className="text-right max-sm:hidden">
                Avg %
              </TableHead>
              <TableHead className="text-right max-sm:hidden">
                Best Round
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p) => (
              <TableRow key={p.uid}>
                <TableCell className="font-medium">{p.pos}</TableCell>
                <TableCell className="font-medium">{p.displayName}</TableCell>
                <TableCell className="text-right">{p.roundCount}</TableCell>
                <TableCell className="text-right font-bold">
                  {p.totalHits}
                </TableCell>
                <TableCell className="text-right max-sm:hidden">
                  {p.avgHits}
                </TableCell>
                <TableCell className="text-right max-sm:hidden">
                  {p.avgPercent}%
                </TableCell>
                <TableCell className="text-right max-sm:hidden">
                  {p.bestHits} ({p.bestPercent}%)
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
