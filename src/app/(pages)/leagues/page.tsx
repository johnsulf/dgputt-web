"use client";

import { useAuth } from "@/lib/auth-context";
import { LeaguesProvider, useLeagues } from "@/lib/leagues-context";
import { LeagueSearch } from "@/app/components/leagues/league-search";
import { LeagueFilters } from "@/app/components/leagues/league-filters";
import { FeaturedLeagues } from "@/app/components/leagues/featured-leagues";
import { FavouriteLeagues } from "@/app/components/leagues/favourite-leagues";
import { AllLeagues } from "@/app/components/leagues/all-leagues";
import { ArchivedLeagues } from "@/app/components/leagues/archived-leagues";
import { LeaguesSkeleton } from "@/app/components/leagues/leagues-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LeaguesContent() {
  const { isLoading } = useLeagues();

  if (isLoading) return <LeaguesSkeleton />;

  return (
    <div className="flex flex-col gap-4 p-4">
      <LeagueSearch />
      <LeagueFilters />
      <FeaturedLeagues />
      <FavouriteLeagues />
      <AllLeagues />
      <ArchivedLeagues />
    </div>
  );
}

export default function LeaguesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="py-4">
        <h1>Leagues</h1>
        <LeaguesSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <h1>Leagues</h1>
        <p className="text-muted-foreground">
          Log in to browse and manage your leagues.
        </p>
        <Link href="/auth">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <LeaguesProvider>
      <div className="py-4">
        <h1>Leagues</h1>
        <LeaguesContent />
      </div>
    </LeaguesProvider>
  );
}
