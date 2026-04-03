"use client";

import { useLeagues } from "@/lib/leagues-context";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function LeagueSearch() {
  const { searchTerm, setSearchTerm } = useLeagues();

  return (
    <InputGroup>
      <InputGroupInput
        placeholder="Find leagues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <InputGroupAddon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </InputGroupAddon>
      {searchTerm && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            ✕
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
