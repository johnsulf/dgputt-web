"use client";

import { useMemo } from "react";
import { LayoutGroup } from "motion/react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { buildLeaderboardRows } from "@/lib/cornhole-utils";
import { AnimatedRow } from "./live-table";

interface LiveCornholeProps {
  event: LeagueEvent;
}

export function LiveCornhole({ event }: LiveCornholeProps) {
  const rows = useMemo(() => buildLeaderboardRows(event), [event]);
  const isDoubles = event.playerMode === "doubles";

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-zinc-700 text-sm text-zinc-400">
            <th className="w-14 px-3 py-3 text-center">#</th>
            <th className="px-3 py-3 text-left">Player</th>
            <th className="w-20 px-3 py-3 text-center">Hit%</th>
            <th className="w-18 px-3 py-3 text-center">Wins</th>
          </tr>
        </thead>
        <LayoutGroup>
          <tbody>
            {rows.map((row) => (
              <AnimatedRow
                key={row.participant.id}
                layoutId={row.participant.id}
                className={`border-b border-zinc-800 ${positionClass(row.basePosition)}`}
              >
                <td className="px-3 py-3 text-center font-semibold">
                  <span className={placeTextClass(row.basePosition)}>
                    {row.basePosition}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="font-semibold">{row.participant.name}</div>
                  {isDoubles && row.participant.division && (
                    <div className="text-xs text-zinc-500">
                      Division {row.participant.division.toUpperCase()}
                    </div>
                  )}
                </td>
                <td className="px-3 py-3 text-center tabular-nums">
                  {row.attempts > 0
                    ? `${Math.round(row.hitPct * 100)}%`
                    : "-"}
                </td>
                <td className="px-3 py-3 text-center tabular-nums font-bold text-lg">
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
