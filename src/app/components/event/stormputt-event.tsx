"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth-context";
import { formatLabel, playerModeLabel } from "@/lib/event-utils";
import { getDistanceLabels } from "@/lib/stormputt-utils";
import { useViewSettings } from "@/lib/view-settings";
import {
  buildStormPuttLiveState,
  distanceRangeLabel,
  roundProgress,
  type RoundProgress,
  type StormPuttStandingRow,
} from "@/lib/stormputt-live";
import { useLiveEvent } from "./live/use-live-event";
import { rowLayoutTransition } from "./live/live-table";
import { GroupTag, Movement, heatColour } from "./live-parts";
import {
  Breadcrumb,
  CARD_SHADOW,
  HeaderCard,
  RoundSwitcher,
} from "./live-event-header";

interface StormPuttEventProps {
  league: LeagueInstance;
  event: LeagueEvent;
}

export function StormPuttEvent({
  league,
  event: initialEvent,
}: StormPuttEventProps) {
  const { dataUid } = useAuth();
  const isAdmin = !!dataUid && (league.admins?.includes(dataUid) ?? false);

  // Follow the event in real time until it is finished.
  const subscribe = !initialEvent.finished;
  const { event: liveEvent } = useLiveEvent(
    subscribe ? league.id : "",
    subscribe ? initialEvent.id : "",
  );
  const event = liveEvent ?? initialEvent;

  const state = useMemo(() => buildStormPuttLiveState(event), [event]);
  const [{ units }] = useViewSettings();
  const distances = useMemo(() => {
    const labels = getDistanceLabels(event.dstIndex);
    return units === "ft" ? labels.feet : labels.meter;
  }, [event.dstIndex, units]);
  const hasStarted =
    state.roundCount > 0 && ((event.currentRound ?? 0) > 0 || !!event.finished);

  const playerCount = Object.keys(event.players ?? {}).length;
  const chips = [
    formatLabel(event.format) || "StormPutt",
    distanceRangeLabel(distances),
    ...(event.playerMode && event.playerMode !== "singles"
      ? [playerModeLabel(event.playerMode)]
      : []),
    ...(playerCount > 0
      ? [`${playerCount} player${playerCount !== 1 ? "s" : ""}`]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb league={league} event={event} />
      <HeaderCard
        league={league}
        event={event}
        isAdmin={isAdmin}
        isLive={state.isLive && hasStarted}
        stats={state.roundStats}
        chips={chips}
        activeLabel="putting"
        hasDistances
        roundLabel={`Round ${state.currentRoundIndex + 1}`}
      />
      {hasStarted ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
          <Standings
            rows={state.standings}
            distances={distances}
            showCurrent={state.isLive}
          />
          <RoundColumn
            participants={state.participants}
            teams={state.teams}
            roundCount={state.roundCount}
            currentRoundIndex={state.currentRoundIndex}
            isLive={state.isLive}
            distances={distances}
          />
        </div>
      ) : (
        <RegisteredPlayers event={event} />
      )}
    </div>
  );
}

// Columns: #, movement, player, 6 distances (hidden on phones), hit%, hits.
const STANDINGS_GRID =
  "grid gap-2 grid-cols-[32px_28px_minmax(0,1fr)_52px_44px] sm:grid-cols-[32px_28px_minmax(0,1fr)_276px_52px_44px]";

function Standings({
  rows,
  distances,
  showCurrent,
}: {
  rows: StormPuttStandingRow[];
  /** Distance labels in the viewer's unit. */
  distances: string[];
  showCurrent: boolean;
}) {
  const divisions = useMemo(
    () =>
      Array.from(
        new Set(rows.map((r) => r.division).filter((d): d is string => !!d)),
      ).sort(),
    [rows],
  );
  const [division, setDivision] = useState<string | null>(null);
  const visible = division ? rows.filter((r) => r.division === division) : rows;

  return (
    <section
      className={`rounded-3xl bg-white px-4 pt-5.5 pb-3 sm:px-6 ${CARD_SHADOW}`}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="m-0 font-display text-2xl font-bold">Standings</h2>
        <span className="text-xs text-[#8B8B8B]">Most hits, then hit %</span>
      </div>

      {divisions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {[null, ...divisions].map((d) => (
            <Badge
              key={d ?? "all"}
              variant={division === d ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setDivision(d)}
            >
              {d ?? "All"}
            </Badge>
          ))}
        </div>
      )}

      <div
        className={`${STANDINGS_GRID} items-end border-b border-[#EFEFEF] py-2.5 text-xs font-semibold text-[#8B8B8B]`}
      >
        <span className="text-center">#</span>
        <span />
        <span>Player</span>
        <span className="hidden grid-cols-6 gap-1 text-center sm:grid">
          {distances.map((d) => (
            <span key={d} className="text-[#212121]">
              {d}
            </span>
          ))}
        </span>
        <span className="text-right">Hit%</span>
        <span className="text-right text-[#212121]">Hits</span>
      </div>

      <LayoutGroup>
        {visible.map((row) => (
          <motion.div
            key={row.id}
            layout
            layoutId={row.id}
            transition={rowLayoutTransition}
            className={`${STANDINGS_GRID} items-center border-b border-[#F5F5F5] py-1.75 last:border-b-0`}
          >
            <span className="text-center font-display text-base font-bold">
              {row.position}
            </span>
            <Movement value={row.movement} tone="light" />
            <span className="flex min-w-0 items-center gap-2">
              <span className="min-w-0 text-[15px] leading-[1.2] font-semibold break-words">
                {row.name}
              </span>
              {row.pdgaNumber && (
                <a
                  href={`https://www.pdga.com/player/${row.pdgaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 rounded-full bg-linear-to-l from-[#008d6f] to-[#003F6A] px-2 py-0.5 text-[10px] font-semibold text-white sm:inline"
                >
                  #{row.pdgaNumber}
                </a>
              )}
            </span>
            <span className="hidden grid-cols-6 gap-1 sm:grid">
              {row.distanceRates.map((rate, i) => {
                const current = showCurrent && row.round.currentDistance === i;
                return (
                  <span
                    key={i}
                    className={`flex h-9.5 items-center justify-center rounded-[9px] border-2 text-sm leading-none font-bold tabular-nums transition-colors duration-800 ease-in-out ${
                      current ? "border-[#009E73]" : "border-transparent"
                    }`}
                    style={{ background: heatColour(rate ?? 0, "light") }}
                  >
                    {rate == null ? "–" : `${Math.round(rate * 100)}%`}
                  </span>
                );
              })}
            </span>
            <span className="text-right text-sm text-[#5A5A5A] tabular-nums">
              {row.hitLabel}
            </span>
            <span className="text-right font-display text-[22px] font-bold tabular-nums">
              {row.hits}
            </span>
          </motion.div>
        ))}
      </LayoutGroup>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-[#8B8B8B]">
          No players yet.
        </p>
      )}

      {showCurrent && visible.length > 0 && (
        <div className="hidden items-center gap-2 pt-3 pb-1.5 text-xs text-[#8B8B8B] sm:flex">
          <span className="size-3.5 rounded border-2 border-[#009E73]" />
          Distance being putted now
        </div>
      )}
    </section>
  );
}

// From this many players the live Round column shows only who is putting
// now and who just finished, with a "Show all" button.
const FOCUS_FROM = 40;
// How many of the most recent finishers stay listed.
const JUST_FINISHED_KEEP = 6;

/**
 * Players seen going from putting to finished while this page is open,
 * most recent last. Uses the "adjust state while rendering" pattern, so the
 * list updates in the same render as the new event data.
 */
function useJustFinished(
  statuses: Map<string, RoundProgress["status"]>,
): string[] {
  const [prev, setPrev] = useState(statuses);
  const [recent, setRecent] = useState<string[]>([]);
  if (prev !== statuses) {
    const newly = [...statuses]
      .filter(([id, s]) => s === "finished" && prev.get(id) === "putting")
      .map(([id]) => id);
    setPrev(statuses);
    if (newly.length > 0) {
      setRecent((r) =>
        [...r.filter((id) => !newly.includes(id)), ...newly].slice(
          -JUST_FINISHED_KEEP,
        ),
      );
    }
  }
  // A new round resets everyone, so drop players who are no longer finished.
  return recent.filter((id) => statuses.get(id) === "finished");
}

const ROUND_GRID =
  "grid grid-cols-[minmax(0,1fr)_150px_32px] gap-2 sm:grid-cols-[minmax(0,1fr)_186px_36px] sm:gap-3";

function RoundColumn({
  participants,
  teams,
  roundCount,
  currentRoundIndex,
  isLive,
  distances,
}: {
  participants: ReturnType<typeof buildStormPuttLiveState>["participants"];
  teams: ReturnType<typeof buildStormPuttLiveState>["teams"];
  roundCount: number;
  currentRoundIndex: number;
  isLive: boolean;
  /** Distance labels in the viewer's unit. */
  distances: string[];
}) {
  // null follows the latest round, so a newly started round shows up.
  const [picked, setPicked] = useState<number | null>(null);
  const selected =
    picked != null && picked < roundCount ? picked : currentRoundIndex;

  // Stable order: never re-sorted while the round is being played.
  const rows = useMemo(
    () =>
      participants.map(([id, player]) => ({
        id,
        name: player.displayName ?? player.name ?? "Unknown",
        progress: roundProgress(player, selected),
        members: teams.get(id)?.map((m) => ({
          name: m.name,
          progress: roundProgress(m.player, selected),
        })),
      })),
    [participants, teams, selected],
  );

  // Live statuses for the current round, to spot who just finished.
  const liveStatuses = useMemo(
    () =>
      new Map(
        participants.map(([id, player]) => [
          id,
          roundProgress(player, currentRoundIndex).status,
        ]),
      ),
    [participants, currentRoundIndex],
  );
  const justFinished = useJustFinished(liveStatuses);
  const [showAll, setShowAll] = useState(false);

  // Big fields: only who is putting now and who just finished, in the same
  // stable order, so nobody has to scroll past 40 cards.
  const focusable =
    isLive && selected === currentRoundIndex && rows.length >= FOCUS_FROM;
  const focused = focusable && !showAll;
  const shown = focused
    ? rows.filter(
        (r) => r.progress.status === "putting" || justFinished.includes(r.id),
      )
    : rows;

  return (
    <section className="flex flex-col gap-2">
      <div className="mb-1 flex items-center gap-3">
        <h2 className="m-0 shrink-0 font-display text-2xl font-bold">
          Round {selected + 1}
        </h2>
        <RoundSwitcher
          count={roundCount}
          selected={selected}
          liveIndex={isLive ? currentRoundIndex : -1}
          onSelect={(i) => setPicked(i === currentRoundIndex ? null : i)}
        />
      </div>

      {focused && (
        <p className="-mt-1 px-1 text-xs text-[#8B8B8B]">
          Showing players putting now and those who just finished.
        </p>
      )}

      <div
        className={`${ROUND_GRID} px-4 text-[11px] font-semibold text-[#8B8B8B]`}
      >
        <span>Player</span>
        <span className="grid grid-cols-6 gap-1 text-center">
          {distances.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </span>
        <span className="text-right">Rnd</span>
      </div>

      {/* Gap matches the standings row height so both columns grow evenly. */}
      <div className="flex flex-col gap-[9px]">
        {shown.map((row) => (
          <RoundCard
            key={row.id}
            name={row.name}
            progress={row.progress}
            members={row.members}
          />
        ))}
        {focused && shown.length === 0 && (
          <p
            className={`rounded-[14px] bg-white px-4 py-6 text-center text-sm text-[#8B8B8B] ${CARD_SHADOW}`}
          >
            Nobody is putting right now.
          </p>
        )}
      </div>

      {focusable && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="self-start px-1 py-1 text-sm font-semibold text-[#4280AD] hover:text-[#212121] hover:underline"
        >
          {showAll
            ? "Show only putting and just finished"
            : `Show all ${rows.length} players`}
        </button>
      )}
    </section>
  );
}

function RoundCells({ progress }: { progress: RoundProgress }) {
  return (
    <span className="grid grid-cols-6 gap-1">
      {progress.cells.map((cell, i) => (
        <span
          key={i}
          className={`grid h-7 place-items-center rounded-[7px] text-[13px] font-bold tabular-nums transition-colors duration-800 ease-in-out ${
            cell.state === "current"
              ? "bg-[#009E73] text-white"
              : cell.state === "todo"
                ? "bg-[#F1F1F1]"
                : "text-[#212121]"
          }`}
          style={
            cell.state === "done"
              ? {
                  background: heatColour(
                    cell.putts > 0 ? cell.hits / cell.putts : 0,
                    "light",
                  ),
                }
              : undefined
          }
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

function RoundCard({
  name,
  progress,
  members,
}: {
  name: string;
  progress: RoundProgress;
  /** Doubles: one score row per player; `progress` is the team's sum. */
  members?: { name: string; progress: RoundProgress }[];
}) {
  const notStarted = progress.status === "not-started";
  const ink = notStarted ? "text-[#8B8B8B]" : "text-[#212121]";

  if (members) {
    return (
      <div
        className={`flex flex-col gap-2 rounded-[14px] bg-white px-4 py-2.5 ${CARD_SHADOW}`}
      >
        <div className="flex items-baseline gap-2">
          <span
            className={`min-w-0 flex-1 text-[15px] leading-[1.2] font-semibold break-words ${ink}`}
          >
            {name}
          </span>
          <GroupTag group={progress.group} tone="light" />
          <span
            className={`font-display text-[22px] leading-none font-bold tabular-nums ${ink}`}
          >
            {notStarted ? "–" : progress.roundHits}
          </span>
        </div>
        {members.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-[#5A5A5A]">
              {m.name}
            </span>
            <RoundCells progress={m.progress} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${ROUND_GRID} items-center rounded-[14px] bg-white px-4 py-2 ${CARD_SHADOW}`}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className={`text-[15px] leading-[1.2] font-semibold break-words ${ink}`}
        >
          {name}
        </span>
        <GroupTag group={progress.group} tone="light" />
      </span>
      <RoundCells progress={progress} />
      <span
        className={`text-right font-display text-[22px] leading-none font-bold tabular-nums ${ink}`}
      >
        {notStarted ? "–" : progress.roundHits}
      </span>
    </div>
  );
}

function RegisteredPlayers({ event }: { event: LeagueEvent }) {
  const players = Object.entries(event.players ?? {})
    .map(([uid, p]) => ({
      uid,
      name: p.displayName ?? p.name ?? "Unknown",
      pdgaNumber: p.pdgaNumber,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section
      className={`rounded-3xl bg-white px-4 py-5 sm:px-6 ${CARD_SHADOW}`}
    >
      <h2 className="mb-4 font-display text-2xl font-bold">
        Registered Players
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead className="w-28">PDGA#</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((row) => (
            <TableRow key={row.uid}>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.pdgaNumber ?? "-"}</TableCell>
            </TableRow>
          ))}
          {players.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={2}
                className="py-10 text-center text-muted-foreground"
              >
                No players registered yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
