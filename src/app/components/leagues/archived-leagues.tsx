"use client";

import { useMemo, useState } from "react";
import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";

export function ArchivedLeagues() {
  const { archivedLeagues, searchTerm } = useLeagues();
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return archivedLeagues
      .filter((l) => l.title.toLowerCase().includes(term))
      .sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
  }, [archivedLeagues, searchTerm]);

  if (filtered.length === 0) return null;

  return (
    <section className="rounded-2xl bg-muted p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <h2>Archived Leagues ({filtered.length})</h2>
        <span
          className="text-muted-foreground transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((league) => (
            <LeagueTile key={league.id} league={league} />
          ))}
        </div>
      )}
    </section>
  );
}
