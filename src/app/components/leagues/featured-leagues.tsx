"use client";

import { useMemo } from "react";
import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";

export function FeaturedLeagues() {
  const { leagues, searchTerm } = useLeagues();

  const featured = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return leagues
      .filter((l) => l.isFeatured && l.title.toLowerCase().includes(term))
      .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
  }, [leagues, searchTerm]);

  if (featured.length === 0) return null;

  return (
    <section className="rounded-2xl bg-secondary/20 p-4">
      <h3 className="mb-2 text-sm font-bold">Featured</h3>
      <div className="flex flex-col">
        {featured.map((league) => (
          <LeagueTile key={league.id} league={league} />
        ))}
      </div>
    </section>
  );
}
