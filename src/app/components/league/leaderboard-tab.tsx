"use client";

import { useMemo, useState } from "react";
import type { LeagueInstance, LeagueEvent } from "@/app/interfaces/league";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDataTransferVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

interface LeaderboardTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

const FORMAT_OPTIONS = [
  { value: "all", label: "All Formats" },
  { value: "stormputt", label: "StormPutt" },
  { value: "stormputt_doubles", label: "StormPutt Doubles" },
  { value: "stations", label: "Stations" },
  { value: "stations_doubles", label: "Stations Doubles" },
  { value: "cornhole", label: "Cornhole" },
  { value: "cornhole_doubles", label: "Cornhole Doubles" },
] as const;

function pointsForPlace(place: number): number {
  switch (place) {
    case 1:
      return 12;
    case 2:
      return 10;
    case 3:
      return 8;
    case 4:
      return 6;
    case 5:
      return 5;
    case 6:
      return 4;
    case 7:
      return 3;
    default:
      return 2;
  }
}

function matchesFormatFilter(event: LeagueEvent, filter: string): boolean {
  if (filter === "all") return true;
  const format = event.format;
  const mode = event.playerMode;
  switch (filter) {
    case "stormputt":
      return format === "stormputt" && mode !== "doubles";
    case "stormputt_doubles":
      return format === "stormputt" && mode === "doubles";
    case "stations":
      return format === "stations" && mode !== "doubles";
    case "stations_doubles":
      return format === "stations" && mode === "doubles";
    case "cornhole":
      return format === "cornhole" && mode !== "doubles";
    case "cornhole_doubles":
      return format === "cornhole" && mode === "doubles";
    default:
      return true;
  }
}

function roundHitsPutts(r: {
  hits?: number;
  putts?: number;
  hitsPerSequence?: number[];
  puttsPerSequence?: number[];
}): { hits: number; putts: number } {
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
  return { hits, putts };
}

interface PlayerStanding {
  uid: string;
  displayName: string;
  division?: string;
  eventsPlayed: number;
  eventWins: number;
  totalHits: number;
  totalPutts: number;
  hitPercent: number;
  points: number;
  pos: number;
}

const columns: ColumnDef<PlayerStanding>[] = [
  {
    accessorKey: "pos",
    header: "#",
    enableSorting: false,
    cell: ({ row }) => <div className="font-medium">{row.getValue("pos")}</div>,
  },
  {
    accessorKey: "displayName",
    header: "Player",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("displayName")}</div>
    ),
  },
  {
    accessorKey: "eventsPlayed",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end -mr-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Events
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          className="ml-1 size-3.5"
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("eventsPlayed")}</div>
    ),
  },
  {
    accessorKey: "eventWins",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end -mr-3 max-sm:hidden"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Wins
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          className="ml-1 size-3.5"
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right max-sm:hidden">
        {row.getValue("eventWins")}
      </div>
    ),
    meta: { className: "max-sm:hidden" },
  },
  {
    accessorKey: "totalPutts",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end -mr-3 max-sm:hidden"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Putts
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          className="ml-1 size-3.5"
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right max-sm:hidden">
        {row.getValue("totalPutts")}
      </div>
    ),
    meta: { className: "max-sm:hidden" },
  },
  {
    accessorKey: "hitPercent",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end -mr-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Hit%
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          className="ml-1 size-3.5"
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">{row.getValue<number>("hitPercent")}%</div>
    ),
  },
  {
    accessorKey: "points",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-end -mr-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Points
        <HugeiconsIcon
          icon={ArrowDataTransferVerticalIcon}
          className="ml-1 size-3.5"
        />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-bold">{row.getValue("points")}</div>
    ),
  },
];

export function LeaderboardTab({ league, seasonFilter }: LeaderboardTabProps) {
  const events = league.events ?? [];
  const [formatFilter, setFormatFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "points", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatFilterLabel =
    FORMAT_OPTIONS.find((o) => o.value === formatFilter)?.label ??
    "All Formats";

  // Collect available divisions across all events
  const availableDivisions = useMemo(() => {
    const divs = new Set<string>();
    if (league.divisions) {
      for (const d of league.divisions) divs.add(d.toUpperCase());
    }
    for (const event of events) {
      if (!event.players) continue;
      for (const pdata of Object.values(event.players)) {
        if (pdata.division) divs.add(pdata.division.toUpperCase());
      }
    }
    return Array.from(divs).sort();
  }, [events, league.divisions]);

  // Collect available formats from finished events
  const availableFormats = useMemo(() => {
    const fmts = new Set<string>();
    for (const event of events) {
      if (!event.finished) continue;
      if (event.format) {
        const key =
          event.playerMode === "doubles"
            ? `${event.format}_doubles`
            : event.format;
        fmts.add(key);
      }
    }
    return FORMAT_OPTIONS.filter((o) => o.value === "all" || fmts.has(o.value));
  }, [events]);

  const players = useMemo(() => {
    const finishedEvents = events.filter((e) => {
      if (!e.finished) return false;
      if (seasonFilter && e.seasonId && e.seasonId !== seasonFilter)
        return false;
      if (!matchesFormatFilter(e, formatFilter)) return false;
      return true;
    });

    if (finishedEvents.length === 0) return [];

    // Per-event: rank players by total hits, assign points
    const acc: Record<
      string,
      {
        name: string;
        division?: string;
        eventsPlayed: number;
        eventWins: number;
        totalHits: number;
        totalPutts: number;
        points: number;
      }
    > = {};

    for (const event of finishedEvents) {
      if (!event.players) continue;

      const isCornhole = event.format === "cornhole";
      const isDoubles = event.playerMode === "doubles";
      const eventScores: {
        uid: string;
        rankingValue: number;
        hits: number;
        putts: number;
        completed: boolean;
        name: string;
        division?: string;
      }[] = [];

      if (isCornhole && event.matches && event.matches.length > 0) {
        // Cornhole: build scores from matches
        const statsMap: Record<
          string,
          { wins: number; hits: number; putts: number }
        > = {};

        for (const match of event.matches) {
          const p1 = match.player1;
          const p2 = match.player2;
          if (p1.uid === "BYE" || p2.uid === "BYE") continue;

          const p1Score = p1.score ?? 0;
          const p2Score = p2.score ?? 0;

          for (const { side, won } of [
            { side: p1, won: p1Score > p2Score },
            { side: p2, won: p2Score > p1Score },
          ]) {
            if (isDoubles && side.members?.length) {
              for (const member of side.members) {
                if (!member.uid) continue;
                if (!statsMap[member.uid])
                  statsMap[member.uid] = { wins: 0, hits: 0, putts: 0 };
                if (won) statsMap[member.uid].wins++;
                statsMap[member.uid].hits +=
                  member.sequences?.reduce((a, b) => a + b, 0) ?? 0;
                statsMap[member.uid].putts +=
                  (member.sequences?.length ?? 0) * 2;
              }
            } else if (side.uid) {
              if (!statsMap[side.uid])
                statsMap[side.uid] = { wins: 0, hits: 0, putts: 0 };
              if (won) statsMap[side.uid].wins++;
              statsMap[side.uid].hits +=
                side.sequences?.reduce((a, b) => a + b, 0) ?? 0;
              statsMap[side.uid].putts += (side.sequences?.length ?? 0) * 2;
            }
          }
        }

        for (const [uid, stats] of Object.entries(statsMap)) {
          const pdata = event.players[uid];
          if (
            divisionFilter !== "all" &&
            (pdata?.division?.toUpperCase() ?? "") !== divisionFilter
          )
            continue;
          eventScores.push({
            uid,
            rankingValue: stats.wins,
            hits: stats.hits,
            putts: stats.putts,
            completed: true,
            name: pdata?.displayName || pdata?.name || uid,
            division: pdata?.division?.toUpperCase(),
          });
        }
      } else {
        // Standard: build scores from rounds
        for (const [uid, pdata] of Object.entries(event.players)) {
          if (
            divisionFilter !== "all" &&
            (pdata.division?.toUpperCase() ?? "") !== divisionFilter
          )
            continue;

          const name = pdata.displayName || pdata.name || uid;
          let sumHits = 0;
          let sumPutts = 0;
          let validCount = 0;

          if (pdata.rounds) {
            for (const r of pdata.rounds) {
              if (r.dns || r.dnf) continue;
              const { hits, putts } = roundHitsPutts(r);
              sumHits += hits;
              sumPutts += putts;
              validCount++;
            }
          }

          eventScores.push({
            uid,
            rankingValue: sumHits,
            hits: sumHits,
            putts: sumPutts,
            completed: validCount > 0,
            name,
            division: pdata.division?.toUpperCase(),
          });
        }
      }

      // Rank by rankingValue desc
      eventScores.sort((a, b) => b.rankingValue - a.rankingValue);
      let lastVal = -1;
      let lastPlace = 0;
      for (let i = 0; i < eventScores.length; i++) {
        if (i === 0) {
          lastPlace = 1;
        } else if (eventScores[i].rankingValue !== lastVal) {
          lastPlace = i + 1;
        }
        lastVal = eventScores[i].rankingValue;

        const s = eventScores[i];
        if (!s.completed) continue;

        const pts = pointsForPlace(lastPlace);

        if (!acc[s.uid]) {
          acc[s.uid] = {
            name: s.name,
            division: s.division,
            eventsPlayed: 0,
            eventWins: 0,
            totalHits: 0,
            totalPutts: 0,
            points: 0,
          };
        }

        acc[s.uid].eventsPlayed++;
        acc[s.uid].totalHits += s.hits;
        acc[s.uid].totalPutts += s.putts;
        acc[s.uid].points += pts;
        if (lastPlace === 1) acc[s.uid].eventWins++;
      }
    }

    // Build standings
    const standings: PlayerStanding[] = Object.entries(acc).map(([uid, d]) => ({
      uid,
      displayName: d.name,
      division: d.division,
      eventsPlayed: d.eventsPlayed,
      eventWins: d.eventWins,
      totalHits: d.totalHits,
      totalPutts: d.totalPutts,
      hitPercent:
        d.totalPutts > 0
          ? Math.round((d.totalHits / d.totalPutts) * 1000) / 10
          : 0,
      points: d.points,
      pos: 0,
    }));

    // Sort by points desc, then hit% desc for position assignment
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.hitPercent - a.hitPercent;
    });

    // Assign positions with ties
    for (let i = 0; i < standings.length; i++) {
      if (i === 0) {
        standings[i].pos = 1;
      } else {
        const prev = standings[i - 1];
        const curr = standings[i];
        standings[i].pos =
          curr.points === prev.points && curr.hitPercent === prev.hitPercent
            ? prev.pos
            : i + 1;
      }
    }

    return standings;
  }, [events, seasonFilter, formatFilter, divisionFilter]);

  const table = useReactTable({
    data: players,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue: string) =>
      row.original.displayName
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Search player..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-48"
        />

        {availableFormats.length > 2 && (
          <Select
            value={formatFilter}
            onValueChange={(v) => setFormatFilter(v ?? "all")}
          >
            <SelectTrigger size="sm">
              <SelectValue>{formatFilterLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableFormats.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {availableDivisions.length > 0 && (
          <Select
            value={divisionFilter}
            onValueChange={(v) => setDivisionFilter(v ?? "all")}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Divisions</SelectItem>
              {availableDivisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      (header.column.columnDef.meta as { className?: string })
                        ?.className ?? ""
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (cell.column.columnDef.meta as { className?: string })
                          ?.className ?? ""
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {players.length === 0
                    ? "No finished events with results yet."
                    : "No players match your search."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
