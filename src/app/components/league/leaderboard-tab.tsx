"use client";

import { useMemo, useState } from "react";
import type { LeagueInstance } from "@/app/interfaces/league";
import {
  buildLeagueLeaderboard,
  getFinishedFormats,
} from "@/lib/league-leaderboard-utils";
import { formatLabel } from "@/lib/event-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

export function LeaderboardTab({ league, seasonFilter }: LeaderboardTabProps) {
  const [formatFilter, setFormatFilter] = useState<string | null>(null);

  const formats = useMemo(
    () => getFinishedFormats(league, seasonFilter),
    [league, seasonFilter],
  );

  const entries = useMemo(
    () =>
      buildLeagueLeaderboard(league, {
        seasonFilter,
        formatFilter,
      }),
    [league, seasonFilter, formatFilter],
  );

  const validRounds = league.validRounds ?? 10;
  const hasEvents = (league.events ?? []).some((e) => e.finished);

  if (!hasEvents) {
    return (
      <Alert>
        <AlertTitle>No finished events</AlertTitle>
        <AlertDescription>
          The leaderboard will appear once the first event is completed.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div>
      {formats.length > 1 && (
        <div className="mb-4">
          <Select
            value={formatFilter ?? "all"}
            onValueChange={(v) => setFormatFilter(v === "all" ? null : v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              {formats.map((f) => (
                <SelectItem key={f} value={f}>
                  {formatLabel(f)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="w-16 text-center">Events</TableHead>
            <TableHead className="w-16 text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => {
            const place = i + 1;
            // Handle ties — same points = same place
            const prevEntry = i > 0 ? entries[i - 1] : null;
            const displayPlace =
              prevEntry &&
              prevEntry.validPoints === entry.validPoints &&
              prevEntry.totalPoints === entry.totalPoints
                ? ""
                : place;

            return (
              <TableRow key={entry.uid}>
                <TableCell className="text-center font-medium">
                  {displayPlace}
                </TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {entry.eventCount}
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {entry.validPoints}
                  {entry.eventCount > validRounds &&
                    entry.totalPoints !== entry.validPoints && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({entry.totalPoints})
                      </span>
                    )}
                </TableCell>
              </TableRow>
            );
          })}
          {entries.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-muted-foreground"
              >
                No results for this filter.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
