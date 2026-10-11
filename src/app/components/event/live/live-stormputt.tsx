"use client";

import { useMemo } from "react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { formatLabel } from "@/lib/event-utils";
import { getDistanceLabels } from "@/lib/stormputt-utils";
import { useTvSettings } from "@/lib/view-settings";
import {
  buildStormPuttLiveState,
  distanceRangeLabel,
} from "@/lib/stormputt-live";
import { RoundProgressBar } from "../live-parts";
import {
  CountCells,
  PlayerBoard,
  useBoardPage,
  type BoardPlayer,
} from "./player-board";
import { TvCanvas, TvFooter, TvTopBar, useTvTone } from "./tv-board";

export function LiveStormPuttBoard({ event }: { event: LeagueEvent }) {
  const tone = useTvTone();
  const state = useMemo(() => buildStormPuttLiveState(event), [event]);
  const { units } = useTvSettings();
  const distances = useMemo(() => {
    const labels = getDistanceLabels(event.dstIndex);
    return units === "ft" ? labels.feet : labels.meter;
  }, [event.dstIndex, units]);
  const { roundStats, currentRoundIndex, isLive, standings } = state;

  const players: BoardPlayer[] = useMemo(
    () =>
      standings.map((row) => ({
        id: row.id,
        position: row.position,
        movement: row.movement,
        name: row.name,
        muted: false,
        active: row.round.status === "putting",
        roundScore:
          row.round.status === "not-started"
            ? "–"
            : String(row.round.roundHits),
        total: row.hits,
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

  const boardPage = useBoardPage(players);
  const tileOrder = useMemo(
    () => state.participants.map(([id]) => id),
    [state.participants],
  );

  const subtitle = [
    formatLabel(event.format) || "StormPutt",
    distanceRangeLabel(distances),
    event.location,
  ]
    .filter(Boolean)
    .join(" · ");
  const round = currentRoundIndex + 1;

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

      <PlayerBoard
        players={players}
        boardPage={boardPage}
        tileOrder={tileOrder}
        totalLabel="Hits"
        trackWidth={196}
        trackHeader={
          <span className="grid grid-cols-6 gap-0.75 text-center">
            {distances.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        }
        renderTrack={(id, size, member) => {
          const row = rowsById.get(id);
          const round =
            member != null ? row?.members?.[member]?.round : row?.round;
          return <CountCells cells={round?.cells ?? []} size={size} />;
        }}
      />

      <TvFooter
        page={boardPage.page}
        pages={boardPage.pages}
        legend={
          currentRoundIndex >= 0
            ? `Round ${round} per distance: numbers = hits of 6, yellow = putting now · Rnd = round ${round} score · Hits = event total`
            : "Hits = event total"
        }
      />
    </TvCanvas>
  );
}
