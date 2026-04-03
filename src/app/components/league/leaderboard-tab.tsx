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
      const isStormputtOrStations =
        event.format === "stormputt" || event.format === "stations";

      // Build member-to-team mapping for doubles events
      const memberToTeam: Record<string, string> = {};
      const teamMembers: Record<string, string[]> = {};
      if (isDoubles) {
        for (const [uid, pdata] of Object.entries(event.players)) {
          const teamId = pdata.pairId?.trim() || uid;
          memberToTeam[uid] = teamId;
          if (!teamMembers[teamId]) teamMembers[teamId] = [];
          teamMembers[teamId].push(uid);
        }
      }

      // Per-uid stats for this event
      const uidHits: Record<string, number> = {};
      const uidPutts: Record<string, number> = {};
      const uidCompleted: Record<string, boolean> = {};
      const uidNames: Record<string, string> = {};
      const uidDivisions: Record<string, string | undefined> = {};
      // uid → event place
      const eventPlaces: Record<string, number> = {};

      if (isCornhole && event.matches && event.matches.length > 0) {
        // Cornhole: derive all stats from matches
        const winsRanking: Record<string, number> = {}; // includes BYE
        const matchesPointsOnly: Record<string, number> = {}; // non-BYE
        const diffs: Record<string, number> = {};
        const evHits: Record<string, number> = {};
        const evAttempts: Record<string, number> = {};

        const addSeqStats = (uid: string, seq?: number[]) => {
          if (!uid || uid === "BYE" || !seq) return;
          let h = 0,
            a = 0;
          for (const raw of seq) {
            const v = typeof raw === "number" ? raw : 0;
            if (v < 0 || v > 2) continue;
            h += v;
            a += 2;
          }
          if (h > 0 || a > 0) {
            evHits[uid] = (evHits[uid] ?? 0) + h;
            evAttempts[uid] = (evAttempts[uid] ?? 0) + a;
          }
        };

        for (const match of event.matches) {
          const p1 = match.player1;
          const p2 = match.player2;
          const u1 = p1.uid;
          const u2 = p2.uid;
          const s1 = p1.score ?? 0;
          const s2 = p2.score ?? 0;

          const team1Uids =
            isDoubles && p1.members?.length
              ? (p1.members.map((m) => m.uid).filter(Boolean) as string[])
              : u1
                ? [u1]
                : [];
          const team2Uids =
            isDoubles && p2.members?.length
              ? (p2.members.map((m) => m.uid).filter(Boolean) as string[])
              : u2
                ? [u2]
                : [];

          // Accumulate sequence stats
          if (isDoubles && p1.members?.length) {
            for (const m of p1.members) {
              if (m.uid) addSeqStats(m.uid, m.sequences);
            }
          } else if (u1 && u1 !== "BYE") {
            addSeqStats(u1, p1.sequences);
          }
          if (isDoubles && p2.members?.length) {
            for (const m of p2.members) {
              if (m.uid) addSeqStats(m.uid, m.sequences);
            }
          } else if (u2 && u2 !== "BYE") {
            addSeqStats(u2, p2.sequences);
          }

          // BYE: count as ranking win only
          if (u1 && u2 === "BYE") {
            for (const uid of team1Uids)
              winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
            continue;
          }
          if (u2 && u1 === "BYE") {
            for (const uid of team2Uids)
              winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
            continue;
          }

          if (!u1 || !u2 || u1 === "BYE" || u2 === "BYE") continue;

          // Determine winner
          if (s1 > s2) {
            for (const uid of team1Uids)
              winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
          } else if (s2 > s1) {
            for (const uid of team2Uids)
              winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
          } else if (s1 === 0 && s2 === 0) {
            // Winner flag fallback
            if (p1.winner === true) {
              for (const uid of team1Uids)
                winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
            } else if (p2.winner === true) {
              for (const uid of team2Uids)
                winsRanking[uid] = (winsRanking[uid] ?? 0) + 1;
            }
          }

          // Score diff
          for (const uid of team1Uids)
            diffs[uid] = (diffs[uid] ?? 0) + (s1 - s2);
          for (const uid of team2Uids)
            diffs[uid] = (diffs[uid] ?? 0) + (s2 - s1);

          // Points-only match counting (for completed check)
          let counted = false;
          if (s1 > s2 || s2 > s1) counted = true;
          if (counted) {
            for (const uid of [...team1Uids, ...team2Uids])
              matchesPointsOnly[uid] = (matchesPointsOnly[uid] ?? 0) + 1;
          }
        }

        // Build per-event entries
        const participantUids = new Set([
          ...Object.keys(winsRanking),
          ...Object.keys(matchesPointsOnly),
          ...Object.keys(diffs),
        ]);

        type CornholeEntry = {
          uid: string;
          winsR: number;
          hitPct: number;
          diff: number;
          completed: boolean;
        };
        const entries: CornholeEntry[] = [];

        for (const uid of participantUids) {
          const pdata = event.players[uid];
          if (
            divisionFilter !== "all" &&
            (pdata?.division?.toUpperCase() ?? "") !== divisionFilter
          )
            continue;

          const h = evHits[uid] ?? 0;
          const a = evAttempts[uid] ?? 0;
          uidHits[uid] = h;
          uidPutts[uid] = a;
          uidCompleted[uid] = (matchesPointsOnly[uid] ?? 0) > 0;
          uidNames[uid] = pdata?.displayName || pdata?.name || uid;
          uidDivisions[uid] = pdata?.division?.toUpperCase();

          entries.push({
            uid,
            winsR: winsRanking[uid] ?? 0,
            hitPct: a > 0 ? h / a : -1,
            diff: diffs[uid] ?? 0,
            completed: uidCompleted[uid],
          });
        }

        if (isDoubles) {
          // Rank teams by representative member
          const teamEntries: {
            teamId: string;
            winsR: number;
            hitPct: number;
            diff: number;
          }[] = [];
          const seen = new Set<string>();
          for (const entry of entries) {
            const teamId = memberToTeam[entry.uid] ?? entry.uid;
            if (seen.has(teamId)) continue;
            seen.add(teamId);
            teamEntries.push({
              teamId,
              winsR: entry.winsR,
              hitPct: entry.hitPct,
              diff: entry.diff,
            });
          }
          teamEntries.sort((a, b) => {
            if (b.winsR !== a.winsR) return b.winsR - a.winsR;
            if (b.hitPct !== a.hitPct) return b.hitPct - a.hitPct;
            return b.diff - a.diff;
          });
          let lastW = -1,
            lastH = -2,
            lastD = Number.MIN_SAFE_INTEGER,
            lastP = 0;
          const teamPlace: Record<string, number> = {};
          for (let i = 0; i < teamEntries.length; i++) {
            const t = teamEntries[i];
            if (i === 0) {
              lastP = 1;
            } else if (
              t.winsR !== lastW ||
              t.hitPct !== lastH ||
              t.diff !== lastD
            ) {
              lastP = i + 1;
            }
            teamPlace[t.teamId] = lastP;
            lastW = t.winsR;
            lastH = t.hitPct;
            lastD = t.diff;
          }
          for (const entry of entries) {
            const teamId = memberToTeam[entry.uid] ?? entry.uid;
            eventPlaces[entry.uid] = teamPlace[teamId] ?? 1;
          }
        } else {
          // Rank individuals
          entries.sort((a, b) => {
            if (b.winsR !== a.winsR) return b.winsR - a.winsR;
            if (b.hitPct !== a.hitPct) return b.hitPct - a.hitPct;
            return b.diff - a.diff;
          });
          let lastW = -1,
            lastH = -2,
            lastD = Number.MIN_SAFE_INTEGER,
            lastP = 0;
          for (let i = 0; i < entries.length; i++) {
            const e = entries[i];
            if (i === 0) {
              lastP = 1;
            } else if (
              e.winsR !== lastW ||
              e.hitPct !== lastH ||
              e.diff !== lastD
            ) {
              lastP = i + 1;
            }
            eventPlaces[e.uid] = lastP;
            lastW = e.winsR;
            lastH = e.hitPct;
            lastD = e.diff;
          }
        }
      } else {
        // Standard events: build scores from rounds
        for (const [uid, pdata] of Object.entries(event.players)) {
          if (
            divisionFilter !== "all" &&
            (pdata.division?.toUpperCase() ?? "") !== divisionFilter
          )
            continue;

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

          uidHits[uid] = sumHits;
          uidPutts[uid] = sumPutts;
          uidCompleted[uid] = validCount > 0;
          uidNames[uid] = pdata.displayName || pdata.name || uid;
          uidDivisions[uid] = pdata.division?.toUpperCase();
        }

        if (isDoubles) {
          // Sum team hits, rank teams
          const teamHits: Record<string, number> = {};
          for (const [uid, hits] of Object.entries(uidHits)) {
            const teamId = memberToTeam[uid] ?? uid;
            teamHits[teamId] = (teamHits[teamId] ?? 0) + hits;
          }
          // Solo player in stormputt/stations doubles gets hits doubled
          if (isStormputtOrStations) {
            for (const [teamId, hits] of Object.entries(teamHits)) {
              if ((teamMembers[teamId]?.length ?? 0) === 1) {
                teamHits[teamId] = hits * 2;
              }
            }
          }
          const teamIds = Object.keys(teamHits).sort(
            (a, b) => (teamHits[b] ?? 0) - (teamHits[a] ?? 0),
          );
          let lastH = -1,
            lastP = 0;
          const teamPlace: Record<string, number> = {};
          for (let i = 0; i < teamIds.length; i++) {
            const h = teamHits[teamIds[i]] ?? 0;
            if (i === 0) {
              lastP = 1;
            } else if (h !== lastH) {
              lastP = i + 1;
            }
            teamPlace[teamIds[i]] = lastP;
            lastH = h;
          }
          // Assign team place to each member; check team-level completed
          for (const uid of Object.keys(uidHits)) {
            const teamId = memberToTeam[uid] ?? uid;
            eventPlaces[uid] = teamPlace[teamId] ?? 1;
            // Completed if any team member completed
            if (!uidCompleted[uid]) {
              const members = teamMembers[teamId] ?? [uid];
              uidCompleted[uid] = members.some((m) => uidCompleted[m]);
            }
          }
        } else {
          // Rank individuals by hits
          const uids = Object.keys(uidHits).sort(
            (a, b) => (uidHits[b] ?? 0) - (uidHits[a] ?? 0),
          );
          let lastH = -1,
            lastP = 0;
          for (let i = 0; i < uids.length; i++) {
            const h = uidHits[uids[i]] ?? 0;
            if (i === 0) {
              lastP = 1;
            } else if (h !== lastH) {
              lastP = i + 1;
            }
            eventPlaces[uids[i]] = lastP;
            lastH = h;
          }
        }
      }

      // Assign points from event places
      for (const uid of Object.keys(eventPlaces)) {
        if (!uidCompleted[uid]) continue;
        const place = eventPlaces[uid];
        const pts = pointsForPlace(place);

        if (!acc[uid]) {
          acc[uid] = {
            name: uidNames[uid] || uid,
            division: uidDivisions[uid],
            eventsPlayed: 0,
            eventWins: 0,
            totalHits: 0,
            totalPutts: 0,
            points: 0,
          };
        }

        acc[uid].eventsPlayed++;
        acc[uid].totalHits += uidHits[uid] ?? 0;
        acc[uid].totalPutts += uidPutts[uid] ?? 0;
        acc[uid].points += pts;
        if (place === 1) acc[uid].eventWins++;
      }
    }

    // Build standings
    type StandingWithRaw = PlayerStanding & { _rawHitPct: number };
    const standings: StandingWithRaw[] = Object.entries(acc).map(([uid, d]) => {
      const rawHitPct =
        d.totalPutts > 0 ? (d.totalHits / d.totalPutts) * 100 : -1;
      return {
        uid,
        displayName: d.name,
        division: d.division,
        eventsPlayed: d.eventsPlayed,
        eventWins: d.eventWins,
        totalHits: d.totalHits,
        totalPutts: d.totalPutts,
        hitPercent: rawHitPct >= 0 ? Math.round(rawHitPct * 10) / 10 : 0,
        _rawHitPct: rawHitPct,
        points: d.points,
        pos: 0,
      };
    });

    // Sort by points desc, then hit% desc for position assignment
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b._rawHitPct - a._rawHitPct;
    });

    // Assign positions with ties
    for (let i = 0; i < standings.length; i++) {
      if (i === 0) {
        standings[i].pos = 1;
      } else {
        const prev = standings[i - 1];
        const curr = standings[i];
        standings[i].pos =
          curr.points === prev.points && curr._rawHitPct === prev._rawHitPct
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
