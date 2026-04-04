"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchLeagueDetails } from "@/lib/league-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import { EventView } from "@/app/components/event/event-view";

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id, eventId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [league, setLeague] = useState<LeagueInstance | null>(null);
  const [event, setEvent] = useState<LeagueEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadEvent() {
      try {
        const data = await fetchLeagueDetails(id);
        setLeague(data);
        if (data?.events) {
          const found = data.events.find((e) => e.id === eventId);
          setEvent(found ?? null);
        }
      } catch (error) {
        console.error("Failed to load event:", error);
      }
      setLoading(false);
    }

    loadEvent();
  }, [id, eventId, user, authLoading]);

  if (authLoading || loading) {
    return <EventDetailSkeleton leagueId={id} />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Log in to view this event.</p>
        <Link href="/auth">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  if (!league || !event) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-muted-foreground">Event not found.</p>
        <Link href={`/leagues/${id}`}>
          <Button variant="outline">Back to League</Button>
        </Link>
      </div>
    );
  }

  return <EventView league={league} event={event} />;
}

function EventDetailSkeleton({ leagueId }: { leagueId: string }) {
  return (
    <div className="p-4">
      <Link href={`/leagues/${leagueId}`}>
        <Button variant="outline">Back to League</Button>
      </Link>
      <div className="mt-4 rounded-3xl border bg-card p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-32" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    </div>
  );
}
