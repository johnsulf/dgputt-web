"use client";

import { useMemo, useState } from "react";
import type { LeagueInstance } from "@/app/interfaces/league";
import {
  buildLeagueLeaderboard,
  getFinishedFormats,
  type LeaderboardEntry,
} from "@/lib/league-leaderboard-utils";
import { formatLabel } from "@/lib/event-utils";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { Input } from "@/components/ui/input";
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

interface TableRow_ {
  position: number;
  name: string;
  events: number;
  wins: number;
  seconds: number;
  thirds: number;
  points: number;
  totalPoints: number;
}

function formatFilterLabel(format: string | null): string {
  if (!format) return "All Formats";
  return formatLabel(format);
}

export function LeaderboardTab({ league, seasonFilter }: LeaderboardTabProps) {
  const [formatFilter, setFormatFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: true },
  ]);

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

  const tableData = useMemo<TableRow_[]>(
    () =>
      entries.map((entry, i) => ({
        position: i + 1,
        name: entry.name,
        events: entry.eventCount,
        wins: entry.wins,
        seconds: entry.seconds,
        thirds: entry.thirds,
        points: entry.validPoints,
        totalPoints: entry.totalPoints,
      })),
    [entries],
  );

  const columns = useMemo<ColumnDef<TableRow_>[]>(
    () => [
      {
        accessorKey: "position",
        header: "#",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.position}</span>
        ),
      },
      {
        accessorKey: "name",
        header: "Player",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "events",
        header: "Events",
        enableSorting: true,
      },
      {
        accessorKey: "wins",
        header: "🥇",
        enableSorting: true,
      },
      {
        accessorKey: "seconds",
        header: "🥈",
        enableSorting: true,
      },
      {
        accessorKey: "thirds",
        header: "🥉",
        enableSorting: true,
      },
      {
        accessorKey: "points",
        header: "Points",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-semibold">
            {row.original.points}
            {row.original.events > validRounds &&
              row.original.totalPoints !== row.original.points && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({row.original.totalPoints})
                </span>
              )}
          </span>
        ),
      },
    ],
    [validRounds],
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableSortingRemoval: false,
  });

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
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search player..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="h-9 w-48"
        />
        {formats.length > 1 && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="sm">
                  {formatFilterLabel(formatFilter)}
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

        <div className="ml-auto flex items-center gap-2">
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
                Players who do not complete the event receive 0 points. In
                doubles events, both team members receive the team&apos;s
                placement points.
              </p>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortState = header.column.getIsSorted();
                const isCentered = header.id !== "name";
                return (
                  <TableHead
                    key={header.id}
                    className={
                      header.id === "position"
                        ? "w-10 text-center"
                        : header.id === "name"
                          ? undefined
                          : "w-16 text-center"
                    }
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        className={`inline-flex items-center gap-1 ${isCentered ? "mx-auto" : ""}`}
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
                    cell.column.id !== "name" ? "text-center" : undefined
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
