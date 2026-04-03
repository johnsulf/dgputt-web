"use client";

import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";

export function AllLeagues() {
  const { filteredLeagues } = useLeagues();

  if (filteredLeagues.length === 0) {
    return (
      <section>
        <h3 className="mb-2 text-sm font-bold">All Leagues</h3>
        <p className="text-sm text-muted-foreground">No leagues found.</p>
      </section>
    );
  }

  return (
    <section>
      <h3 className="mb-2 text-sm font-bold">
        All Leagues ({filteredLeagues.length})
      </h3>
      <div className="flex flex-col">
        {filteredLeagues.map((league) => (
          <LeagueTile key={league.id} league={league} />
        ))}
      </div>
    </section>
  );
}
