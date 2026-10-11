import type {
  BarState,
  LiveScore,
  MatchStatus,
  MatchView,
  RoundStats,
} from "@/lib/cornhole-live";

// Pieces shared by the live event pages (light) and TV boards (dark).

type Tone = "light" | "dark";

export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full animate-dgpulse ${className}`}
    />
  );
}

const MOVEMENT_COLOURS: Record<
  Tone,
  { up: string; down: string; same: string }
> = {
  light: {
    up: "text-[#009E73]",
    down: "text-[#CC3311]",
    same: "text-[#C9C9C9]",
  },
  dark: {
    up: "text-[#7DDA91]",
    down: "text-[#E87B86]",
    same: "text-[#5A5A5A]",
  },
};

/** The player's group this round, on their playing card. Not on standings. */
export function GroupTag({ group, tone }: { group?: number; tone: Tone }) {
  if (group == null) return null;
  return (
    <span
      className={`text-xs font-semibold ${
        tone === "light" ? "text-[#8B8B8B]" : "text-[#B0B0B0]"
      }`}
    >
      Group {group}
    </span>
  );
}

/**
 * Bracket standings, last column: the stage a participant went out in
 * ("QF", "SF", "F"), or a yellow "W" for the champion. Empty while still in.
 */
export function StageCell({ out, tone }: { out?: string; tone: Tone }) {
  if (out === "W") {
    return (
      <span className="justify-self-end rounded-full bg-[#FDD700] px-1.5 text-[11px] font-bold text-[#212121]">
        W
      </span>
    );
  }
  return (
    <span
      className={`text-right text-xs font-semibold ${
        tone === "light" ? "text-[#8B8B8B]" : "text-(--tv-muted)"
      }`}
    >
      {out ?? ""}
    </span>
  );
}

/** Places moved since the previous round: arrow plus count, dash if none. */
export function Movement({ value, tone }: { value: number; tone: Tone }) {
  const colours = MOVEMENT_COLOURS[tone];
  const colour =
    value > 0 ? colours.up : value < 0 ? colours.down : colours.same;
  const path =
    value > 0
      ? "M7 14l5-5 5 5z"
      : value < 0
        ? "M7 10l5 5 5-5z"
        : "M19 13H5v-2h14z";

  return (
    <span
      className={`flex items-center overflow-hidden text-[11px] font-bold ${colour}`}
      aria-label={
        value > 0 ? `Up ${value}` : value < 0 ? `Down ${-value}` : "No change"
      }
    >
      <svg
        viewBox="0 0 24 24"
        className="-mx-1 size-5 shrink-0"
        fill="currentColor"
      >
        <path d={path} />
      </svg>
      {value !== 0 && Math.abs(value)}
    </span>
  );
}

const NOW_COLOURS: Record<
  Tone,
  { ahead: string; behind: string; tied: string }
> = {
  light: {
    ahead: "text-[#00704F]",
    behind: "text-[#CC3311]",
    tied: "text-[#5A5A5A]",
  },
  dark: {
    ahead: "text-[#7DDA91]",
    behind: "text-[#E87B86]",
    tied: "text-[#B0B0B0]",
  },
};

/**
 * A participant's match this round: the live score (coloured by who leads)
 * while it plays, else "Waiting" or "Done".
 */
export function NowScore({
  now,
  state,
  tone,
  className = "",
}: {
  now?: LiveScore;
  state?: MatchStatus;
  tone: Tone;
  className?: string;
}) {
  if (!now) {
    if (state !== "upcoming" && state !== "final") return <span />;
    return (
      <span className="text-center text-[11px] font-semibold text-[#8B8B8B]">
        {state === "final" ? "Done" : "Waiting"}
      </span>
    );
  }
  const colours = NOW_COLOURS[tone];
  const colour =
    now.me > now.opp
      ? colours.ahead
      : now.me < now.opp
        ? colours.behind
        : colours.tied;
  return (
    <span
      className={`text-center font-bold tabular-nums ${colour} ${className}`}
    >
      {now.me}–{now.opp}
    </span>
  );
}

const BAR_COLOURS: Record<Tone, Record<BarState, string>> = {
  light: {
    winner: "bg-[#212121]",
    loser: "bg-[#D6D6D6]",
    leading: "bg-[#4280AD]",
    trailing: "bg-[#9EBBD1]",
  },
  dark: {
    winner: "bg-[#FDD700]",
    loser: "bg-[#3A3A3A]",
    leading: "bg-[#2DA4FA]",
    trailing: "bg-[#5A7690]",
  },
};

const SCORE_GRID: Record<
  Tone,
  { grid: string; name: string; track: string; score: string; ink: string }
> = {
  light: {
    grid: "grid-cols-[minmax(0,1fr)_minmax(80px,150px)_40px] gap-x-3.5 gap-y-2.5",
    name: "text-base",
    track: "bg-[#F1F1F1]",
    score: "text-2xl",
    ink: "text-[#212121]",
  },
  dark: {
    grid: "grid-cols-[minmax(0,1fr)_110px_40px] gap-x-3 gap-y-1.5",
    name: "text-[17px]",
    track: "bg-white/8",
    score: "text-[28px]",
    ink: "text-[#F5F5F5]",
  },
};

/**
 * Two rows (player1 then player2): name, score bar, score. A walkover shows
 * only the player who has it; there is no opponent or score to show.
 * `compact` narrows the bar and score for three tiles across.
 */
export function MatchScoreGrid({
  match,
  tone,
  compact = false,
}: {
  match: MatchView;
  tone: Tone;
  compact?: boolean;
}) {
  const s = compact
    ? {
        ...SCORE_GRID[tone],
        grid: "grid-cols-[minmax(0,1fr)_56px_32px] gap-x-2.5 gap-y-1.5",
        name: "text-[15px]",
        score: "text-2xl",
      }
    : SCORE_GRID[tone];
  if (match.walkoverPlayer) {
    return (
      <span
        className={`leading-[1.2] font-bold break-words ${s.name} ${s.ink}`}
      >
        {match.walkoverPlayer}
      </span>
    );
  }
  return (
    <div className={`grid items-center ${s.grid}`}>
      {match.sides.map((side, i) => {
        const ink = side.lost ? "text-[#8B8B8B]" : s.ink;
        return (
          <div key={i} className="contents">
            <span
              className={`min-w-0 leading-[1.2] break-words ${s.name} ${ink} ${
                side.lost ? "font-medium" : "font-bold"
              }`}
            >
              {side.name}
              {side.players && (
                <span className="block text-[0.8em] font-medium text-[#8B8B8B]">
                  {side.players}
                </span>
              )}
            </span>
            <span className={`h-2 overflow-hidden rounded ${s.track}`}>
              <span
                className={`block h-full rounded transition-[width] duration-800 ease-in-out ${
                  BAR_COLOURS[tone][side.bar]
                }`}
                style={{ width: `${side.barPct}%` }}
              />
            </span>
            <span
              className={`text-right font-display leading-none font-bold tabular-nums ${s.score} ${ink}`}
            >
              {side.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const STATUS_PILL: Record<Tone, Record<MatchView["status"], string>> = {
  light: {
    live: "bg-[rgba(0,158,115,.12)] text-[#00704F] px-2.5 py-0.75",
    final: "bg-[#F1F1F1] text-[#5A5A5A] px-2.5 py-0.75",
    upcoming: "border border-[#D6D6D6] text-[#8B8B8B] px-2.5 py-0.5",
  },
  dark: {
    live: "bg-[rgba(0,158,115,.22)] text-[#7DDA91] px-2.25 py-0.5",
    final: "bg-white/8 text-[#B0B0B0] px-2.25 py-0.5",
    upcoming: "text-[#8B8B8B] px-2.25 py-0.5",
  },
};

const STATUS_LABEL: Record<MatchView["status"], string> = {
  live: "Live",
  final: "Final",
  upcoming: "Not started",
};

export function MatchStatusPill({
  match,
  tone,
}: {
  match: MatchView;
  tone: Tone;
}) {
  const { status } = match;
  return (
    <span
      className={`ml-auto inline-flex items-center gap-1.5 rounded-full font-bold ${STATUS_PILL[tone][status]}`}
    >
      {status === "live" &&
        (tone === "light" ? (
          <LiveDot className="size-1.75 bg-[#009E73]" />
        ) : (
          <span className="size-1.5 rounded-full bg-[#38C757]" />
        ))}
      {match.walkoverPlayer ? "Walkover" : STATUS_LABEL[status]}
    </span>
  );
}

/** Round progress: finished segment, then playing segment, rest empty. */
export function RoundProgressBar({
  stats,
  tone,
  className = "",
  finishedClassName,
}: {
  stats: RoundStats;
  tone: Tone;
  className?: string;
  /** Overrides the finished segment colour. */
  finishedClassName?: string;
}) {
  const pct = (n: number) => (stats.total > 0 ? (n / stats.total) * 100 : 0);
  return (
    <div
      className={`flex gap-0.5 overflow-hidden ${
        tone === "light" ? "bg-[rgba(33,33,33,.1)]" : "bg-white/12"
      } ${className}`}
    >
      <div
        className={`h-full transition-[width] duration-800 ease-in-out ${
          finishedClassName ??
          (tone === "light" ? "bg-[#212121]" : "bg-[#FDD700]")
        }`}
        style={{ width: `${pct(stats.finished)}%` }}
      />
      <div
        className={`h-full transition-[width] duration-800 ease-in-out ${
          tone === "light" ? "bg-[#009E73]" : "bg-[#38C757]"
        }`}
        style={{ width: `${pct(stats.playing)}%` }}
      />
    </div>
  );
}

/**
 * Background for a hit rate p (0-1): deeper blue for better putting.
 * Returns a CSS colour for an inline style.
 */
export function heatColour(p: number, tone: Tone): string {
  const level = Math.min(1, Math.max(0, (p - 0.3) / 0.65));
  return tone === "light"
    ? `rgba(47,100,136,${(0.05 + level * 0.5).toFixed(3)})`
    : `rgba(45,164,250,${(0.08 + level * 0.47).toFixed(3)})`;
}

const POINTS_PILL: Record<Tone, [string, string, string]> = {
  light: [
    "bg-[#F1F1F1] text-[#212121]",
    "bg-[rgba(253,215,0,.35)] text-[#212121]",
    "bg-[#FDD700] text-[#212121]",
  ],
  dark: [
    "bg-white/8 text-[#B0B0B0]",
    "bg-[rgba(253,215,0,.22)] text-[#FDD700]",
    "bg-[#FDD700] text-[#212121]",
  ],
};

/** Points-per-hit pill for a station: x1, x2, x3 (3 and up share a style). */
export function PointsPill({
  points,
  tone,
  className = "",
}: {
  points: number;
  tone: Tone;
  className?: string;
}) {
  const style = POINTS_PILL[tone][Math.min(Math.max(points, 1), 3) - 1];
  return (
    <span className={`shrink-0 rounded-full font-bold ${style} ${className}`}>
      ×{points}
    </span>
  );
}
