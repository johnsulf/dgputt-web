"use client";

import { useMemo } from "react";
import { useLeagues } from "@/lib/leagues-context";
import { LeagueTile } from "./league-tile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ArchivedLeagues() {
  const { archivedLeagues, searchTerm } = useLeagues();

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
    <Accordion>
      <AccordionItem value="archived">
        <AccordionTrigger>
          <h2>Archived Leagues ({filtered.length})</h2>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((league) => (
              <LeagueTile key={league.id} league={league} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
