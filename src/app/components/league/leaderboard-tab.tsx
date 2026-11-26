"use client";

import { useMemo, useState } from "react";
import type { LeagueInstance } from "@/app/interfaces/league";
import {
  buildLeagueLeaderboard,
  standingsCutoff,
} from "@/lib/league-leaderboard-utils";
import { pointsTable, STANDARD_POINTS_SYSTEM } from "@/lib/points-system";
import {
  getAvailableScoreFormat,
  getScoreFormats,
  buildCornholeScores,
  buildRoundScores,
  isCornholeScore,
  scoreFormatLabel,
  type CornholeScoreRow,
  type RoundScoreRow,
  type ScoreFormat,
} from "@/lib/league-scores-utils";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
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

type Mode = "standings" | "scores";

function matchesSearch(name: string, search: string): boolean {
  return name.toLowerCase().includes(search.trim().toLowerCase());
}

function formatPct(fraction: number): string {
  return fraction < 0 ? "-" : `${Math.round(fraction * 100)}%`;
}

/** Ranked table: the rows arrive best first, the # column keeps that rank. */
function RankedTable<T extends { position: number; name: string }>({
  data,
  columns,
  initialSort,
}: {
  data: T[];
  columns: ColumnDef<T>[];
  initialSort: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: initialSort, desc: true },
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
  });

  return (
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
  );
}

const positionColumn = <T extends { position: number }>(): ColumnDef<T> => ({
  accessorKey: "position",
  header: "#",
  enableSorting: false,
  cell: ({ row }) => (
    <span className="font-medium">{row.original.position}</span>
  ),
});

const nameColumn = <T extends { name: string }>(): ColumnDef<T> => ({
  accessorKey: "name",
  header: "Player",
  enableSorting: false,
  cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
});

function FormatDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            {label}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function InfoDialog({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="size-7 rounded-full">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={16}
              strokeWidth={2}
            />
            <span className="sr-only">{title}</span>
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

interface StandingsRow {
  position: number;
  name: string;
  events: number;
  wins: number;
  seconds: number;
  thirds: number;
  hitPct: number;
  points: number;
}

const standingsColumns: ColumnDef<StandingsRow>[] = [
  positionColumn<StandingsRow>(),
  nameColumn<StandingsRow>(),
  { accessorKey: "events", header: "Events", enableSorting: true },
  { accessorKey: "wins", header: "🥇", enableSorting: true },
  { accessorKey: "seconds", header: "🥈", enableSorting: true },
  { accessorKey: "thirds", header: "🥉", enableSorting: true },
  {
    accessorKey: "hitPct",
    header: "Hit %",
    enableSorting: true,
    cell: ({ row }) => formatPct(row.original.hitPct),
  },
  {
    accessorKey: "points",
    header: "Points",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.points}</span>
    ),
  },
];

function StandingsView({
  league,
  seasonFilter,
  search,
  modeToggle,
}: ViewProps) {
  const [pickedFormat, setPickedFormat] = useState<ScoreFormat | null>(null);
  const formats = useMemo(
    () => getScoreFormats(league, seasonFilter),
    [league, seasonFilter],
  );
  const formatFilter = getAvailableScoreFormat(formats, pickedFormat) ?? null;
  const system = league.pointsSystem ?? STANDARD_POINTS_SYSTEM;
  // Places that earn no more than the floor are shown as one "N+" row.
  const table = pointsTable(system).filter((points) => points > system.floor);
  const { counting, total } = useMemo(
    () => standingsCutoff(league, { seasonFilter, formatFilter }),
    [league, seasonFilter, formatFilter],
  );

  const entries = useMemo(
    () => buildLeagueLeaderboard(league, { seasonFilter, formatFilter }),
    [league, seasonFilter, formatFilter],
  );

  const data = useMemo<StandingsRow[]>(
    () =>
      entries
        .map((entry, i) => ({
          position: i + 1,
          name: entry.name,
          events: entry.eventCount,
          wins: entry.wins,
          seconds: entry.seconds,
          thirds: entry.thirds,
          hitPct: entry.hitPct,
          points: entry.totalPoints,
        }))
        .filter((r) => matchesSearch(r.name, search)),
    [entries, search],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {modeToggle}
        {formats.length > 0 && (
          <FormatDropdown
            label={
              formatFilter ? scoreFormatLabel(formatFilter) : "All Formats"
            }
            value={formatFilter ?? "all"}
            onChange={(v) =>
              setPickedFormat(v === "all" ? null : (v as ScoreFormat))
            }
            options={[
              { value: "all", label: "All Formats" },
              ...formats.map((f) => ({ value: f, label: scoreFormatLabel(f) })),
            ]}
          />
        )}
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {counting == null
              ? `All ${total} events count`
              : `Best ${counting} of ${total} events`}
          </Badge>
          <InfoDialog
            title="Point System"
            description={`Points are awarded by placement in each event${
              counting == null
                ? ". Every event counts."
                : `. Only each player's best ${counting} of ${total} events count.`
            }`}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Place</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.map((points, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell className="text-right">{points}</TableCell>
                  </TableRow>
                ))}
                {system.floor > 0 && (
                  <TableRow>
                    <TableCell className="font-medium">
                      {table.length + 1}+
                    </TableCell>
                    <TableCell className="text-right">{system.floor}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <p className="mt-2 text-xs text-muted-foreground">
              Players who do not complete the event receive 0 points. In doubles
              events, both team members receive the team&apos;s placement
              points. Selecting a format counts every finished event in that
              format.
            </p>
          </InfoDialog>
        </div>
      </div>
      <RankedTable
        data={data}
        columns={standingsColumns}
        initialSort="points"
      />
    </>
  );
}

type CornholeTableRow = CornholeScoreRow & { position: number };
type RoundTableRow = RoundScoreRow & { position: number };

const cornholeColumns: ColumnDef<CornholeTableRow>[] = [
  positionColumn<CornholeTableRow>(),
  nameColumn<CornholeTableRow>(),
  { accessorKey: "played", header: "Played", enableSorting: true },
  {
    accessorKey: "won",
    header: "Won",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.won}</span>
    ),
  },
  { accessorKey: "lost", header: "Lost", enableSorting: true },
  {
    accessorKey: "hitPct",
    header: "Hit %",
    enableSorting: true,
    cell: ({ row }) => formatPct(row.original.hitPct),
  },
];

function ScoresView({ league, seasonFilter, search, modeToggle }: ViewProps) {
  const validRounds = league.validRounds ?? 10;
  const formats = useMemo(
    () => getScoreFormats(league, seasonFilter),
    [league, seasonFilter],
  );
  const [picked, setPicked] = useState<ScoreFormat | null>(null);
  // Fall back to the first format when the pick has no events (season change).
  const format = getAvailableScoreFormat(formats, picked) ?? formats[0];

  const cornhole = format ? isCornholeScore(format) : false;

  const cornholeData = useMemo<CornholeTableRow[]>(
    () =>
      format && cornhole
        ? buildCornholeScores(league, format, seasonFilter)
            .map((r, i) => ({ ...r, position: i + 1 }))
            .filter((r) => matchesSearch(r.name, search))
        : [],
    [league, format, cornhole, seasonFilter, search],
  );

  const roundData = useMemo<RoundTableRow[]>(
    () =>
      format && !cornhole
        ? buildRoundScores(league, format, seasonFilter)
            .map((r, i) => ({ ...r, position: i + 1 }))
            .filter((r) => matchesSearch(r.name, search))
        : [],
    [league, format, cornhole, seasonFilter, search],
  );

  const roundColumns = useMemo<ColumnDef<RoundTableRow>[]>(
    () => [
      positionColumn<RoundTableRow>(),
      nameColumn<RoundTableRow>(),
      { accessorKey: "rounds", header: "Rounds", enableSorting: true },
      { accessorKey: "hits", header: "Hits", enableSorting: true },
      {
        accessorKey: "hitPct",
        header: "Hit %",
        enableSorting: true,
        cell: ({ row }) => `${Math.round(row.original.hitPct)}%`,
      },
      {
        accessorKey: "bestHits",
        header: `Best ${validRounds}`,
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.bestHits}</span>
        ),
      },
    ],
    [validRounds],
  );

  if (!format) {
    return (
      <>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {modeToggle}
        </div>
        <Alert>
          <AlertTitle>No scores yet</AlertTitle>
          <AlertDescription>
            Scores will appear once an event in this season is finished.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {modeToggle}
        {formats.length > 1 && (
          <FormatDropdown
            label={scoreFormatLabel(format)}
            value={format}
            onChange={(v) => setPicked(v as ScoreFormat)}
            options={formats.map((f) => ({
              value: f,
              label: scoreFormatLabel(f),
            }))}
          />
        )}
        <div className="ml-auto flex items-center gap-2">
          {!cornhole && (
            <Badge variant="outline" className="text-xs">
              Best {validRounds} rounds
            </Badge>
          )}
          <InfoDialog
            title="Scores"
            description={
              cornhole
                ? "Ranked by matches won, then hit percentage. Byes are not counted as played matches."
                : `Ranked by hits in the best ${validRounds} rounds across all events. Hits and Hit % cover every round played.`
            }
          >
            <p className="text-xs text-muted-foreground">
              {cornhole
                ? "Hit % is bags landed in the hole as a share of bags thrown."
                : "The number of rounds that count is set in the league settings."}
            </p>
          </InfoDialog>
        </div>
      </div>
      {cornhole ? (
        <RankedTable
          data={cornholeData}
          columns={cornholeColumns}
          initialSort="won"
        />
      ) : (
        <RankedTable
          data={roundData}
          columns={roundColumns}
          initialSort="bestHits"
        />
      )}
    </>
  );
}

interface ViewProps {
  league: LeagueInstance;
  seasonFilter: string | null;
  search: string;
  modeToggle: React.ReactNode;
}

export function LeaderboardTab({ league, seasonFilter }: LeaderboardTabProps) {
  const [mode, setMode] = useState<Mode>("standings");
  const [search, setSearch] = useState("");

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

  const modeToggle = (
    <>
      <Input
        placeholder="Search player..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-9 w-48"
      />
      <div className="inline-flex rounded-full border p-0.5">
        {(["standings", "scores"] as const).map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={mode === m ? "default" : "ghost"}
            className="h-7 rounded-full"
            onClick={() => setMode(m)}
          >
            {m === "standings" ? "Standings" : "Scores"}
          </Button>
        ))}
      </div>
    </>
  );

  const View = mode === "standings" ? StandingsView : ScoresView;
  return (
    <div>
      <View
        league={league}
        seasonFilter={seasonFilter}
        search={search}
        modeToggle={modeToggle}
      />
    </div>
  );
}
