"use client";

import { useMemo } from "react";
import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";

export function FeaturedLeagues() {
  const { leagues } = useLeagues();

  const featured = useMemo(() => {
    return leagues
      .filter((l) => l.isFeatured)
      .sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
  }, [leagues]);

  if (featured.length === 0) return null;

  return (
    <section className="rounded-2xl bg-secondary/20 p-4">
      <h2>Featured</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((league) => (
          <LeagueTile key={league.id} league={league} />
        ))}
      </div>
    </section>
  );
}
