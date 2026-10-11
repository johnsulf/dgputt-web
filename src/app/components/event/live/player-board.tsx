"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import { LayoutGroup, motion } from "motion/react";
import { GroupTag, Movement, heatColour } from "../live-parts";
import { rowLayoutTransition } from "./live-table";
import { usePaging, useTvTone } from "./tv-board";

// Player area of the StormPutt and Stations TV boards. Picks a layout from
// the number of players:
//   up to 16   a tile per player (fixed order) plus a standings panel
//   17-32      combined table in two columns
//   33+        the table pages every 10 seconds, 30 players per page, with
//              the top 3 pinned at the top of every later page
// Every round cell shows its hit count, so many stations wrap the cells
// onto more lines ("track lines"). Taller cells need taller rows and tiles,
// so with 2 lines tiles stop at 12 players and the table pages above 30, and
// with 3 lines (the most: the app allows 36 stations, 3 x 12) tiles stop at
// 8 and the table pages above 18.
const PINNED = 3;

interface BoardSizing {
  tilesMax: number;
  pagingFrom: number;
  pageSize: number;
  /** Table rows grow to fill their column between these heights. */
  minRowHeight: number;
  maxRowHeight: number;
}

function boardSizing(trackLines: number, teams: boolean): BoardSizing {
  if (teams) {
    // Doubles: every team has two stacked tracks, one per player.
    if (trackLines >= 2) {
      return {
        tilesMax: 6,
        pagingFrom: 13,
        pageSize: 12,
        minRowHeight: 64,
        maxRowHeight: 72,
      };
    }
    return {
      tilesMax: 8,
      pagingFrom: 19,
      pageSize: 18,
      minRowHeight: 46,
      maxRowHeight: 52,
    };
  }
  if (trackLines >= 3) {
    return {
      tilesMax: 8,
      // Three-line rows fit 9 to a column under a three-row station strip.
      pagingFrom: 19,
      pageSize: 18,
      minRowHeight: 46,
      maxRowHeight: 52,
    };
  }
  return {
    tilesMax: trackLines === 2 ? 12 : 16,
    // Two-line rows fit 15 to a column, so the table pages from 31.
    pagingFrom: trackLines === 2 ? 31 : 33,
    pageSize: 30,
    minRowHeight: 30,
    maxRowHeight: 38,
  };
}

// Rows of the standings panel next to the tiles, which has no round cells.
const PANEL_MIN_ROW_HEIGHT = 30;
const PANEL_MAX_ROW_HEIGHT = 38;

// Tiles grow up to this height (about 64px at 16 players); fewer players
// leaves space below.
const MAX_TILE_HEIGHT = 110;
// Team tiles hold a name and two tracks, so they are taller.
const MAX_TEAM_TILE_HEIGHT = 150;

export interface BoardPlayer {
  id: string;
  position: number;
  movement: number;
  name: string;
  /** Greyed out, e.g. did not start this round. */
  muted: boolean;
  /** Putting now: highlighted row or tile. */
  active: boolean;
  /** Round score text: a number, "–" or "DNS". */
  roundScore: string;
  total: number;
  hitLabel: string;
  /** The two players of a doubles team; the scores above are combined. */
  members?: { name: string; hitLabel: string }[];
  /** Group this round, shown on the tile only, never in the standings. */
  group?: number;
}

export interface BoardPage {
  /** Players to show on this page, in standings order. */
  visible: BoardPlayer[];
  /** How many rows at the top are the pinned leaders (0 on page 1). */
  pinned: number;
  page: number;
  pages: number;
}

/**
 * Pages the table for big fields. Page 1 is places 1-30; every later page
 * keeps the top 3 and adds the next 27.
 */
export function useBoardPage(
  players: BoardPlayer[],
  trackLines = 1,
): BoardPage {
  const { pagingFrom: PAGING_FROM, pageSize: PAGE_SIZE } = boardSizing(
    trackLines,
    players.some((p) => p.members),
  );
  const paged = players.length >= PAGING_FROM;
  const rest = PAGE_SIZE - PINNED;
  const pageCount = paged
    ? 1 + Math.ceil((players.length - PAGE_SIZE) / rest)
    : 1;
  const { page } = usePaging(pageCount, 1);
  if (!paged || page === 0) {
    return {
      // Unpaged boards show everyone; 31-32 players fit 16 to a column.
      visible: paged ? players.slice(0, PAGE_SIZE) : players,
      pinned: 0,
      page,
      pages: pageCount,
    };
  }
  const from = PAGE_SIZE + (page - 1) * rest;
  return {
    visible: [...players.slice(0, PINNED), ...players.slice(from, from + rest)],
    pinned: PINNED,
    page,
    pages: pageCount,
  };
}

interface PlayerBoardProps {
  /** All players in standings order. */
  players: BoardPlayer[];
  /** The current page from useBoardPage. */
  boardPage: BoardPage;
  /** Player ids in start (registration) order, for the tiles. */
  tileOrder: string[];
  /** Round track for a player, sized for a table row or a tile. */
  renderTrack: (id: string, size: "row" | "tile", member?: number) => ReactNode;
  /** Table header over the track column. */
  trackHeader: ReactNode;
  /** Width of the track column in the table, in px. */
  trackWidth: number;
  /** Lines the round cells wrap onto; sizes the rows and tiles. */
  trackLines?: number;
  totalLabel: string;
}

export function PlayerBoard({
  players,
  boardPage,
  tileOrder,
  renderTrack,
  trackHeader,
  trackWidth,
  trackLines = 1,
  totalLabel,
}: PlayerBoardProps) {
  const tone = useTvTone();
  const {
    tilesMax,
    minRowHeight: MIN_ROW_HEIGHT,
    maxRowHeight: MAX_ROW_HEIGHT,
  } = boardSizing(
    trackLines,
    players.some((p) => p.members),
  );
  if (players.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center rounded-[14px] bg-(--tv-panel) text-[#8B8B8B]">
        No players yet.
      </div>
    );
  }

  if (players.length <= tilesMax) {
    return (
      <TilesWithStandings
        players={players}
        tileOrder={tileOrder}
        renderTrack={renderTrack}
        totalLabel={totalLabel}
      />
    );
  }

  const { visible, pinned } = boardPage;
  const half = Math.ceil(visible.length / 2);
  const columns = [visible.slice(0, half), visible.slice(half)];
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `26px 26px minmax(0,1fr) ${trackWidth}px 34px 38px`,
  };

  return (
    <LayoutGroup>
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[minmax(0,1fr)] gap-4">
        {columns.map((rows, col) => (
          <div
            key={col}
            className="flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-(--tv-panel) px-3 pt-1 pb-1.5"
          >
            <div
              className="grid gap-2 py-1.5 text-[11px] font-semibold tracking-[.05em] text-(--tv-muted) uppercase"
              style={gridStyle}
            >
              <span>#</span>
              <span />
              <span>Player</span>
              <span className="tracking-normal normal-case">{trackHeader}</span>
              <span className="text-right">Rnd</span>
              <span className="text-right text-(--tv-ink)">{totalLabel}</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col">
              {rows.map((p, i) => (
                <Fragment key={p.id}>
                  <motion.div
                    layout
                    layoutId={p.id}
                    transition={rowLayoutTransition}
                    className={`-mx-1 grid flex-1 basis-0 items-center gap-2 rounded-md border-t border-(--tv-line) px-1 pt-0.75 ${
                      p.active ? "bg-(--tv-active-row)" : ""
                    }`}
                    style={{
                      ...gridStyle,
                      minHeight: MIN_ROW_HEIGHT,
                      maxHeight: MAX_ROW_HEIGHT,
                    }}
                  >
                    <span className="font-display text-[17px] font-bold">
                      {p.position}
                    </span>
                    <Movement value={p.movement} tone={tone} />
                    <span
                      className={`text-[15px] leading-[1.15] font-semibold break-words ${
                        p.muted ? "text-[#8B8B8B]" : ""
                      }`}
                    >
                      {p.name}
                    </span>
                    {p.members ? (
                      <span className="flex flex-col gap-0.5">
                        {p.members.map((_, m) => (
                          <Fragment key={m}>
                            {renderTrack(p.id, "row", m)}
                          </Fragment>
                        ))}
                      </span>
                    ) : (
                      renderTrack(p.id, "row")
                    )}
                    <span className="text-right text-sm font-bold text-(--tv-muted) tabular-nums">
                      {p.roundScore}
                    </span>
                    <span className="text-right font-display text-xl font-bold tabular-nums">
                      {p.total}
                    </span>
                  </motion.div>
                  {/* Pinned leaders end here; the page's own players follow. */}
                  {col === 0 && pinned > 0 && i === pinned - 1 && (
                    <div className="my-0.5 h-0.5 shrink-0 rounded bg-[#FDD700]/40" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}

const STANDINGS_GRID =
  "grid grid-cols-[26px_26px_minmax(0,1fr)_44px_40px] gap-2";

/**
 * Few players: a tile per player in start order (the live view of the
 * round), and the ranking in a panel on the side.
 */
function TilesWithStandings({
  players,
  tileOrder,
  renderTrack,
  totalLabel,
}: {
  players: BoardPlayer[];
  tileOrder: string[];
  renderTrack: PlayerBoardProps["renderTrack"];
  totalLabel: string;
}) {
  const tone = useTvTone();
  const byId = new Map(players.map((p) => [p.id, p]));
  const tiles = tileOrder
    .map((id) => byId.get(id))
    .filter((p): p is BoardPlayer => !!p);
  const rows = Math.ceil(tiles.length / 2);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_420px] grid-rows-[minmax(0,1fr)] gap-4">
      <div
        className="grid min-h-0 grid-cols-2 content-start gap-2"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, ${
            players.some((p) => p.members)
              ? MAX_TEAM_TILE_HEIGHT
              : MAX_TILE_HEIGHT
          }px))`,
        }}
      >
        {tiles.map((p) => (
          <div
            key={p.id}
            className={`flex min-h-0 flex-col justify-center gap-1.5 rounded-xl border px-3.5 py-2 transition-colors duration-200 ${
              p.active
                ? "border-(--tv-active-line) bg-(--tv-tile-active)"
                : "border-(--tv-tile-line) bg-(--tv-tile)"
            }`}
          >
            {/* The group shares the name line: a line of its own does not
                fit 16 tiles. */}
            <div className="flex items-baseline gap-2">
              <span
                className={`min-w-0 flex-1 text-base leading-[1.15] font-semibold break-words ${
                  p.muted ? "text-[#8B8B8B]" : ""
                }`}
              >
                {p.name}
              </span>
              <span className="shrink-0">
                <GroupTag group={p.group} tone={tone} />
              </span>
              <span className="shrink-0 text-xs font-semibold text-(--tv-muted)">
                Rnd{" "}
                <span className="font-display text-lg leading-none font-bold text-(--tv-ink) tabular-nums">
                  {p.roundScore}
                </span>
              </span>
            </div>
            {p.members
              ? p.members.map((m, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span
                      className={`truncate text-xs leading-[1.15] font-semibold text-(--tv-muted) ${
                        p.muted ? "opacity-70" : ""
                      }`}
                    >
                      {m.name}
                    </span>
                    {renderTrack(p.id, "tile", i)}
                  </div>
                ))
              : renderTrack(p.id, "tile")}
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-(--tv-panel) px-3.5 py-1.5">
        <div
          className={`${STANDINGS_GRID} py-1.5 text-[11px] font-semibold tracking-[.05em] text-(--tv-muted) uppercase`}
        >
          <span>#</span>
          <span />
          <span>Player</span>
          <span className="text-right">Hit%</span>
          <span className="text-right text-(--tv-ink)">{totalLabel}</span>
        </div>
        <LayoutGroup>
          <div className="flex min-h-0 flex-1 flex-col">
            {players.map((p) => (
              <motion.div
                key={p.id}
                layout
                layoutId={p.id}
                transition={rowLayoutTransition}
                className={`${STANDINGS_GRID} flex-1 basis-0 items-center border-t border-(--tv-line) pt-0.75`}
                style={{
                  minHeight: PANEL_MIN_ROW_HEIGHT,
                  maxHeight: PANEL_MAX_ROW_HEIGHT,
                }}
              >
                <span className="font-display text-base font-bold">
                  {p.position}
                </span>
                <Movement value={p.movement} tone={tone} />
                <span
                  className={`min-w-0 text-[15px] leading-[1.15] font-semibold break-words ${
                    p.muted ? "text-[#8B8B8B]" : ""
                  }`}
                >
                  {p.name}
                </span>
                <span className="text-right text-[13px] text-(--tv-muted) tabular-nums">
                  {p.hitLabel}
                </span>
                <span className="text-right font-display text-xl font-bold tabular-nums">
                  {p.total}
                </span>
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </div>
  );
}

// Round track renderers for the TV boards.

export interface TrackCell {
  state: "done" | "current" | "todo" | "dns";
  hits: number;
  putts: number;
}

function cellClass(state: TrackCell["state"]): string {
  return state === "current"
    ? "bg-[#FDD700] text-[#212121]"
    : state === "todo"
      ? "bg-(--tv-track)"
      : state === "dns"
        ? "bg-transparent"
        : "text-(--tv-ink)";
}

function cellStyle(
  cell: TrackCell,
  tone: "dark" | "light",
): CSSProperties | undefined {
  return cell.state === "done"
    ? {
        background: heatColour(
          cell.putts > 0 ? cell.hits / cell.putts : 0,
          tone,
        ),
      }
    : undefined;
}

/**
 * One cell per distance or station with the hit count; `•` = putting now.
 * With `perLine` set below the cell count the cells wrap onto more lines,
 * and get shorter so the extra lines fit a table row or tile.
 */
export function CountCells({
  cells,
  size,
  dense = false,
  perLine = cells.length,
}: {
  cells: TrackCell[];
  size: "row" | "tile";
  dense?: boolean;
  perLine?: number;
}) {
  const tone = useTvTone();
  const wrapped = perLine < cells.length;
  const cellSize = wrapped
    ? size === "tile"
      ? "h-4.5 rounded-[5px] text-[11px]"
      : "h-3.75 rounded-[4px] text-[10px] leading-none"
    : size === "tile"
      ? "h-6 rounded-md text-[13px]"
      : dense
        ? "h-5.5 rounded text-[11px]"
        : "h-5.5 rounded-[5px] text-xs";
  return (
    <span
      className={`grid ${wrapped ? "gap-x-0.5 gap-y-px" : dense ? "gap-0.5" : "gap-0.75"}`}
      style={{ gridTemplateColumns: `repeat(${perLine}, minmax(0, 1fr))` }}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          className={`grid place-items-center font-bold tabular-nums transition-colors duration-800 ease-in-out ${cellSize} ${cellClass(cell.state)}`}
          style={cellStyle(cell, tone)}
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
