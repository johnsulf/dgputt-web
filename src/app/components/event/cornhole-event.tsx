"use client";

import { useMemo, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import type {
  LeagueEvent,
  LeagueEventMatch,
  LeagueInstance,
} from "@/app/interfaces/league";
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
import { cornholeDistanceLabel } from "@/lib/cornhole-utils";
import { useViewSettings } from "@/lib/view-settings";
import { playerModeLabel } from "@/lib/event-utils";
import {
  buildCornholeLiveState,
  buildMatchView,
  isBracket,
  sortMatchesStable,
  type StandingRow,
} from "@/lib/cornhole-live";
import { useLiveEvent } from "./live/use-live-event";
import { rowLayoutTransition } from "./live/live-table";
import {
  MatchScoreGrid,
  MatchStatusPill,
  Movement,
  NowScore,
  StageCell,
} from "./live-parts";
import {
  Breadcrumb,
  CARD_SHADOW,
  HeaderCard,
  RoundSwitcher,
} from "./live-event-header";

interface CornholeEventProps {
  league: LeagueInstance;
  event: LeagueEvent;
}

export function CornholeEvent({
  league,
  event: initialEvent,
}: CornholeEventProps) {
  const { dataUid } = useAuth();
  const isAdmin = !!dataUid && (league.admins?.includes(dataUid) ?? false);

  // Follow the event in real time until it is finished.
  const subscribe = !initialEvent.finished;
  const { event: liveEvent } = useLiveEvent(
    subscribe ? league.id : "",
    subscribe ? initialEvent.id : "",
  );
  const event = liveEvent ?? initialEvent;

  const state = useMemo(() => buildCornholeLiveState(event), [event]);
  const hasStarted = state.currentRoundIndex >= 0;
  const playerCount = Object.keys(event.players ?? {}).length;
  const [{ units }] = useViewSettings();
  const distance = cornholeDistanceLabel(event, units);
  const chips = [
    distance ? `Cornhole ${distance}` : "Cornhole",
    isBracket(event)
      ? "Bracket"
      : event.rounds
        ? `Swiss · ${event.rounds} rounds`
        : "Swiss",
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
        isLive={state.isLive}
        stats={state.roundStats}
        chips={chips}
        hasDistances={distance != null}
        activeLabel="playing"
        roundLabel={state.roundLabels[state.currentRoundIndex]}
      />
      {hasStarted ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-start">
          <Standings
            rows={state.standings}
            showNow={state.isLive}
            bracket={isBracket(event)}
          />
          <RoundMatches
            event={event}
            rounds={state.rounds}
            currentRoundIndex={state.currentRoundIndex}
            roundLabels={state.roundLabels}
            roundShortLabels={state.roundShortLabels}
            isLive={state.isLive}
          />
        </div>
      ) : (
        <RegisteredPlayers event={event} />
      )}
    </div>
  );
}

// Columns: #, movement, player, [now], hit% (hidden on phones), wins.
// Brackets add a last column for the stage a player went out in.
const STANDINGS_GRID = {
  withNow:
    "grid-cols-[32px_30px_minmax(0,1fr)_60px_44px] sm:grid-cols-[32px_30px_minmax(0,1fr)_60px_52px_44px]",
  withoutNow:
    "grid-cols-[32px_30px_minmax(0,1fr)_44px] sm:grid-cols-[32px_30px_minmax(0,1fr)_52px_44px]",
  bracketWithNow:
    "grid-cols-[32px_30px_minmax(0,1fr)_60px_44px_28px] sm:grid-cols-[32px_30px_minmax(0,1fr)_60px_52px_44px_28px]",
  bracketWithoutNow:
    "grid-cols-[32px_30px_minmax(0,1fr)_44px_28px] sm:grid-cols-[32px_30px_minmax(0,1fr)_52px_44px_28px]",
};

function Standings({
  rows,
  showNow,
  bracket,
}: {
  rows: StandingRow[];
  showNow: boolean;
  bracket: boolean;
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
  const grid = `grid gap-2.5 ${
    bracket
      ? showNow
        ? STANDINGS_GRID.bracketWithNow
        : STANDINGS_GRID.bracketWithoutNow
      : showNow
        ? STANDINGS_GRID.withNow
        : STANDINGS_GRID.withoutNow
  }`;

  return (
    <section
      className={`rounded-3xl bg-white px-4 pt-5.5 pb-3 sm:px-6 ${CARD_SHADOW}`}
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="m-0 font-display text-2xl font-bold">Standings</h2>
        <span className="text-xs text-[#8B8B8B]">
          Wins, then hit %, then opponents&apos; strength
        </span>
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
        className={`${grid} items-end border-b border-[#EFEFEF] py-2.5 text-xs font-semibold text-[#8B8B8B]`}
      >
        <span className="text-center">#</span>
        <span />
        <span>Player</span>
        {showNow && <span className="text-center">Match</span>}
        <span className="hidden text-right sm:block">Hit%</span>
        <span className="text-right text-[#212121]">Wins</span>
        {bracket && <span className="text-right">Out</span>}
      </div>

      <LayoutGroup>
        {visible.map((row) => (
          <motion.div
            key={row.id}
            layout
            layoutId={row.id}
            transition={rowLayoutTransition}
            className={`${grid} items-center border-b border-[#F5F5F5] py-2 last:border-b-0`}
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
            {showNow && (
              <NowScore
                now={row.now}
                state={row.matchState}
                tone="light"
                className="text-[13px]"
              />
            )}
            <span className="hidden text-right text-sm text-[#5A5A5A] tabular-nums sm:block">
              {row.hitLabel}
            </span>
            <span className="text-right font-display text-[22px] font-bold tabular-nums">
              {row.wins}
            </span>
            {bracket && <StageCell out={row.out} tone="light" />}
          </motion.div>
        ))}
      </LayoutGroup>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm text-[#8B8B8B]">
          No players yet.
        </p>
      )}
    </section>
  );
}

function RoundMatches({
  event,
  rounds,
  currentRoundIndex,
  roundLabels,
  roundShortLabels,
  isLive,
}: {
  event: LeagueEvent;
  rounds: LeagueEventMatch[][];
  currentRoundIndex: number;
  roundLabels: string[];
  roundShortLabels: string[];
  isLive: boolean;
}) {
  // null follows the active round, so the next round shows up once it starts.
  const [picked, setPicked] = useState<number | null>(null);
  const selected =
    picked != null && picked < rounds.length ? picked : currentRoundIndex;

  const matches = useMemo(
    () =>
      sortMatchesStable(rounds[selected] ?? []).map((match, i) =>
        buildMatchView(event, match, i),
      ),
    [event, rounds, selected],
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="m-0 shrink-0 font-display text-2xl font-bold">
          {roundLabels[selected] ?? `Round ${selected + 1}`}
        </h2>
        <RoundSwitcher
          count={rounds.length}
          labels={roundShortLabels}
          selected={selected}
          liveIndex={isLive ? currentRoundIndex : -1}
          onSelect={(i) => setPicked(i === currentRoundIndex ? null : i)}
        />
      </div>

      {matches.length === 0 ? (
        <p
          className={`rounded-[20px] bg-white py-10 text-center text-sm text-[#8B8B8B] ${CARD_SHADOW}`}
        >
          No matches in this round yet.
        </p>
      ) : (
        matches.map((match) => (
          <div
            key={match.key}
            className={`flex flex-col gap-2.5 rounded-[20px] bg-white px-4.5 pt-3.5 pb-4 ${CARD_SHADOW}`}
          >
            <div className="flex items-center gap-2.5 text-xs text-[#8B8B8B]">
              <span className="font-semibold">Match {match.label}</span>
              {match.progress && <span>{match.progress}</span>}
              <MatchStatusPill match={match} tone="light" />
            </div>
            <MatchScoreGrid match={match} tone="light" />
          </div>
        ))
      )}
    </section>
  );
}

function RegisteredPlayers({ event }: { event: LeagueEvent }) {
  const players = Object.entries(event.players ?? {});
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
            <TableHead className="w-24 text-center">Division</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map(([uid, player]) => (
            <TableRow key={uid}>
              <TableCell className="font-medium">
                {player.displayName ?? player.name ?? "Unknown"}
              </TableCell>
              <TableCell className="text-center">
                {player.division ?? "-"}
              </TableCell>
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
