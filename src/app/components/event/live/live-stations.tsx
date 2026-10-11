"use client";

import { useMemo } from "react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { buildStationsLiveState, type StationInfo } from "@/lib/stations-live";
import { useTvSettings } from "@/lib/view-settings";
import { PointsPill, RoundProgressBar } from "../live-parts";
import { evenLineLength } from "@/lib/live-progress";
import {
  CountCells,
  PlayerBoard,
  useBoardPage,
  type BoardPlayer,
} from "./player-board";
import { TvCanvas, TvFooter, TvTopBar, useTvTone } from "./tv-board";

// Station count breakpoints for the TV board. Round cells always show the
// hit count:
//   1-12   cells and strip in one row
//   13+    cells and strip wrap onto even lines of at most 12
//          (13 is 7 + 6, 20 is 2 x 10, 30 is 3 x 10, 36 is 3 x 12)
const ONE_LINE_MAX = 12;
const WRAPPED_LINE_MAX = 12;
// Up to this many stations the strip shows roomy tiles.
const ROOMY_STRIP_MAX = 8;

export function LiveStationsBoard({ event }: { event: LeagueEvent }) {
  const tone = useTvTone();
  const { units } = useTvSettings();
  const state = useMemo(
    () => buildStationsLiveState(event, units),
    [event, units],
  );
  const { roundStats, currentRoundIndex, isLive, standings, stations } = state;
  const n = stations.length;
  const perLine = n <= ONE_LINE_MAX ? n : evenLineLength(n, WRAPPED_LINE_MAX);
  const trackLines = n > 0 ? Math.ceil(n / perLine) : 1;

  const players: BoardPlayer[] = useMemo(
    () =>
      standings.map((row) => ({
        id: row.id,
        position: row.position,
        movement: row.movement,
        name: row.name,
        muted: row.round.status === "dns",
        active: row.round.status === "putting",
        roundScore:
          row.round.status === "dns"
            ? "DNS"
            : row.round.status === "not-started"
              ? "–"
              : String(row.round.roundPoints),
        total: row.score,
        hitLabel: row.hitLabel,
        members: row.members?.map((m) => ({
          name: m.name,
          hitLabel: m.hitLabel,
        })),
        group: row.round.group,
      })),
    [standings],
  );
  const rowsById = useMemo(
    () => new Map(standings.map((row) => [row.id, row])),
    [standings],
  );

  const boardPage = useBoardPage(players, trackLines);
  const tileOrder = useMemo(
    () => state.participants.map(([id]) => id),
    [state.participants],
  );

  const wrapped = trackLines > 1;
  const trackWidth = wrapped
    ? 270
    : n <= ROOMY_STRIP_MAX
      ? n * 32
      : Math.min(270, Math.round(n * 22.5));

  const trackHeader = (
    <span
      className={`grid text-center ${
        wrapped
          ? "gap-x-0.5 text-[10px] leading-[1.3]"
          : n > ROOMY_STRIP_MAX
            ? "gap-0.5 text-[10px]"
            : "gap-0.75"
      }`}
      style={{ gridTemplateColumns: `repeat(${perLine}, minmax(0, 1fr))` }}
    >
      {stations.map((s) => (
        <span key={s.number}>{s.number}</span>
      ))}
    </span>
  );

  const renderTrack = (id: string, size: "row" | "tile", member?: number) => {
    const row = rowsById.get(id);
    const round = member != null ? row?.members?.[member]?.round : row?.round;
    if (!round) return <span />;
    return (
      <CountCells
        cells={round.cells}
        size={size}
        dense={n > ROOMY_STRIP_MAX}
        perLine={perLine}
      />
    );
  };

  const subtitle = ["Stations", event.location].filter(Boolean).join(" · ");
  const round = currentRoundIndex + 1;
  const legend =
    currentRoundIndex < 0
      ? "×2 / ×3 = points per hit · Pts = event total"
      : `Round ${round} per station: numbers = hits, yellow = putting now · ×2 / ×3 = points per hit · Rnd = round ${round} points · Pts = event total`;

  return (
    <TvCanvas>
      <TvTopBar
        event={event}
        subtitle={subtitle}
        isLive={isLive}
        roundIndex={currentRoundIndex}
        right={
          roundStats.total > 0 && (
            <div className="ml-auto flex w-65 shrink-0 flex-col gap-1.5">
              <div className="flex justify-end gap-3.5 text-xs font-semibold text-(--tv-muted)">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-[#38C757]" />
                  {roundStats.playing} putting
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px] bg-(--tv-ink)" />
                  {roundStats.finished} of {roundStats.total} finished
                </span>
              </div>
              <RoundProgressBar
                stats={roundStats}
                tone={tone}
                finishedClassName="bg-(--tv-ink)"
                className="h-1.5 rounded-[3px]"
              />
            </div>
          )
        }
      />

      {n > 0 && <StationStrip stations={stations} />}

      <PlayerBoard
        players={players}
        boardPage={boardPage}
        tileOrder={tileOrder}
        totalLabel="Pts"
        trackWidth={trackWidth}
        trackHeader={trackHeader}
        trackLines={trackLines}
        renderTrack={renderTrack}
      />

      <TvFooter page={boardPage.page} pages={boardPage.pages} legend={legend} />
    </TvCanvas>
  );
}

function StationStrip({ stations }: { stations: StationInfo[] }) {
  const tone = useTvTone();
  const n = stations.length;

  // 13+ stations: one-line tiles in even rows, matching the round cells.
  // Too narrow for names, so they show the distance (the name only where a
  // station has no distance).
  if (n > ONE_LINE_MAX) {
    return (
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${evenLineLength(n, WRAPPED_LINE_MAX)}, minmax(0, 1fr))`,
        }}
      >
        {stations.map((s) => (
          <div
            key={s.number}
            className="flex min-w-0 items-center gap-1.5 rounded-lg bg-(--tv-panel) px-2 py-1 text-[11px] font-semibold"
          >
            <span className="shrink-0 text-(--tv-accent)">{s.number}</span>
            <span className="min-w-0 flex-1 truncate font-display text-xs font-bold">
              {s.distance ?? s.description}
            </span>
            <PointsPill
              points={s.points}
              tone={tone}
              className="px-1.25 text-[10px]"
            />
          </div>
        ))}
      </div>
    );
  }

  const roomy = n <= ROOMY_STRIP_MAX;
  return (
    <div
      className={`grid ${roomy ? "gap-2" : "gap-1.5"}`}
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    >
      {stations.map((s) =>
        roomy ? (
          <div
            key={s.number}
            className="flex min-w-0 items-center gap-2 rounded-[10px] bg-(--tv-panel) px-2.5 py-1.5"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate font-display text-[15px] leading-[1.15] font-bold">
                {s.description}
              </span>
              <span className="truncate text-[11px] font-semibold text-(--tv-muted)">
                <span className="text-(--tv-accent)">{s.number}</span>
                {s.distance && ` · ${s.distance}`}
              </span>
            </span>
            <PointsPill
              points={s.points}
              tone={tone}
              className="px-1.5 py-px text-[11px]"
            />
          </div>
        ) : (
          <div
            key={s.number}
            className="flex min-w-0 flex-col gap-0.5 rounded-[9px] bg-(--tv-panel) px-2 py-1.25"
          >
            <span className="truncate font-display text-[13px] leading-[1.15] font-bold">
              {s.description}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap text-(--tv-muted)">
              <span className="text-(--tv-accent)">{s.number}</span>
              <span className="truncate">{s.distance}</span>
              <PointsPill
                points={s.points}
                tone={tone}
                className="ml-auto px-1.25 text-[10px]"
              />
            </span>
          </div>
        ),
      )}
    </div>
  );
}
