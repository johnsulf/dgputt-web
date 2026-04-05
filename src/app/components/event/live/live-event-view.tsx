"use client";

import { useState, useEffect, useCallback } from "react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import { LiveStormPutt } from "./live-stormputt";
import { LiveCornhole } from "./live-cornhole";

type ViewMode = "totals" | "currentRound";

interface LiveEventViewProps {
  event: LeagueEvent;
  leagueTitle?: string;
}

export function LiveEventView({ event, leagueTitle }: LiveEventViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("totals");
  const [autoRotate, setAutoRotate] = useState(false);

  const isStormPutt = event.format === "stormputt";
  const hasMultipleRounds = (event.rounds ?? 0) > 1;

  const toggleView = useCallback(() => {
    setViewMode((prev) => (prev === "totals" ? "currentRound" : "totals"));
  }, []);

  useEffect(() => {
    if (!autoRotate || !hasMultipleRounds) return;
    const interval = setInterval(toggleView, 15000);
    return () => clearInterval(interval);
  }, [autoRotate, hasMultipleRounds, toggleView]);

  return (
    <div className="flex h-dvh flex-col px-6 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-zinc-100">
            {event.title || "Event"}
          </h1>
          {leagueTitle && (
            <span className="text-lg text-zinc-500">{leagueTitle}</span>
          )}
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-sm">
            {event.finished
              ? "Finished"
              : `Round ${event.currentRound ?? 1}${event.rounds ? ` / ${event.rounds}` : ""}`}
          </Badge>
        </div>

        {/* View toggle — only for StormPutt with multiple rounds */}
        {isStormPutt && hasMultipleRounds && (
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-zinc-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setViewMode("totals");
                  setAutoRotate(false);
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "totals"
                    ? "bg-zinc-600 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Totals
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("currentRound");
                  setAutoRotate(false);
                }}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "currentRound"
                    ? "bg-zinc-600 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Current Round
              </button>
            </div>
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                autoRotate
                  ? "bg-emerald-600/30 text-emerald-400"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
              title="Auto-rotate between views"
            >
              Auto
            </button>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="flex-1 overflow-auto rounded-xl text-lg">
        {isStormPutt ? (
          <LiveStormPutt event={event} viewMode={viewMode} />
        ) : event.format === "cornhole" ? (
          <LiveCornhole event={event} />
        ) : (
          <p className="py-10 text-center text-zinc-500">
            Live view is not available for this event format.
          </p>
        )}
      </div>

      {/* Footer watermark */}
      <div className="mt-2 text-center text-xs text-zinc-700">dgputt</div>
    </div>
  );
}
