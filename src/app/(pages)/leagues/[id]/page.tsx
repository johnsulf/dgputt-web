"use client";

import { use, useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { getCountryFlag } from "@/lib/country-flags";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeagueInstance } from "@/app/interfaces/league";

export default function LeagueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [league, setLeague] = useState<LeagueInstance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadLeague() {
      try {
        const db = getFirebaseDb();
        const snapshot = await get(ref(db, `_leaguesData/${id}`));

        if (snapshot.exists()) {
          const data = snapshot.val();
          setLeague({
            id,
            title: data.title ?? "",
            location: data.location ?? "",
            contactEmail: data.contactEmail ?? "",
            archived: data.archived ?? false,
            isFeatured: data.isFeatured ?? false,
            seasonsEnabled: data.seasonsEnabled ?? false,
            activeSeasonId: data.activeSeasonId ?? undefined,
          });
        }
      } catch (error) {
        console.error("Failed to load league:", error);
      }
      setLoading(false);
    }

    loadLeague();
  }, [id, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="p-4">
        <Skeleton className="mb-6 h-4 w-32" />
        <div className="rounded-3xl bg-secondary/10 p-8 sm:p-12">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
            <Skeleton className="size-20 rounded-full sm:size-24" />
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="p-4">
      <Link href="/leagues">
        <Button variant="outline">Back to Leagues</Button>
      </Link>

      {/* Hero */}
      <div className="rounded-3xl mt-4 bg-secondary/10 p-8 sm:p-12">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-4xl sm:size-24 sm:text-5xl">
            {flag || league.title.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <h1>{league.title}</h1>

            {league.location && (
              <p className="text-muted-foreground">{league.location}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {league.isFeatured && (
                <span className="rounded-full bg-secondary/40 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  Featured
                </span>
              )}
              {league.seasonsEnabled && (
                <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  Seasons
                </span>
              )}
              {league.archived && (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Archived
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-6 max-w-lg mx-auto">
        <Alert>
          <AlertTitle>League details and events coming soon</AlertTitle>
          <AlertDescription>
            We are working on bringing the full league experience to the web.
            Check back soon for events, standings, and more.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
