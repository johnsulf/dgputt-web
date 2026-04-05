"use client";

import { useMemo } from "react";
import { LayoutGroup } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import {
  getDistanceLabels,
  computeTotals,
  computeRound,
} from "@/lib/stormputt-utils";
import { AnimatedRow } from "./live-table";

interface LiveStormPuttProps {
  event: LeagueEvent;
  viewMode: "totals" | "currentRound";
  theme: "dark" | "light";
  density: "small" | "medium" | "large";
}

export function LiveStormPutt({
  event,
  viewMode,
  theme,
  density,
}: LiveStormPuttProps) {
  const players = useMemo(() => event.players ?? {}, [event.players]);
  const distanceLabels = useMemo(
    () => getDistanceLabels(event.dstIndex),
    [event.dstIndex],
  );
  const isLight = theme === "light";

  const currentRoundIndex = (event.currentRound ?? 1) - 1;

  const densityStyles =
    density === "small"
      ? { header: "py-1.5 text-xs", cell: "py-1.5 text-sm", score: "text-base" }
      : density === "large"
        ? { header: "py-4 text-base", cell: "py-4 text-lg", score: "text-xl" }
        : { header: "py-3 text-sm", cell: "py-3", score: "text-lg" };

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
          <tr
            className={`border-b ${
              isLight
                ? "border-zinc-300 text-zinc-600"
                : "border-zinc-700 text-zinc-400"
            }`}
          >
            <th className={`w-14 px-3 text-center ${densityStyles.header}`}>
              #
            </th>
            <th className={`px-3 text-left ${densityStyles.header}`}>Player</th>
            {distanceLabels.meter.map((label, i) => (
              <th
                key={i}
                className={`w-18 px-2 text-center ${densityStyles.header}`}
              >
                <div>{label}</div>
                <div
                  className={`text-xs font-normal ${
                    isLight ? "text-zinc-500" : "text-zinc-500"
                  }`}
                >
                  {distanceLabels.feet[i]}
                </div>
              </th>
            ))}
            <th className={`w-20 px-3 text-center ${densityStyles.header}`}>
              Hit%
            </th>
            <th className={`w-18 px-3 text-center ${densityStyles.header}`}>
              Score
            </th>
          </tr>
        </thead>
        <LayoutGroup>
          <tbody>
            {rows.map((row) => (
              <AnimatedRow
                key={row.uid}
                layoutId={row.uid}
                className={
                  isLight
                    ? "border-b border-zinc-200"
                    : "border-b border-zinc-800"
                }
              >
                <td
                  className={`px-3 text-center font-semibold ${densityStyles.cell}`}
                >
                  {row.dns ? (
                    <span className="text-xs text-zinc-500">DNS</span>
                  ) : row.dnf ? (
                    <span className="text-xs text-red-400">DNF</span>
                  ) : (
                    <span>{row.place}</span>
                  )}
                </td>
                <td className={`px-3 font-semibold ${densityStyles.cell}`}>
                  {row.name}
                </td>
                {row.distances.map((d, i) => {
                  const p = row.distancePutts[i] ?? 0;
                  const pct = p > 0 ? (d / p) * 100 : 0;
                  return (
                    <td
                      key={i}
                      className={`px-2 text-center tabular-nums ${densityStyles.cell}`}
                    >
                      {row.dns ? (
                        <span
                          className={
                            isLight ? "text-zinc-500" : "text-zinc-600"
                          }
                        >
                          -
                        </span>
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
                <td
                  className={`px-3 text-center tabular-nums ${densityStyles.cell}`}
                >
                  {row.dns ? (
                    <span
                      className={isLight ? "text-zinc-500" : "text-zinc-600"}
                    >
                      -
                    </span>
                  ) : (
                    `${row.hitPercent.toFixed(1)}%`
                  )}
                </td>
                <td
                  className={`px-3 text-center tabular-nums font-bold ${densityStyles.cell} ${densityStyles.score}`}
                >
                  {row.dns ? (
                    <span
                      className={isLight ? "text-zinc-500" : "text-zinc-600"}
                    >
                      -
                    </span>
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
