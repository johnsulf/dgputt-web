"use client";

import { useMemo } from "react";
import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";

export function FavouriteLeagues() {
  const { leagues, archivedLeagues, favouriteLeagueIds } = useLeagues();

  const favourites = useMemo(() => {
    const all = [...leagues, ...archivedLeagues];
    return all
      .filter((l) => favouriteLeagueIds.includes(l.id))
      .sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
  }, [leagues, archivedLeagues, favouriteLeagueIds]);

  return (
    <section className="rounded-2xl bg-primary/20 p-4">
      <h2>Your Starred Leagues ({favourites.length})</h2>

      {favourites.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Star a league to quickly access it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {favourites.map((league) => (
            <LeagueTile key={league.id} league={league} />
          ))}
        </div>
      )}
    </section>
  );
}
