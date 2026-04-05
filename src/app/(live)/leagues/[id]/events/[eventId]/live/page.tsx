"use client";

import { use, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { fetchLeagueDetails } from "@/lib/league-service";
import { useLiveEvent } from "@/app/components/event/live/use-live-event";
import { LiveEventView } from "@/app/components/event/live/live-event-view";
import type { LeagueInstance } from "@/app/interfaces/league";
import Link from "next/link";

export default function LivePage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>;
}) {
  const { id, eventId } = use(params);
  const { user, loading: authLoading } = useAuth();
  const [league, setLeague] = useState<LeagueInstance | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChecking(false);
      return;
    }

    async function checkAdmin() {
      try {
        const data = await fetchLeagueDetails(id);
        setLeague(data);
        setIsAdmin(data?.admins?.includes(user!.uid) ?? false);
      } catch (error) {
        console.error("Failed to load league:", error);
      }
      setChecking(false);
    }

    checkAdmin();
  }, [id, user, authLoading]);

  const { event, loading: eventLoading } = useLiveEvent(
    isAdmin ? id : "",
    isAdmin ? eventId : "",
  );

  if (authLoading || checking) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Log in to access the live view.</p>
        <Link
          href="/auth"
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">
          You must be a league admin to access the live view.
        </p>
        <Link
          href={`/leagues/${id}`}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600"
        >
          Back to League
        </Link>
      </div>
    );
  }

  if (eventLoading) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="text-zinc-500">Connecting to live data...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4">
        <p className="text-zinc-400">Event not found.</p>
        <Link
          href={`/leagues/${id}`}
          className="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600"
        >
          Back to League
        </Link>
      </div>
    );
  }

  return <LiveEventView event={event} leagueTitle={league?.title} />;
}
