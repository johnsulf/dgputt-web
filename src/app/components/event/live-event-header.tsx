"use client";

import { useState } from "react";
import Link from "next/link";
import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import type { RoundStats } from "@/lib/cornhole-live";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Settings02Icon,
  Share08Icon,
  Tv01Icon,
} from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatEventDate } from "@/lib/event-utils";
import {
  tvSettingsQuery,
  useViewSettings,
  type DistanceUnit,
  type TvTheme,
} from "@/lib/view-settings";
import { LiveDot, RoundProgressBar } from "./live-parts";

// Breadcrumb and header card shared by the live event pages.

export const CARD_SHADOW = "shadow-[0_1px_2px_rgba(0,0,0,.08)]";

export function Breadcrumb({
  league,
  event,
}: {
  league: LeagueInstance;
  event: LeagueEvent;
}) {
  const chevron = (
    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4.5 shrink-0" />
  );
  return (
    <nav className="flex min-w-0 items-center gap-1.5 text-sm text-[#8B8B8B]">
      <Link href="/leagues" className="shrink-0 hover:text-[#212121]">
        Leagues
      </Link>
      {chevron}
      <Link
        href={`/leagues/${league.id}`}
        className="truncate hover:text-[#212121]"
      >
        {league.title || "League"}
      </Link>
      {chevron}
      <span className="truncate font-semibold text-[#212121]">
        {event.title || "Event"}
      </span>
    </nav>
  );
}

interface HeaderCardProps {
  league: LeagueInstance;
  event: LeagueEvent;
  isAdmin: boolean;
  isLive: boolean;
  stats: RoundStats;
  /** Chip labels; the first one (the format) is shown in brand yellow. */
  chips: string[];
  /** Word for participants in progress, e.g. "playing" or "putting". */
  activeLabel: string;
  /** Shown before the legend, e.g. "Round 2". */
  roundLabel?: string;
  /** The format shows distances, so the units setting applies. */
  hasDistances?: boolean;
}

export function HeaderCard({
  league,
  event,
  isAdmin,
  isLive,
  stats,
  chips,
  activeLabel,
  roundLabel,
  hasDistances = false,
}: HeaderCardProps) {
  const [settings] = useViewSettings();
  const meta = [
    event.date ? formatEventDate(event.date) : undefined,
    event.location,
  ]
    .filter(Boolean)
    .join(" · ");
  const chip = "rounded-full px-2.75 py-1.25";

  return (
    <div className="grid gap-8 rounded-3xl bg-[#F7F3E1] px-6 py-6 sm:px-8 sm:py-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
      <div className="flex min-w-0 flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          {isLive ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(0,158,115,.14)] px-3 py-1.25 text-xs font-bold tracking-[.08em] text-[#00704F]">
              <LiveDot className="size-2 bg-[#009E73]" />
              LIVE
            </span>
          ) : event.finished ? (
            <Badge className="border-green-500/30 bg-green-500/20 text-green-700">
              Finished
            </Badge>
          ) : (
            <Badge variant="outline">Not Started</Badge>
          )}
        </div>
        <h1 className="m-0 font-display text-3xl leading-[1.05] font-bold text-[#212121] sm:text-[44px]">
          {event.title || "Untitled Event"}
        </h1>
        {meta && <div className="text-[15px] text-[#5A5A5A]">{meta}</div>}
        {event.description && (
          <p className="text-sm text-[#5A5A5A]">{event.description}</p>
        )}
        <div className="mt-0.5 flex flex-wrap gap-1.5 text-xs font-semibold">
          {chips.map((label, i) => (
            <span
              key={label}
              className={`${chip} ${i === 0 ? "bg-[#FDD700]" : "bg-white"}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isLive && (
          <>
            <div className="flex flex-wrap items-center gap-x-4.5 gap-y-1 text-sm font-semibold">
              {roundLabel && (
                <span className="mr-auto font-display text-lg font-bold">
                  {roundLabel}
                </span>
              )}
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-[3px] bg-[#009E73]" />
                {stats.playing} {activeLabel}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2.5 rounded-[3px] bg-[#212121]" />
                {stats.finished} of {stats.total} finished
              </span>
            </div>
            <RoundProgressBar
              stats={stats}
              tone="light"
              className="h-2.5 rounded-[5px]"
            />
          </>
        )}
        <div className="mt-1 flex gap-2.5">
          {isAdmin && isLive && (
            <Link
              href={`/leagues/${league.id}/events/${event.id}/live${tvSettingsQuery(settings)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <HugeiconsIcon icon={Tv01Icon} data-icon="inline-start" />
              Open TV view
            </Link>
          )}
          <ShareButton title={event.title} />
          <SettingsMenu showUnits={hasDistances} showTvTheme={isAdmin} />
        </div>
      </div>
    </div>
  );
}

/** Viewer settings: distance units, and the TV board's theme for admins. */
function SettingsMenu({
  showUnits,
  showTvTheme,
}: {
  showUnits: boolean;
  showTvTheme: boolean;
}) {
  const [settings, update] = useViewSettings();
  if (!showUnits && !showTvTheme) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" aria-label="Settings">
            <HugeiconsIcon icon={Settings02Icon} data-icon="inline-start" />
            Settings
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        {showUnits && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Distances</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={settings.units}
              onValueChange={(v) => update({ units: v as DistanceUnit })}
            >
              <DropdownMenuRadioItem value="m">Meters</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ft">Feet</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        )}
        {showUnits && showTvTheme && <DropdownMenuSeparator />}
        {showTvTheme && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>TV view</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={settings.tvTheme}
              onValueChange={(v) => update({ tvTheme: v as TvTheme })}
            >
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShareButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: title || "dgputt event", url });
      } catch {
        // Dismissing the share sheet rejects; nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; leave the button as is.
    }
  }

  return (
    <Button variant="ghost" onClick={share}>
      <HugeiconsIcon icon={Share08Icon} data-icon="inline-start" />
      {copied ? "Link copied" : "Share"}
    </Button>
  );
}

/** Round switcher (R1, R2, ...) with a green dot on the live round. */
export function RoundSwitcher({
  count,
  selected,
  liveIndex,
  onSelect,
  labels,
}: {
  count: number;
  selected: number;
  /** Index of the round being played now, or -1. */
  liveIndex: number;
  onSelect: (index: number) => void;
  /** Button text per round; defaults to R1, R2, ... */
  labels?: string[];
}) {
  if (count <= 1) return null;
  return (
    <div
      className={`ml-auto flex gap-0.5 overflow-x-auto rounded-xl bg-white p-0.75 text-[13px] font-semibold ${CARD_SHADOW}`}
    >
      {Array.from({ length: count }, (_, i) => {
        const active = i === selected;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex shrink-0 items-center gap-1.5 rounded-[9px] px-2.25 py-1.5 ${
              active
                ? "bg-[#212121] text-white"
                : "text-[#8B8B8B] hover:text-[#212121]"
            }`}
            aria-pressed={active}
          >
            {active && i === liveIndex && (
              <span className="size-1.5 rounded-full bg-[#38C757]" />
            )}
            {labels?.[i] ?? `R${i + 1}`}
          </button>
        );
      })}
    </div>
  );
}
