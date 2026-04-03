"use client";

import Link from "next/link";
import type { LeagueInstance } from "@/app/interfaces/league";
import { useLeagues } from "@/lib/leagues-context";
import { getCountryFlag } from "@/lib/country-flags";

interface LeagueTileProps {
  league: LeagueInstance;
}

export function LeagueTile({ league }: LeagueTileProps) {
  const { favouriteLeagueIds } = useLeagues();
  const isStarred = favouriteLeagueIds.includes(league.id);

  const flag = league.location ? getCountryFlag(league.location) : null;

  return (
    <Link
      href={`/leagues/${league.id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
        {flag || league.title.charAt(0).toUpperCase()}
      </div>

      <span className="min-w-0 flex-1 truncate text-sm font-medium">
        {league.title}
      </span>

      {league.archived && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          Archived
        </span>
      )}

      {isStarred && (
        <span className="text-primary" title="Starred">
          ★
        </span>
      )}
    </Link>
  );
}
