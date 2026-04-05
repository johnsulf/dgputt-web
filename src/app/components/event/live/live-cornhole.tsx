"use client";

import { useMemo } from "react";
import { LayoutGroup } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { buildLeaderboardRows } from "@/lib/cornhole-utils";
import { AnimatedRow } from "./live-table";

interface LiveCornholeProps {
  event: LeagueEvent;
  theme: "dark" | "light";
  density: "small" | "medium" | "large";
}

export function LiveCornhole({ event, theme, density }: LiveCornholeProps) {
  const rows = useMemo(() => buildLeaderboardRows(event), [event]);
  const isDoubles = event.playerMode === "doubles";
  const isLight = theme === "light";
  const densityStyles =
    density === "small"
      ? { header: "py-1.5 text-xs", cell: "py-1.5 text-sm", score: "text-base" }
      : density === "large"
        ? { header: "py-4 text-base", cell: "py-4 text-lg", score: "text-xl" }
        : { header: "py-3 text-sm", cell: "py-3", score: "text-lg" };

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
            <th className={`w-20 px-3 text-center ${densityStyles.header}`}>
              Hit%
            </th>
            <th className={`w-18 px-3 text-center ${densityStyles.header}`}>
              Wins
            </th>
          </tr>
        </thead>
        <LayoutGroup>
          <tbody>
            {rows.map((row) => (
              <AnimatedRow
                key={row.participant.id}
                layoutId={row.participant.id}
                className={
                  isLight
                    ? "border-b border-zinc-200"
                    : "border-b border-zinc-800"
                }
              >
                <td
                  className={`px-3 text-center font-semibold ${densityStyles.cell}`}
                >
                  <span>{row.basePosition}</span>
                </td>
                <td className={`px-3 ${densityStyles.cell}`}>
                  <div className="font-semibold">{row.participant.name}</div>
                  {isDoubles && row.participant.division && (
                    <div className="text-xs text-zinc-500">
                      Division {row.participant.division.toUpperCase()}
                    </div>
                  )}
                </td>
                <td
                  className={`px-3 text-center tabular-nums ${densityStyles.cell}`}
                >
                  {row.attempts > 0 ? `${Math.round(row.hitPct * 100)}%` : "-"}
                </td>
                <td
                  className={`px-3 text-center tabular-nums font-bold ${densityStyles.cell} ${densityStyles.score}`}
                >
                  {row.wins}
                </td>
              </AnimatedRow>
            ))}
          </tbody>
        </LayoutGroup>
      </table>
    </div>
  );
}
