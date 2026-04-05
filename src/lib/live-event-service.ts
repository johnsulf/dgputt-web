import { ref, onValue, type Unsubscribe } from "firebase/database";
import { getFirebaseDb } from "@/lib/firebase";
import { parseSingleEvent } from "@/lib/league-service";
import type { LeagueEvent } from "@/app/interfaces/league";

export function subscribeToEvent(
  leagueId: string,
  eventId: string,
  callback: (event: LeagueEvent | null) => void,
): Unsubscribe {
  const db = getFirebaseDb();
  const eventRef = ref(db, `_leagues/${leagueId}/events/${eventId}`);
  return onValue(eventRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    const parsed = parseSingleEvent(eventId, snapshot.val());
    callback(parsed);
  });
}
