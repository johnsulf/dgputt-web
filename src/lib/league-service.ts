import { ref, get } from "firebase/database";
import { getFirebaseDb } from "@/lib/firebase";
import type { LeagueInstance } from "@/app/interfaces/league";

/**
 * Fetches the lightweight league index from _leaguesData.
 */
export async function fetchLeagues(): Promise<LeagueInstance[]> {
  const db = getFirebaseDb();
  const snapshot = await get(ref(db, "_leaguesData"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, Record<string, unknown>>;
  const leagues: LeagueInstance[] = [];

  for (const [key, value] of Object.entries(data)) {
    try {
      leagues.push({
        id: key,
        title: (value.title as string) ?? "",
        location: (value.location as string) ?? "",
        contactEmail: (value.contactEmail as string) ?? "",
        archived: (value.archived as boolean) ?? false,
        isFeatured: (value.isFeatured as boolean) ?? false,
        seasonsEnabled: (value.seasonsEnabled as boolean) ?? false,
        activeSeasonId: (value.activeSeasonId as string) ?? undefined,
        divisions: Array.isArray(value.divisions)
          ? (value.divisions as string[])
          : undefined,
      });
    } catch {
      console.error(`Error parsing league ${key}`);
    }
  }

  return leagues;
}

/**
 * Fetches the current user's favourite league IDs from _users/{uid}/favouriteLeagues.
 */
export async function fetchFavouriteLeagueIds(
  uid: string,
): Promise<string[]> {
  const db = getFirebaseDb();
  const snapshot = await get(ref(db, `_users/${uid}/favouriteLeagues`));

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, string>;
  return Object.keys(data);
}
