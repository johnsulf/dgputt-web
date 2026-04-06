"use client";

import { useMemo } from "react";
import { LayoutGroup } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import {
  getStations,
  getStationLabel,
  getStationDistance,
  getDistanceUnit,
  computeStationsTotals,
  computeStationsRound,
} from "@/lib/stations-utils";
import { AnimatedRow } from "./live-table";

interface LiveStationsProps {
  event: LeagueEvent;
  viewMode: "totals" | number;
  theme: "dark" | "light";
  density: "small" | "medium" | "large";
  totalRounds: number;
}

export function LiveStations({
  event,
  viewMode,
  theme,
  density,
  totalRounds,
}: LiveStationsProps) {
  const players = useMemo(() => event.players ?? {}, [event.players]);
  const stations = useMemo(() => getStations(event), [event]);
  const distanceUnit = useMemo(() => getDistanceUnit(event), [event]);
  const showWeight = useMemo(
    () => stations.some((s) => s.weight !== 1),
    [stations],
  );
  const isLight = theme === "light";

  const showThru = viewMode === "totals" && totalRounds > 1;

  const densityStyles =
    density === "small"
      ? {
          header: "py-1.5 text-xs",
          cell: "py-1.5 text-sm",
          score: "text-base",
        }
      : density === "large"
        ? {
            header: "py-4 text-base",
            cell: "py-4 text-lg",
            score: "text-xl",
          }
        : { header: "py-3 text-sm", cell: "py-3", score: "text-lg" };

  const rows = useMemo(() => {
    if (typeof viewMode === "number") {
      return computeStationsRound(players, stations, viewMode);
    }
    return computeStationsTotals(players, stations);
  }, [players, stations, viewMode]);

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
            {showThru && (
              <th className={`w-16 px-2 text-center ${densityStyles.header}`}>
                Thru
              </th>
            )}
            {stations.map((s, i) => {
              const dist = getStationDistance(s, distanceUnit);
              return (
                <th
                  key={s.key}
                  className={`w-18 px-2 text-center align-bottom ${densityStyles.header}`}
                >
                  <div>{getStationLabel(s, i)}</div>
                  <div
                    className={`text-xs font-normal ${
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    {dist ?? "\u00A0"}
                  </div>
                  {showWeight && (
                    <div
                      className={`text-xs font-normal ${
                        isLight ? "text-zinc-500" : "text-zinc-500"
                      }`}
                    >
                      {s.weight !== 1 ? `×${s.weight}` : "\u00A0"}
                    </div>
                  )}
                </th>
              );
            })}
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
                {showThru && (
                  <td
                    className={`px-2 text-center tabular-nums ${densityStyles.cell} ${
                      isLight ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    {row.dns ? "-" : `${row.roundsPlayed}/${totalRounds}`}
                  </td>
                )}
                {row.stationHits.map((h, i) => {
                  const p = row.stationPutts[i] ?? 0;
                  const score = row.stationScores[i] ?? 0;
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
                          <span>{score}</span>
                          {p > 0 && (
                            <div className="text-xs text-zinc-500">
                              {h}/{p}
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
                    row.totalScore
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
