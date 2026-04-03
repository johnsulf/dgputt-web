"use client";

import { useLeagues } from "@/lib/leagues-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LeagueSearch() {
  const { searchTerm, setSearchTerm, refresh, isLoading } = useLeagues();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Find leagues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => refresh()}
        disabled={isLoading}
        title="Refresh"
      >
        <span className={isLoading ? "animate-spin" : ""}>↻</span>
      </Button>
    </div>
  );
}
