"use client";

import { use, useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { getCountryFlag } from "@/lib/country-flags";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    if (authLoading || !user) return;

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
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading...</p>
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
    <div className="mx-auto max-w-2xl py-4">
      <div className="px-4">
        <Link
          href="/leagues"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Leagues
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary/30 text-2xl">
            {flag || league.title.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{league.title}</h2>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {league.location && <span>{league.location}</span>}
              {league.archived && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">
                  Archived
                </span>
              )}
              {league.seasonsEnabled && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  Seasons
                </span>
              )}
            </div>
          </div>
        </div>

        {league.contactEmail && (
          <p className="mt-4 text-sm text-muted-foreground">
            Contact: {league.contactEmail}
          </p>
        )}

        <div className="mt-8 rounded-2xl bg-muted/50 p-8 text-center">
          <p className="text-muted-foreground">
            League details and events coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
