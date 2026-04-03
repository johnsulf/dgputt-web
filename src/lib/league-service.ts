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

  const data = snapshot.val() as Record<string, unknown>;
  const leagues: LeagueInstance[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (!value || typeof value !== "object") continue;
    const v = value as Record<string, unknown>;

    const title = typeof v.title === "string" ? v.title : "";
    if (!title) {
      console.warn(`Skipping league ${key}: missing title`);
      continue;
    }

    leagues.push({
      id: key,
      title,
      location: typeof v.location === "string" ? v.location : "",
      contactEmail: typeof v.contactEmail === "string" ? v.contactEmail : "",
      archived: typeof v.archived === "boolean" ? v.archived : false,
      isFeatured: typeof v.isFeatured === "boolean" ? v.isFeatured : false,
      seasonsEnabled: typeof v.seasonsEnabled === "boolean" ? v.seasonsEnabled : false,
      activeSeasonId: typeof v.activeSeasonId === "string" ? v.activeSeasonId : undefined,
      divisions:
        Array.isArray(v.divisions) &&
        v.divisions.every((d) => typeof d === "string")
          ? (v.divisions as string[])
          : undefined,
    });
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
