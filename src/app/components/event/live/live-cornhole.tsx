"use client";

import { useMemo } from "react";
import { LayoutGroup, motion } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import {
  buildCornholeLiveState,
  buildMatchView,
  isBracket,
  sortMatchesStable,
} from "@/lib/cornhole-live";
import { cornholeDistanceLabel } from "@/lib/cornhole-utils";
import { useTvSettings } from "@/lib/view-settings";
import {
  MatchScoreGrid,
  MatchStatusPill,
  Movement,
  NowScore,
  RoundProgressBar,
  StageCell,
} from "../live-parts";
import { rowLayoutTransition } from "./live-table";
import { TvCanvas, TvFooter, TvTopBar, usePaging, useTvTone } from "./tv-board";

// Match tiles by number of matches played at the same time:
//   up to 8   2x4 tiles
//   9-12      3x4 tiles
//   13+       3x4 tiles, paging every 10 seconds
const TWO_COLUMNS_MAX = 8;
const TILES_PER_PAGE = 12;
// The standings panel shows at most this many players.
const STANDINGS_MAX = 16;

// Tiles and standings rows grow to fill the board, up to the size they have
// with 8 matches / 16 players. Fewer leaves empty space below.
const MAX_TILE_HEIGHT = 142;
const MIN_STANDINGS_ROW_HEIGHT = 30;
const MAX_STANDINGS_ROW_HEIGHT = 38;

// Brackets add a last column for the stage a player went out in.
const STANDINGS_GRID =
  "grid grid-cols-[26px_30px_minmax(0,1fr)_54px_44px_32px] gap-2";
const BRACKET_STANDINGS_GRID =
  "grid grid-cols-[26px_30px_minmax(0,1fr)_54px_44px_32px_26px] gap-2";

export function LiveCornholeBoard({ event }: { event: LeagueEvent }) {
  const tone = useTvTone();
  const bracket = isBracket(event);
  const standingsGrid = bracket ? BRACKET_STANDINGS_GRID : STANDINGS_GRID;
  const { units } = useTvSettings();
  const state = useMemo(() => buildCornholeLiveState(event), [event]);
  const { roundStats, currentRoundIndex, isLive } = state;

  const matches = useMemo(
    () =>
      sortMatchesStable(state.rounds[currentRoundIndex] ?? []).map((match, i) =>
        buildMatchView(event, match, i),
      ),
    [event, state.rounds, currentRoundIndex],
  );
  const tileCols = matches.length <= TWO_COLUMNS_MAX ? 2 : 3;
  const { page, pages } = usePaging(matches.length, TILES_PER_PAGE);
  const pageMatches =
    pages > 1
      ? matches.slice(page * TILES_PER_PAGE, (page + 1) * TILES_PER_PAGE)
      : matches;
  const tileRows = Math.max(1, Math.ceil(pageMatches.length / tileCols));
  const standings = state.standings.slice(0, STANDINGS_MAX);
  const topOnly = state.standings.length > STANDINGS_MAX;
  const distance = cornholeDistanceLabel(event, units);
  const subtitle = [
    distance ? `Cornhole ${distance}` : "Cornhole",
    isBracket(event) ? "Bracket" : "Swiss",
    event.location,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <TvCanvas>
      <TvTopBar
        event={event}
        subtitle={subtitle}
        isLive={isLive}
        roundIndex={currentRoundIndex}
        roundName={state.roundLabels[currentRoundIndex]}
        right={
          roundStats.total > 0 && (
            <div className="ml-auto flex shrink-0 items-center gap-3 text-[13px] text-(--tv-muted)">
              {roundStats.finished} of {roundStats.total} finished
              <RoundProgressBar
                stats={roundStats}
                tone={tone}
                className="h-1.5 w-35 rounded-[3px]"
              />
            </div>
          )
        }
      />

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_420px] grid-rows-[minmax(0,1fr)] gap-4">
        <div
          className="grid content-start gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${tileCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${tileRows}, minmax(0, ${MAX_TILE_HEIGHT}px))`,
          }}
        >
          {matches.length === 0 && (
            <div className="col-span-2 flex items-center justify-center text-[#8B8B8B]">
              Waiting for the first round.
            </div>
          )}
          {pageMatches.map((match) => {
            const live = match.status === "live";
            return (
              <div
                key={match.key}
                className={`flex min-h-0 flex-col justify-between gap-2 rounded-[14px] border px-4 pt-2.5 pb-3 transition-colors duration-200 ${
                  live
                    ? "border-(--tv-active-line) bg-(--tv-tile-active)"
                    : "border-(--tv-tile-line) bg-(--tv-tile)"
                }`}
              >
                <div className="flex items-center gap-2 text-xs whitespace-nowrap text-(--tv-muted)">
                  <span className="font-bold text-(--tv-ink)">
                    Match {match.label}
                  </span>
                  {/* Three across has no room for "Waiting for basket";
                      the "Not started" pill says the same. */}
                  {match.progress &&
                    !(tileCols > 2 && match.status === "upcoming") && (
                      <span>{match.progress}</span>
                    )}
                  <MatchStatusPill match={match} tone={tone} />
                </div>
                <MatchScoreGrid
                  match={match}
                  tone={tone}
                  compact={tileCols > 2}
                />
              </div>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-col overflow-hidden rounded-[14px] bg-(--tv-panel) px-3.5 py-1.5">
          <div
            className={`${standingsGrid} py-1.5 text-[11px] font-semibold tracking-[.05em] text-(--tv-muted) uppercase`}
          >
            <span>#</span>
            <span />
            <span>{topOnly ? `Player · top ${STANDINGS_MAX}` : "Player"}</span>
            <span className="text-center">Match</span>
            <span className="text-right">Hit%</span>
            <span className="text-right text-(--tv-ink)">W</span>
            {bracket && <span className="text-right">Out</span>}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <LayoutGroup>
              {standings.map((row) => (
                <motion.div
                  key={row.id}
                  layout
                  layoutId={row.id}
                  transition={rowLayoutTransition}
                  className={`${standingsGrid} flex-1 basis-0 items-center border-t border-(--tv-line) pt-0.75`}
                  style={{
                    minHeight: MIN_STANDINGS_ROW_HEIGHT,
                    maxHeight: MAX_STANDINGS_ROW_HEIGHT,
                  }}
                >
                  <span className="font-display text-base font-bold">
                    {row.position}
                  </span>
                  <Movement value={row.movement} tone={tone} />
                  <span className="min-w-0 text-[15px] leading-[1.15] font-semibold break-words">
                    {row.name}
                  </span>
                  <NowScore
                    now={row.now}
                    state={row.matchState}
                    tone={tone}
                    className="text-xs"
                  />
                  <span className="text-right text-[13px] text-(--tv-muted) tabular-nums">
                    {row.hitLabel}
                  </span>
                  <span className="text-right font-display text-xl font-bold tabular-nums">
                    {row.wins}
                  </span>
                  {bracket && <StageCell out={row.out} tone={tone} />}
                </motion.div>
              ))}
            </LayoutGroup>
          </div>
        </div>
      </div>

      <TvFooter
        page={page}
        pages={pages}
        legend="Yellow outline = match in progress · “Match” = live score of each player’s current match, or Waiting / Done"
      />
    </TvCanvas>
  );
}
