"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import type { LeagueEvent } from "@/app/interfaces/league";
import { useTvSettings, type TvTheme } from "@/lib/view-settings";
import { LiveDot } from "../live-parts";

// Frame shared by the TV boards. The board is laid out on a fixed 1280x720
// canvas and scaled to fit the screen, so it looks the same on any TV or
// projector.
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// Board colours per theme. The boards use these as var(--tv-*) classes, so
// the theme is switched in one place.
const TV_THEMES: Record<TvTheme, Record<string, string>> = {
  dark: {
    "--tv-page": "#121212",
    "--tv-panel": "#1E1E1E",
    "--tv-tile": "#1A1A1A",
    "--tv-tile-active": "#262626",
    "--tv-ink": "#F5F5F5",
    "--tv-muted": "#B0B0B0",
    "--tv-accent": "#FDD700",
    "--tv-line": "rgba(255,255,255,.05)",
    "--tv-tile-line": "rgba(255,255,255,.06)",
    "--tv-active-line": "rgba(253,215,0,.35)",
    "--tv-active-row": "rgba(253,215,0,.07)",
    "--tv-track": "rgba(255,255,255,.06)",
    "--tv-track-strong": "rgba(255,255,255,.12)",
    "--tv-chip": "rgba(255,255,255,.08)",
    "--tv-round-bg": "rgba(253,215,0,.18)",
    "--tv-round-ink": "#FDD700",
    "--tv-live-bg": "rgba(0,158,115,.2)",
    "--tv-live-ink": "#7DDA91",
  },
  light: {
    "--tv-page": "#F2F0EA",
    "--tv-panel": "#FFFFFF",
    "--tv-tile": "#FFFFFF",
    "--tv-tile-active": "#FFFBE0",
    "--tv-ink": "#212121",
    "--tv-muted": "#5A5A5A",
    "--tv-accent": "#8A6D00",
    "--tv-line": "rgba(0,0,0,.06)",
    "--tv-tile-line": "rgba(0,0,0,.06)",
    "--tv-active-line": "rgba(214,170,0,.65)",
    "--tv-active-row": "rgba(253,215,0,.2)",
    "--tv-track": "rgba(0,0,0,.06)",
    "--tv-track-strong": "rgba(0,0,0,.1)",
    "--tv-chip": "rgba(0,0,0,.06)",
    "--tv-round-bg": "#FDD700",
    "--tv-round-ink": "#212121",
    "--tv-live-bg": "rgba(0,158,115,.14)",
    "--tv-live-ink": "#00704F",
  },
};

/** The TV board's theme, used as the `tone` of the shared live parts. */
export function useTvTone(): TvTheme {
  return useTvSettings().tvTheme;
}

function useFitScale(): number {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () =>
      setScale(
        Math.min(
          window.innerWidth / CANVAS_WIDTH,
          window.innerHeight / CANVAS_HEIGHT,
        ),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return scale;
}

/** Pages through `total` items, `pageSize` at a time, every `intervalMs`. */
export function usePaging(
  total: number,
  pageSize: number,
  intervalMs = 10_000,
): { page: number; pages: number } {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (pages <= 1) return;
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [pages, intervalMs]);
  return { page: tick % pages, pages };
}

/** Footer: legend on the left, page marker and site on the right. */
export function TvFooter({
  legend,
  page,
  pages,
}: {
  legend: string;
  page: number;
  pages: number;
}) {
  return (
    <div className="flex justify-between gap-4 text-xs text-[#8B8B8B]">
      <span>{legend}</span>
      <span className="shrink-0">
        {pages > 1 && (
          <span className="mr-3 font-semibold text-(--tv-muted)">
            Page {page + 1}/{pages}
          </span>
        )}
        dgputt.app
      </span>
    </div>
  );
}

export function TvCanvas({ children }: { children: ReactNode }) {
  const scale = useFitScale();
  const tone = useTvTone();
  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-(--tv-page)"
      style={TV_THEMES[tone] as CSSProperties}
    >
      <div
        className="flex shrink-0 flex-col gap-3.5 px-7 pt-5 pb-4 text-(--tv-ink)"
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Logo, title, LIVE / FINISHED pill and round pill; `right` fills the rest. */
export function TvTopBar({
  event,
  subtitle,
  isLive,
  roundIndex,
  roundName,
  right,
}: {
  event: LeagueEvent;
  subtitle: string;
  isLive: boolean;
  roundIndex: number;
  /** Round pill text, e.g. a bracket stage; defaults to "Round N". */
  roundName?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src="/images/logo-mark.svg"
        alt="dgputt"
        width={40}
        height={40}
        unoptimized
      />
      <div className="min-w-0">
        <div className="truncate font-display text-[26px] leading-[1.1] font-bold">
          {event.title || "Event"}
        </div>
        <div className="mt-0.5 text-sm text-(--tv-muted)">{subtitle}</div>
      </div>
      {isLive ? (
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-(--tv-live-bg) px-3 py-1.5 text-xs font-bold tracking-[.08em] text-(--tv-live-ink)">
          <LiveDot className="size-2 bg-[#38C757]" />
          LIVE
        </span>
      ) : event.finished ? (
        <span className="shrink-0 rounded-full bg-(--tv-chip) px-3 py-1.5 text-xs font-bold tracking-[.08em] text-(--tv-muted)">
          FINISHED
        </span>
      ) : null}
      {roundIndex >= 0 && (
        <span className="shrink-0 rounded-full bg-(--tv-round-bg) px-3 py-1.5 text-[13px] font-bold text-(--tv-round-ink)">
          {roundName ?? `Round ${roundIndex + 1}`}
        </span>
      )}
      {right}
    </div>
  );
}
