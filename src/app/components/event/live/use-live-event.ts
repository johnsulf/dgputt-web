import { useEffect, useState } from "react";
import { subscribeToEvent } from "@/lib/live-event-service";
import type { LeagueEvent } from "@/app/interfaces/league";

export function useLiveEvent(leagueId: string, eventId: string) {
  const [event, setEvent] = useState<LeagueEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leagueId || !eventId) {
      setEvent(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToEvent(leagueId, eventId, (parsed) => {
      setEvent(parsed);
      setLoading(false);
    });
    return unsubscribe;
  }, [leagueId, eventId]);

  return { event, loading };
}
