"use client";

import type { LeagueInstance } from "@/app/interfaces/league";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LeaderboardTabProps {
  league: LeagueInstance;
  seasonFilter: string | null;
}

export function LeaderboardTab({
  league: _league,
  seasonFilter: _seasonFilter,
}: LeaderboardTabProps) {
  return (
    <Alert>
      <AlertTitle>Leaderboard under construction</AlertTitle>
      <AlertDescription>
        Leaderboard is currently being implemented. We appreciate your patience
        and look forward to sharing it with you soon!
      </AlertDescription>
    </Alert>
  );
}
