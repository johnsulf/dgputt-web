"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchLeagueDetails } from "@/lib/league-service";
import { getCountryFlag } from "@/lib/country-flags";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LeagueInstance } from "@/app/interfaces/league";
import { EventsTab } from "@/app/components/league/events-tab";
import { LeaderboardTab } from "@/app/components/league/leaderboard-tab";
import { SeasonSelector } from "@/app/components/league/season-selector";

export default function LeagueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [league, setLeague] = useState<LeagueInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);
  const [seasonInitialized, setSeasonInitialized] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadLeague() {
      try {
        const data = await fetchLeagueDetails(id);
        setLeague(data);

        // Default season filter to active season
        if (data && !seasonInitialized) {
          setSeasonFilter(data.activeSeasonId ?? null);
          setSeasonInitialized(true);
        }
      } catch (error) {
        console.error("Failed to load league:", error);
      }
      setLoading(false);
    }

    loadLeague();
  }, [id, user, authLoading, seasonInitialized]);

  if (authLoading || loading) {
    return <LeagueDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Log in to view this league.</p>
        <Link href="/auth">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">League not found.</p>
        <Link href="/leagues">
          <Button variant="outline">Back to Leagues</Button>
        </Link>
      </div>
    );
  }

  const flag = league.location ? getCountryFlag(league.location) : null;
  const eventCount = league.events?.length ?? 0;
  const seasons = league.seasons ?? [];
  const showSeasons = (league.seasonsEnabled ?? false) && seasons.length > 0;

  const activeSeason = seasons.find((s) => s.id === league.activeSeasonId);

  return (
    <div className="p-4">
      <Link href="/leagues">
        <Button variant="outline">Back to Leagues</Button>
      </Link>

      {/* Hero */}
      <div className="mt-4 rounded-3xl bg-secondary/10 p-6 sm:p-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-4xl sm:size-24 sm:text-5xl">
            {flag || league.title.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <h1>{league.title}</h1>

            {activeSeason && (
              <p className="text-sm text-muted-foreground">
                {activeSeason.title}
              </p>
            )}

            <div className="flex items-center gap-2 text-muted-foreground">
              {league.location && (
                <span>
                  {flag ? `${flag} ` : ""}
                  {league.location}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {league.isFeatured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              {league.seasonsEnabled && (
                <Badge variant="outline">Seasons</Badge>
              )}
              {league.archived && <Badge variant="destructive">Archived</Badge>}
              {eventCount > 0 && (
                <Badge variant="outline">
                  {eventCount} event{eventCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {league.contactEmail && (
          <p className="mt-4 text-sm text-muted-foreground sm:ml-30">
            Contact:{" "}
            <a
              href={`mailto:${league.contactEmail}`}
              className="text-primary underline-offset-2 hover:underline"
            >
              {league.contactEmail}
            </a>
          </p>
        )}
      </div>

      {/* Season filter */}
      {showSeasons && (
        <div className="mt-4">
          <SeasonSelector
            seasons={seasons}
            activeSeasonId={league.activeSeasonId}
            selectedSeasonId={seasonFilter}
            onSeasonChange={setSeasonFilter}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6">
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-4">
            <EventsTab league={league} seasonFilter={seasonFilter} />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <LeaderboardTab league={league} seasonFilter={seasonFilter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function LeagueDetailSkeleton() {
  return (
    <div className="p-4">
      {/* Back button */}
      <Skeleton className="h-9 w-32" />

      {/* Hero */}
      <div className="mt-4 rounded-3xl border bg-card p-6 sm:p-10">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Skeleton className="size-20 shrink-0 rounded-full sm:size-24" />
          <div className="flex w-full flex-col items-center gap-3 sm:items-start">
            <Skeleton className="h-8 w-48 sm:w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <Skeleton className="h-9 w-52 rounded-full" />
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
