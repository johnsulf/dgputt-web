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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

interface LeaderboardTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

const POINTS_TABLE = [
  { place: "1st", points: 12 },
  { place: "2nd", points: 10 },
  { place: "3rd", points: 8 },
  { place: "4th", points: 6 },
  { place: "5th", points: 5 },
  { place: "6th", points: 4 },
  { place: "7th", points: 3 },
  { place: "8th+", points: 2 },
];

function formatFilterLabel(format: string | null, formats: string[]): string {
  if (!format) return "All Formats";
  return formatLabel(format);
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
  const finishedCount = (league.events ?? []).filter((e) => {
    if (!e.finished) return false;
    if (seasonFilter && e.seasonId !== seasonFilter) return false;
    return true;
  }).length;

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
      <div className="mb-4 flex items-center gap-2">
        {formats.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  {formatFilterLabel(formatFilter, formats)}
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuRadioGroup
                value={formatFilter ?? "all"}
                onValueChange={(v) => setFormatFilter(v === "all" ? null : v)}
              >
                <DropdownMenuRadioItem value="all">
                  All Formats
                </DropdownMenuRadioItem>
                {formats.map((f) => (
                  <DropdownMenuRadioItem key={f} value={f}>
                    {formatLabel(f)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Badge variant="outline" className="text-xs">
          {validRounds >= finishedCount
            ? `${finishedCount} event${finishedCount !== 1 ? "s" : ""}`
            : `Best ${validRounds} of ${finishedCount} events`}
        </Badge>

        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
              >
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={16}
                  strokeWidth={2}
                />
                <span className="sr-only">Point system info</span>
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Point System</DialogTitle>
              <DialogDescription>
                Points are awarded based on placement in each event.
                {validRounds < finishedCount && (
                  <>
                    {" "}
                    Only the best {validRounds} event scores count towards the
                    leaderboard.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Place</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {POINTS_TABLE.map((row) => (
                  <TableRow key={row.place}>
                    <TableCell className="font-medium">{row.place}</TableCell>
                    <TableCell className="text-right">{row.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="mt-2 text-xs text-muted-foreground">
              Players who do not complete the event receive 0 points. In doubles
              events, both team members receive the team&apos;s placement
              points.
            </p>
          </DialogContent>
        </Dialog>
      </div>

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
