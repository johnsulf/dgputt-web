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
  const avatar = flag || league.title.charAt(0).toUpperCase();

  return (
    <Link
      href={`/leagues/${league.id}`}
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5
                 sm:flex-col
                 max-sm:flex-row max-sm:items-center max-sm:rounded-xl max-sm:px-3 max-sm:py-2 max-sm:shadow-none max-sm:border-transparent max-sm:hover:bg-muted/50 max-sm:hover:shadow-none max-sm:hover:translate-y-0 max-sm:hover:border-transparent"
    >
      {/* Avatar */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-xl
                      max-sm:size-9 max-sm:text-base">
        {avatar}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold leading-tight
                      max-sm:text-sm">
          {league.title}
        </p>

        {league.location && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground max-sm:hidden">
            {league.location}
          </p>
        )}
      </div>

      {/* Tags + star row — visible on cards */}
      <div className="flex items-center gap-1.5 max-sm:hidden">
        {league.isFeatured && (
          <span className="rounded-full bg-secondary/40 px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            Featured
          </span>
        )}
        {league.seasonsEnabled && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
            Seasons
          </span>
        )}
        {league.archived && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Archived
          </span>
        )}
        <span className="ml-auto text-base text-primary opacity-0 transition-opacity group-hover:opacity-100">
          →
        </span>
      </div>

      {/* Mobile-only right side */}
      <div className="flex shrink-0 items-center gap-2 sm:hidden">
        {league.archived && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            Archived
          </span>
        )}
        {isStarred && (
          <span className="text-primary text-sm">★</span>
        )}
      </div>

      {/* Star — card view, top-right corner */}
      {isStarred && (
        <span className="absolute right-3 top-3 text-primary text-sm max-sm:hidden">
          ★
        </span>
      )}
    </Link>
  );
}
