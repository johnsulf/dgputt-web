"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { LayoutGroup, motion } from "motion/react";
import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useViewSettings } from "@/lib/view-settings";
import { evenLineLength } from "@/lib/live-progress";
import { useAuth } from "@/lib/auth-context";
import { playerModeLabel } from "@/lib/event-utils";
import {
  buildStationsLiveState,
  stationRoundProgress,
  type StationInfo,
  type StationRoundProgress,
  type StationsLiveState,
  type StationsStandingRow,
} from "@/lib/stations-live";
import { useLiveEvent } from "./live/use-live-event";
import { rowLayoutTransition } from "./live/live-table";
import { GroupTag, Movement, PointsPill, heatColour } from "./live-parts";
import {
  Breadcrumb,
  CARD_SHADOW,
  HeaderCard,
  RoundSwitcher,
} from "./live-event-header";

// Layout by number of stations (1280px page). Every cell always shows its
// hit count; past 12 stations the cells wrap onto even lines instead of
// shrinking.
//   1-8    standings and round cards side by side
//   9-12   standings full width, round cards below in two columns
//   13+    as 9-12, with the stations split evenly over lines of at most 12
//          (18 is 2 x 9, 20 is 2 x 10, 30 is 3 x 10)
type StationsLayout = "side" | "full" | "blocks";

function stationsLayout(n: number): StationsLayout {
  if (n <= 8) return "side";
  if (n <= 12) return "full";
  return "blocks";
}

/**
 * Station strip columns on desktop. Up to 18 it is rows of 9; above that the
 * rows are evened out (20 is 2 x 10, 24 is 3 x 8) so no row is left short.
 */
function stripColumns(n: number): number {
  if (n <= 18) return 9;
  return Math.ceil(n / Math.ceil(n / 10));
}

/** Station cells per line: even lines of at most 12, else all on one. */
function cellsPerLine(n: number, layout: StationsLayout): number {
  return layout === "blocks" ? evenLineLength(n, 12) : n;
}

interface StationsEventProps {
  league: LeagueInstance;
  event: LeagueEvent;
}

export function StationsEvent({
  league,
  event: initialEvent,
}: StationsEventProps) {
  const { dataUid } = useAuth();
  const isAdmin = !!dataUid && (league.admins?.includes(dataUid) ?? false);

  // Follow the event in real time until it is finished.
  const subscribe = !initialEvent.finished;
  const { event: liveEvent } = useLiveEvent(
    subscribe ? league.id : "",
    subscribe ? initialEvent.id : "",
  );
  const event = liveEvent ?? initialEvent;

  const [{ units }] = useViewSettings();
  const state = useMemo(
    () => buildStationsLiveState(event, units),
    [event, units],
  );
  const { stations } = state;
  const hasStarted =
    state.roundCount > 0 && ((event.currentRound ?? 0) > 0 || !!event.finished);
  const layout = stationsLayout(stations.length);
  const sideBySide = layout === "side";

  const playerCount = Object.keys(event.players ?? {}).length;
  const chips = [
    "Stations",
    `${stations.length} station${stations.length !== 1 ? "s" : ""}`,
    ...(event.playerMode && event.playerMode !== "singles"
      ? [playerModeLabel(event.playerMode)]
      : []),
    ...(playerCount > 0
      ? [`${playerCount} player${playerCount !== 1 ? "s" : ""}`]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb league={league} event={event} />
      <HeaderCard
        league={league}
        event={event}
        isAdmin={isAdmin}
        isLive={state.isLive && hasStarted}
        stats={state.roundStats}
        chips={chips}
        activeLabel="putting"
        hasDistances
        roundLabel={`Round ${state.currentRoundIndex + 1}`}
      />
      {stations.length > 0 && (
        <StationStrip stations={stations} layout={layout} />
      )}
      {!hasStarted ? (
        <RegisteredPlayers event={event} />
      ) : stations.length === 0 ? (
        <p className="py-8 text-center text-[#8B8B8B]">
          No stations configured for this event.
        </p>
      ) : (
        <div
          className={`grid grid-cols-[minmax(0,1fr)] gap-6 ${
            sideBySide
              ? "xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start"
              : ""
          }`}
        >
          <Standings
            rows={state.standings}
            stations={stations}
            roundNumber={state.currentRoundIndex + 1}
            showCurrent={state.isLive}
            layout={layout}
          />
          <RoundProgressSection state={state} layout={layout} />
        </div>
      )}
    </div>
  );
}

function StationStrip({
  stations,
  layout,
}: {
  stations: StationInfo[];
  layout: StationsLayout;
}) {
  const compact = layout !== "side";
  // One row up to 12 stations; above that rows of 9 on desktop. Phones
  // always scroll one row sideways.
  const rowsOfNine = layout === "blocks";
  return (
    <div
      style={{ "--strip-cols": stripColumns(stations.length) } as CSSProperties}
      className={`grid grid-flow-col gap-2 overflow-x-auto pb-1 lg:pb-0 ${
        !compact
          ? "auto-cols-[minmax(150px,1fr)] lg:auto-cols-[minmax(0,1fr)] lg:gap-2.5"
          : rowsOfNine
            ? "auto-cols-[minmax(104px,1fr)] lg:grid-flow-row lg:grid-cols-[repeat(var(--strip-cols),minmax(0,1fr))]"
            : "auto-cols-[minmax(104px,1fr)] lg:auto-cols-[minmax(0,1fr)]"
      }`}
    >
      {stations.map((s) => {
        const meta = [s.number, s.distance].filter(Boolean).join(" · ");
        return compact ? (
          <div
            key={s.number}
            className={`flex min-w-0 flex-col gap-1 rounded-[14px] bg-white p-2.5 ${CARD_SHADOW}`}
          >
            <div className="min-h-8.5 font-display text-sm leading-[1.2] font-bold text-balance">
              {s.description}
            </div>
            <div className="flex items-center justify-between gap-1 text-[11px] text-[#8B8B8B]">
              <span className="truncate">{s.number}</span>
              <PointsPill
                points={s.points}
                tone="light"
                className="px-1.75 py-px text-[11px]"
              />
            </div>
            <div className="text-[11px] whitespace-nowrap text-[#8B8B8B]">
              {[s.distance, `${s.putts} putts`].filter(Boolean).join(" · ")}
            </div>
          </div>
        ) : (
          <div
            key={s.number}
            className={`flex min-w-0 flex-col gap-1.5 rounded-2xl bg-white px-3.5 py-3 ${CARD_SHADOW}`}
          >
            <div className="font-display text-[17px] leading-[1.2] font-bold text-balance">
              {s.description}
            </div>
            <div className="flex items-center justify-between gap-1.5 text-xs text-[#8B8B8B]">
              <span className="truncate">
                {meta} · {s.putts} putts
              </span>
              <PointsPill
                points={s.points}
                tone="light"
                className="px-2 py-0.5 text-xs"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Columns: #, movement, player, station cells (hidden on phones), hit%,
// score. The station track width scales with the number of stations.
const STANDINGS_GRID =
  "grid gap-2 grid-cols-[32px_28px_minmax(0,1fr)_52px_56px] sm:grid-cols-[32px_28px_minmax(0,1fr)_minmax(0,var(--track))_52px_56px]";

function Standings({
  rows,
  stations,
  roundNumber,
  showCurrent,
  layout,
}: {
  rows: StationsStandingRow[];
  stations: StationInfo[];
  roundNumber: number;
  showCurrent: boolean;
  layout: StationsLayout;
}) {
  const divisions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.division).filter((d): d is string => !!d)),
      ).sort(),
    [rows],
  );
  const [division, setDivision] = useState<string | null>(null);
  const visible = division ? rows.filter((r) => r.division === division) : rows;

  const n = stations.length;
  const compact = layout !== "side";
  const perLine = cellsPerLine(n, layout);
  const trackWidth =
    layout === "side" ? n * 46 : layout === "full" ? n * 50 : perLine * 50;
  const trackStyle = { "--track": `${trackWidth}px` } as CSSProperties;
  const cols = {
    gridTemplateColumns: `repeat(${perLine}, minmax(0, 1fr))`,
  };

  return (
    <section
      className={`rounded-3xl bg-white px-4 pt-5.5 pb-3 sm:px-6 ${CARD_SHADOW}`}
      style={trackStyle}
    >
      <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="m-0 font-display text-2xl font-bold">Standings</h2>
        {divisions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:ml-2">
            {[null, ...divisions].map((d) => (
              <Badge
                key={d ?? "all"}
                variant={division === d ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setDivision(d)}
              >
                {d ?? "All"}
              </Badge>
            ))}
          </div>
        )}
        <span className="ml-auto text-xs text-[#8B8B8B]">
          Most points, then hit %
        </span>
      </div>

      <div
        className={`${STANDINGS_GRID} items-end border-b border-[#EFEFEF] py-2.5 text-xs font-semibold text-[#8B8B8B]`}
      >
        <span className="text-center">#</span>
        <span />
        <span>Player</span>
        <span className="hidden gap-1 text-center sm:grid" style={cols}>
          {stations.map((s) => (
            <span key={s.number} className="text-[#212121]">
              {s.number}
              <span
                className={`block text-[10px] font-semibold ${
                  s.points >= 3 ? "text-[#212121]" : "text-[#5A5A5A]"
                }`}
              >
                {s.points !== 1 ? `×${s.points}` : " "}
              </span>
            </span>
          ))}
        </span>
        <span className="text-right">Hit%</span>
        <span className="text-right text-[#212121]">Score</span>
      </div>

      <LayoutGroup>
        {visible.map((row) => (
          <motion.div
            key={row.id}
            layout
            layoutId={row.id}
            transition={rowLayoutTransition}
            className={`${STANDINGS_GRID} items-center border-b border-[#F5F5F5] last:border-b-0 ${
              compact ? "py-1.5" : "py-1.75"
            }`}
          >
            <span className="text-center font-display text-base font-bold">
              {row.position}
            </span>
            <Movement value={row.movement} tone="light" />
            <span className="flex min-w-0 items-center gap-2">
              <span className="min-w-0 text-[15px] leading-[1.2] font-semibold break-words">
                {row.name}
              </span>
              {row.pdgaNumber && (
                <a
                  href={`https://www.pdga.com/player/${row.pdgaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 rounded-full bg-linear-to-l from-[#008d6f] to-[#003F6A] px-2 py-0.5 text-[10px] font-semibold text-white sm:inline"
                >
                  #{row.pdgaNumber}
                </a>
              )}
              {row.round.status === "dns" && (
                <span className="shrink-0 rounded-full border border-[#D6D6D6] px-1.75 py-px text-[10px] font-bold text-[#5A5A5A]">
                  DNS R{roundNumber}
                </span>
              )}
            </span>
            <span className="hidden gap-1 sm:grid" style={cols}>
              {row.stationRates.map((rate, i) => {
                const current = showCurrent && row.round.currentStation === i;
                // Hits at this station over the event; shading shows hit rate.
                const hits =
                  rate == null ? "–" : String(row.stationHits[i] ?? 0);
                const detail =
                  rate == null
                    ? "no putts yet"
                    : `${row.stationHits[i]} of ${row.stationPutts[i]} hits (${Math.round(rate * 100)}%)`;
                return (
                  <span
                    key={i}
                    title={`${stations[i]?.number} ${stations[i]?.description}: ${detail}`}
                    className={`grid place-items-center border-2 text-[13px] font-bold tabular-nums transition-colors duration-800 ease-in-out ${
                      compact ? "h-8.5 rounded-lg" : "h-9 rounded-[9px]"
                    } ${current ? "border-[#009E73]" : "border-transparent"}`}
                    style={{ background: heatColour(rate ?? 0, "light") }}
                  >
                    {hits}
                  </span>
                );
              })}
            </span>
            <span className="text-right text-sm text-[#5A5A5A] tabular-nums">
              {row.hitLabel}
            </span>
            <span className="text-right font-display text-[22px] font-bold tabular-nums">
              {row.score}
            </span>
          </motion.div>
        ))}
      </LayoutGroup>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-[#8B8B8B]">
          No players yet.
        </p>
      )}

      {visible.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 pb-1.5 text-xs text-[#8B8B8B]">
          {showCurrent && (
            <span className="hidden items-center gap-2 sm:flex">
              <span className="size-3.5 rounded border-2 border-[#009E73]" />
              Station being putted now
            </span>
          )}
          <span>Score = hits × station points</span>
        </div>
      )}
    </section>
  );
}

function RoundProgressSection({
  state,
  layout,
}: {
  state: StationsLiveState;
  layout: StationsLayout;
}) {
  const twoColumns = layout !== "side";
  const {
    participants,
    teams,
    roundCount,
    currentRoundIndex,
    isLive,
    stations,
  } = state;
  // null follows the latest round, so a newly started round shows up.
  const [picked, setPicked] = useState<number | null>(null);
  const selected =
    picked != null && picked < roundCount ? picked : currentRoundIndex;

  // Stable order: never re-sorted while the round is being played.
  const rows = useMemo(() => {
    const points = stations.map((s) => s.points);
    return participants.map(([id, player]) => ({
      id,
      name: player.displayName ?? player.name ?? "Unknown",
      progress: stationRoundProgress(player, selected, points),
      members: teams.get(id)?.map((m) => ({
        name: m.name,
        progress: stationRoundProgress(m.player, selected, points),
      })),
    }));
  }, [participants, teams, selected, stations]);

  const n = stations.length;
  const perLine = cellsPerLine(n, layout);
  const trackWidth =
    layout === "side" ? n * 32 : layout === "full" ? n * 26 : perLine * 34;
  const style = { "--track": `${trackWidth}px` } as CSSProperties;
  const header = (
    <div
      className={`${ROUND_GRID} px-4 text-[11px] font-semibold text-[#8B8B8B]`}
    >
      <span>Player</span>
      <span
        className="hidden gap-0.75 text-center sm:grid"
        style={{ gridTemplateColumns: `repeat(${perLine}, minmax(0, 1fr))` }}
      >
        {stations.map((s) => (
          <span key={s.number}>{s.number}</span>
        ))}
      </span>
      <span className="text-right">Rnd</span>
    </div>
  );

  return (
    <section className="flex flex-col gap-2.5" style={style}>
      <div className="flex items-center gap-3">
        <h2 className="m-0 shrink-0 font-display text-2xl font-bold">
          Round {selected + 1}
        </h2>
        <RoundSwitcher
          count={roundCount}
          selected={selected}
          liveIndex={isLive ? currentRoundIndex : -1}
          onSelect={(i) => setPicked(i === currentRoundIndex ? null : i)}
        />
      </div>

      <div
        className={`hidden gap-3 sm:grid ${twoColumns ? "lg:grid-cols-2" : ""}`}
      >
        {header}
        {twoColumns && <div className="hidden lg:block">{header}</div>}
      </div>

      <div
        className={`grid gap-x-3 gap-y-2 ${twoColumns ? "lg:grid-cols-2" : ""}`}
      >
        {rows.map((row) => (
          <RoundCard
            key={row.id}
            name={row.name}
            progress={row.progress}
            members={row.members}
            tall={!twoColumns}
            perLine={perLine}
          />
        ))}
      </div>
    </section>
  );
}

// Name, station track, round points. On phones the track drops to its own
// full-width line under the name.
const ROUND_GRID =
  "grid grid-cols-[minmax(0,1fr)_40px] gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,var(--track))_40px]";

function StationCells({
  progress,
  tall,
  perLine,
}: {
  progress: StationRoundProgress;
  tall: boolean;
  /** Cells per line; more cells wrap to a second line. */
  perLine: number;
}) {
  return (
    <span
      className="grid gap-0.75"
      style={{
        gridTemplateColumns: `repeat(${perLine}, minmax(0, 1fr))`,
      }}
    >
      {progress.cells.map((cell, i) => (
        <span
          key={i}
          className={`grid place-items-center font-bold tabular-nums transition-colors duration-800 ease-in-out ${
            tall ? "h-7 rounded-[7px] text-[13px]" : "h-6.5 rounded-md text-xs"
          } ${
            cell.state === "current"
              ? "bg-[#009E73] text-white"
              : cell.state === "todo"
                ? "bg-[#F1F1F1]"
                : cell.state === "dns"
                  ? "bg-transparent"
                  : "text-[#212121]"
          }`}
          style={
            cell.state === "done"
              ? {
                  background: heatColour(
                    cell.putts > 0 ? cell.hits / cell.putts : 0,
                    "light",
                  ),
                }
              : undefined
          }
        >
          {cell.state === "done"
            ? cell.hits
            : cell.state === "current"
              ? "•"
              : ""}
        </span>
      ))}
    </span>
  );
}

function RoundCard({
  name,
  progress,
  members,
  tall,
  perLine,
}: {
  name: string;
  progress: StationRoundProgress;
  /** Doubles: one score row per player; `progress` is the team's sum. */
  members?: { name: string; progress: StationRoundProgress }[];
  tall: boolean;
  /** Cells per line; more cells wrap to a second line. */
  perLine: number;
}) {
  const muted = progress.status === "not-started" || progress.status === "dns";
  const ink = muted ? "text-[#8B8B8B]" : "text-[#212121]";

  if (members) {
    return (
      <div
        className={`flex flex-col gap-2 rounded-[14px] bg-white px-4 py-2.5 ${CARD_SHADOW}`}
      >
        <div className="flex items-baseline gap-2">
          <span
            className={`min-w-0 flex-1 text-[15px] leading-[1.2] font-semibold break-words ${ink}`}
          >
            {name}
          </span>
          <GroupTag group={progress.group} tone="light" />
          <span
            className={`font-display leading-none font-bold tabular-nums ${ink} ${
              progress.status === "dns" ? "text-sm" : "text-xl"
            }`}
          >
            {progress.status === "dns"
              ? "DNS"
              : progress.status === "not-started"
                ? "–"
                : progress.roundPoints}
          </span>
        </div>
        {members.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#5A5A5A]">
              {m.name}
            </span>
            <StationCells progress={m.progress} tall={tall} perLine={perLine} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${ROUND_GRID} items-center rounded-[14px] bg-white px-4 py-2 ${CARD_SHADOW}`}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={`text-[15px] leading-[1.2] font-semibold break-words ${ink}`}
        >
          {name}
        </span>
        <GroupTag group={progress.group} tone="light" />
      </span>
      <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto">
        <StationCells progress={progress} tall={tall} perLine={perLine} />
      </span>
      <span
        className={`text-right font-display leading-none font-bold tabular-nums ${ink} ${
          progress.status === "dns" ? "text-sm" : "text-xl"
        }`}
      >
        {progress.status === "dns"
          ? "DNS"
          : progress.status === "not-started"
            ? "–"
            : progress.roundPoints}
      </span>
    </div>
  );
}

function RegisteredPlayers({ event }: { event: LeagueEvent }) {
  const players = Object.entries(event.players ?? {})
    .map(([uid, p]) => ({
      uid,
      name: p.displayName ?? p.name ?? "Unknown",
      pdgaNumber: p.pdgaNumber,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section
      className={`rounded-3xl bg-white px-4 py-5 sm:px-6 ${CARD_SHADOW}`}
    >
      <h2 className="mb-4 font-display text-2xl font-bold">
        Registered Players
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="w-28">PDGA#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((row) => (
            <TableRow key={row.uid}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.pdgaNumber ?? "-"}</TableCell>
            </TableRow>
          ))}
          {players.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={2}
                className="py-10 text-center text-muted-foreground"
              >
                No players registered yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
