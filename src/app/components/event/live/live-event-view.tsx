"use client";

import { useState } from "react";
import type { LeagueEvent } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoonIcon,
  Settings01Icon,
  Sun01Icon,
} from "@hugeicons/core-free-icons";
import { LiveStormPutt } from "./live-stormputt";
import { LiveCornhole } from "./live-cornhole";
import { LiveStations } from "./live-stations";

type ViewMode = "totals" | number;
type TableDensity = "small" | "medium" | "large";

interface LiveEventViewProps {
  event: LeagueEvent;
  leagueTitle?: string;
}

export function LiveEventView({ event, leagueTitle }: LiveEventViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("totals");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [density, setDensity] = useState<TableDensity>("medium");
  const isLight = theme === "light";

  const isStormPutt = event.format === "stormputt";
  const isStations = event.format === "stations";
  const totalRounds = event.rounds ?? Math.max(0, ...Object.values(event.players ?? {}).map((p) => p.rounds?.length ?? 0));
  const showViewSelect = (isStormPutt || isStations) && totalRounds > 1;

  return (
    <div
      className={`flex h-dvh flex-col px-6 py-4 transition-colors ${
        isLight ? "bg-zinc-50 text-zinc-900" : "bg-zinc-950 text-zinc-100"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{event.title || "Event"}</h1>
          {leagueTitle && (
            <span
              className={`text-lg ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
            >
              {leagueTitle}
            </span>
          )}
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
              isLight
                ? "border-emerald-700/35 bg-emerald-100"
                : "border-emerald-500/35 bg-emerald-500/12"
            }`}
          >
            <span className="relative flex size-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isLight ? "bg-emerald-600" : "bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex size-2.5 rounded-full ${
                  isLight ? "bg-emerald-600" : "bg-emerald-400"
                }`}
              />
            </span>
            <span
              className={`text-xs font-semibold tracking-wide ${
                isLight ? "text-emerald-800" : "text-emerald-300"
              }`}
            >
              LIVE
            </span>
          </div>
          <Badge
            className={`text-sm ${
              isLight
                ? "border-amber-500/40 bg-amber-100 text-amber-900"
                : "border-yellow-500/35 bg-yellow-500/20 text-yellow-300"
            }`}
          >
            {event.finished
              ? "Finished"
              : event.currentRound && event.currentRound > 0
                ? `Round ${event.currentRound}${event.rounds ? ` / ${event.rounds}` : ""}`
                : "Not Started"}
          </Badge>
        </div>

        {/* View toggle - only for StormPutt with multiple rounds */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isLight
                      ? "bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
                      : "bg-zinc-800 text-zinc-300 hover:text-zinc-100"
                  }`}
                  title="Live view settings"
                  aria-label="Live view settings"
                >
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Display</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                >
                  <HugeiconsIcon
                    icon={isLight ? Sun01Icon : MoonIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                  <span>
                    {isLight ? "Switch to dark mode" : "Switch to light mode"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>Table Size</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={density}
                  onValueChange={(value) => setDensity(value as TableDensity)}
                >
                  <DropdownMenuRadioItem value="small">
                    Small
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="medium">
                    Medium
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="large">
                    Large
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {showViewSelect && (
            <select
              value={viewMode === "totals" ? "totals" : String(viewMode)}
              onChange={(e) => {
                const v = e.target.value;
                setViewMode(v === "totals" ? "totals" : Number(v));
              }}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isLight
                  ? "bg-zinc-200 text-zinc-700"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              <option value="totals">Totals</option>
              {Array.from({ length: totalRounds }, (_, i) => (
                <option key={i} value={String(i)}>
                  Round {i + 1}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div
        className={`flex-1 overflow-auto rounded-xl border text-lg ${
          isLight ? "border-zinc-200" : "border-zinc-800"
        }`}
      >
        {isStormPutt ? (
          <LiveStormPutt
            event={event}
            viewMode={viewMode}
            theme={theme}
            density={density}
            totalRounds={totalRounds}
          />
        ) : isStations ? (
          <LiveStations
            event={event}
            viewMode={viewMode}
            theme={theme}
            density={density}
            totalRounds={totalRounds}
          />
        ) : event.format === "cornhole" ? (
          <LiveCornhole event={event} theme={theme} density={density} />
        ) : (
          <p
            className={`py-10 text-center ${isLight ? "text-zinc-500" : "text-zinc-500"}`}
          >
            Live view is not available for this event format.
          </p>
        )}
      </div>

      {/* Footer watermark */}
      <div
        className={`mt-2 text-center text-xs ${isLight ? "text-zinc-400" : "text-zinc-700"}`}
      >
        dgputt
      </div>
    </div>
  );
}
