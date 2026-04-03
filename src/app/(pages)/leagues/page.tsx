"use client";

import { useAuth } from "@/lib/auth-context";
import { LeaguesProvider } from "@/lib/leagues-context";
import { LeagueSearch } from "@/app/components/leagues/league-search";
import { FeaturedLeagues } from "@/app/components/leagues/featured-leagues";
import { FavouriteLeagues } from "@/app/components/leagues/favourite-leagues";
import { AllLeagues } from "@/app/components/leagues/all-leagues";
import { ArchivedLeagues } from "@/app/components/leagues/archived-leagues";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LeaguesContent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <LeagueSearch />
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
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <h2>Leagues</h2>
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
      <div className="mx-auto max-w-2xl py-4">
        <h2 className="px-4">Leagues</h2>
        <LeaguesContent />
      </div>
    </LeaguesProvider>
  );
}
