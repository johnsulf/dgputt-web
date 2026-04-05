"use client";

import { useMemo } from "react";
import { LayoutGroup } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import {
  type PlayerRow,
  NUM_DISTANCES,
  getDistanceLabels,
  computeTotals,
  computeRound,
} from "@/lib/stormputt-utils";
import { AnimatedRow } from "./live-table";

interface LiveStormPuttProps {
  event: LeagueEvent;
  viewMode: "totals" | "currentRound";
}

export function LiveStormPutt({ event, viewMode }: LiveStormPuttProps) {
  const players = event.players ?? {};
  const distanceLabels = useMemo(
    () => getDistanceLabels(event.dstIndex),
    [event.dstIndex],
  );

  const currentRoundIndex = (event.currentRound ?? 1) - 1;

  const rows = useMemo(() => {
    if (viewMode === "currentRound") {
      return computeRound(players, currentRoundIndex);
    }
    return computeTotals(players);
  }, [players, viewMode, currentRoundIndex]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700 text-sm text-zinc-400">
            <th className="w-14 px-3 py-3 text-center">#</th>
            <th className="px-3 py-3 text-left">Player</th>
            {distanceLabels.meter.map((label, i) => (
              <th key={i} className="w-18 px-2 py-3 text-center">
                <div>{label}</div>
                <div className="text-xs font-normal text-zinc-500">
                  {distanceLabels.feet[i]}
                </div>
              </th>
            ))}
            <th className="w-20 px-3 py-3 text-center">Hit%</th>
            <th className="w-18 px-3 py-3 text-center">Score</th>
          </tr>
        </thead>
        <LayoutGroup>
          <tbody>
            {rows.map((row) => (
              <AnimatedRow
                key={row.uid}
                layoutId={row.uid}
                className={`border-b border-zinc-800 ${positionClass(row.place)}`}
              >
                <td className="px-3 py-3 text-center font-semibold">
                  {row.dns ? (
                    <span className="text-xs text-zinc-500">DNS</span>
                  ) : row.dnf ? (
                    <span className="text-xs text-red-400">DNF</span>
                  ) : (
                    <span className={placeTextClass(row.place)}>
                      {row.place}
                    </span>
                  )}
                </td>
                <td className="px-3 py-3 font-semibold">{row.name}</td>
                {row.distances.map((d, i) => {
                  const p = row.distancePutts[i] ?? 0;
                  const pct = p > 0 ? (d / p) * 100 : 0;
                  return (
                    <td key={i} className="px-2 py-3 text-center tabular-nums">
                      {row.dns ? (
                        <span className="text-zinc-600">-</span>
                      ) : (
                        <div>
                          <span>{d}</span>
                          {p > 0 && (
                            <div className="text-xs text-zinc-500">
                              {pct.toFixed(0)}%
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center tabular-nums">
                  {row.dns ? (
                    <span className="text-zinc-600">-</span>
                  ) : (
                    `${row.hitPercent.toFixed(1)}%`
                  )}
                </td>
                <td className="px-3 py-3 text-center tabular-nums font-bold text-lg">
                  {row.dns ? (
                    <span className="text-zinc-600">-</span>
                  ) : (
                    row.hits
                  )}
                </td>
              </AnimatedRow>
            ))}
          </tbody>
        </LayoutGroup>
      </table>
    </div>
  );
}

function positionClass(place: number): string {
  if (place === 1) return "bg-yellow-500/10";
  if (place === 2) return "bg-zinc-400/10";
  if (place === 3) return "bg-amber-700/10";
  return "";
}

function placeTextClass(place: number): string {
  if (place === 1) return "text-yellow-400";
  if (place === 2) return "text-zinc-300";
  if (place === 3) return "text-amber-600";
  return "";
}
