import { ref, get } from "firebase/database";
import { getFirebaseDb } from "@/lib/firebase";
import type {
  LeagueInstance,
  LeagueEvent,
  LeagueEventMatch,
  LeagueEventPlayer,
  LeagueEventRound,
  LeagueSeason,
} from "@/app/interfaces/league";

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
      seasonsEnabled:
        typeof v.seasonsEnabled === "boolean" ? v.seasonsEnabled : false,
      activeSeasonId:
        typeof v.activeSeasonId === "string" ? v.activeSeasonId : undefined,
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
 * Fetches the full league data from _leagues/{id} (includes events, seasons, etc.)
 */
export async function fetchLeagueDetails(
  leagueId: string,
): Promise<LeagueInstance | null> {
  const db = getFirebaseDb();
  const snapshot = await get(ref(db, `_leagues/${leagueId}`));

  if (!snapshot.exists()) return null;

  const data = snapshot.val() as Record<string, unknown>;

  return {
    id: leagueId,
    title: typeof data.title === "string" ? data.title : "",
    location: typeof data.location === "string" ? data.location : "",
    contactEmail:
      typeof data.contactEmail === "string" ? data.contactEmail : "",
    archived: typeof data.archived === "boolean" ? data.archived : false,
    isFeatured: typeof data.isFeatured === "boolean" ? data.isFeatured : false,
    seasonsEnabled:
      typeof data.seasonsEnabled === "boolean" ? data.seasonsEnabled : false,
    activeSeasonId:
      typeof data.activeSeasonId === "string" ? data.activeSeasonId : undefined,
    competitionType:
      typeof data.competitionType === "string"
        ? data.competitionType
        : undefined,
    format: typeof data.format === "string" ? data.format : undefined,
    validRounds: typeof data.validRounds === "number" ? data.validRounds : 10,
    admins: Array.isArray(data.admins) ? (data.admins as string[]) : undefined,
    divisions:
      Array.isArray(data.divisions) &&
      data.divisions.every((d) => typeof d === "string")
        ? (data.divisions as string[])
        : undefined,
    events: parseEvents(data.events),
    seasons: parseSeasons(data.seasons),
  };
}

export function parseSingleEvent(
  key: string,
  value: unknown,
): LeagueEvent | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const matchesByRound = parseMatchesByRound(v.matches);

  return {
    id: key,
    title: typeof v.title === "string" ? v.title : undefined,
    date: typeof v.date === "string" ? v.date : undefined,
    location: typeof v.location === "string" ? v.location : undefined,
    description: typeof v.description === "string" ? v.description : undefined,
    finished: v.finished === true,
    currentRound:
      typeof v.currentRound === "number" ? v.currentRound : undefined,
    rounds: typeof v.rounds === "number" ? v.rounds : undefined,
    competitionType:
      typeof v.competitionType === "string"
        ? v.competitionType
        : typeof v.type === "string"
          ? v.type
          : undefined,
    format: typeof v.format === "string" ? v.format : undefined,
    playerMode: typeof v.playerMode === "string" ? v.playerMode : undefined,
    limit: typeof v.limit === "number" ? v.limit : undefined,
    seasonId: typeof v.seasonId === "string" ? v.seasonId : undefined,
    divisionsEnabled:
      typeof v.divisionsEnabled === "boolean" ? v.divisionsEnabled : undefined,
    divisions: Array.isArray(v.divisions)
      ? (v.divisions as string[])
      : undefined,
    players: parsePlayers(v._players ?? v.players),
    formatConfig:
      v.formatConfig && typeof v.formatConfig === "object"
        ? (v.formatConfig as Record<string, unknown>)
        : undefined,
    dstIndex: typeof v.dstIndex === "number" ? v.dstIndex : undefined,
    matchesByRound,
    matches: flattenMatches(matchesByRound),
  };
}

function parseEvents(raw: unknown): LeagueEvent[] {
  if (!raw || typeof raw !== "object") return [];

  const eventsMap = raw as Record<string, unknown>;
  const events: LeagueEvent[] = [];

  for (const [key, value] of Object.entries(eventsMap)) {
    const event = parseSingleEvent(key, value);
    if (event) events.push(event);
  }

  return events;
}

function parsePlayers(
  raw: unknown,
): Record<string, LeagueEventPlayer> | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const playersMap = raw as Record<string, unknown>;
  const players: Record<string, LeagueEventPlayer> = {};

  for (const [uid, value] of Object.entries(playersMap)) {
    if (!value || typeof value !== "object") continue;
    const v = value as Record<string, unknown>;

    players[uid] = {
      displayName:
        typeof v.displayName === "string" ? v.displayName : undefined,
      name: typeof v.name === "string" ? v.name : undefined,
      isDummy: v.isDummy === true,
      division: typeof v.division === "string" ? v.division : undefined,
      pairId: typeof v.pairId === "string" ? v.pairId : undefined,
      pdgaNumber:
        typeof v.pdgaNumber === "string"
          ? v.pdgaNumber
          : typeof v.pdgaNumber === "number"
            ? String(v.pdgaNumber)
            : undefined,
      rounds: parseRounds(v.rounds),
    };
  }

  return Object.keys(players).length > 0 ? players : undefined;
}

// Firebase RTDB returns arrays as objects with numeric string keys, not JS arrays.
// toArray handles both real arrays and Firebase's object-of-numeric-keys format.
function toArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object")
    return Object.values(raw as Record<string, unknown>);
  return [];
}

function parseRounds(raw: unknown): LeagueEventRound[] | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  return toArray(raw)
    .filter((r) => r && typeof r === "object")
    .map((r) => {
      const v = r as Record<string, unknown>;
      return {
        hits: typeof v.hits === "number" ? v.hits : undefined,
        putts: typeof v.putts === "number" ? v.putts : undefined,
        dns: typeof v.dns === "boolean" ? v.dns : false,
        dnf: typeof v.dnf === "boolean" ? v.dnf : false,
        finished: v.finished === true,
        hitsPerSequence:
          v.hitsPerSequence && typeof v.hitsPerSequence === "object"
            ? toArray(v.hitsPerSequence).map((n) =>
                typeof n === "number" ? n : 0,
              )
            : undefined,
        puttsPerSequence:
          v.puttsPerSequence && typeof v.puttsPerSequence === "object"
            ? toArray(v.puttsPerSequence).map((n) =>
                typeof n === "number" ? n : 0,
              )
            : undefined,
      };
    });
}

function parseSeasons(raw: unknown): LeagueSeason[] | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  return toArray(raw)
    .filter((s) => s && typeof s === "object")
    .map((s) => {
      const v = s as Record<string, unknown>;
      return {
        id: typeof v.id === "string" ? v.id : "",
        title: typeof v.title === "string" ? v.title : "",
      };
    })
    .filter((s) => s.id);
}

function parseMatchesByRound(raw: unknown): LeagueEventMatch[][] | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const matchesByRound: LeagueEventMatch[][] = [];
  const rounds = toArray(raw);

  for (const [roundIndex, round] of rounds.entries()) {
    if (!round || typeof round !== "object") continue;
    const roundMatches: LeagueEventMatch[] = [];
    for (const matchVal of Object.values(round as Record<string, unknown>)) {
      if (!matchVal || typeof matchVal !== "object") continue;
      const m = matchVal as Record<string, unknown>;
      const p1 = parseMatchSide(m.player1);
      const p2 = parseMatchSide(m.player2);
      if (!p1 || !p2) continue;
      roundMatches.push({
        id: typeof m.id === "string" ? m.id : undefined,
        shortId: typeof m.shortId === "string" ? m.shortId : undefined,
        number: parseNumberish(m.number),
        started: typeof m.started === "boolean" ? m.started : undefined,
        player1: p1,
        player2: p2,
        finished: typeof m.finished === "boolean" ? m.finished : undefined,
        roundIndex,
      });
    }
    matchesByRound[roundIndex] = roundMatches;
  }

  return matchesByRound.some(
    (round) => Array.isArray(round) && round.length > 0,
  )
    ? matchesByRound
    : undefined;
}

function flattenMatches(
  matchesByRound: LeagueEventMatch[][] | undefined,
): LeagueEventMatch[] | undefined {
  if (!matchesByRound) return undefined;
  const flat = matchesByRound.flatMap((round) => round ?? []);
  return flat.length > 0 ? flat : undefined;
}

function parseMatchSide(raw: unknown): LeagueEventMatch["player1"] | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const v = raw as Record<string, unknown>;
  return {
    uid: typeof v.uid === "string" ? v.uid : undefined,
    displayName: typeof v.displayName === "string" ? v.displayName : undefined,
    score: parseNumberish(v.score),
    winner: typeof v.winner === "boolean" ? v.winner : undefined,
    puttsPerSequence:
      v.puttsPerSequence && typeof v.puttsPerSequence === "object"
        ? toArray(v.puttsPerSequence).map((n) => parseNumberish(n) ?? 0)
        : undefined,
    sequences:
      v.sequences && typeof v.sequences === "object"
        ? toArray(v.sequences).map((n) => parseNumberish(n) ?? 0)
        : undefined,
    tieBreakSequences:
      v.tieBreakSequences && typeof v.tieBreakSequences === "object"
        ? toArray(v.tieBreakSequences).map((n) => parseNumberish(n) ?? 0)
        : undefined,
    tieBreakPuttsPerSequence:
      v.tieBreakPuttsPerSequence &&
      typeof v.tieBreakPuttsPerSequence === "object"
        ? toArray(v.tieBreakPuttsPerSequence).map((n) => parseNumberish(n) ?? 0)
        : undefined,
    members: parseMatchMembers(v.members),
  };
}

function parseMatchMembers(
  raw: unknown,
): LeagueEventMatch["player1"]["members"] {
  if (!raw || typeof raw !== "object") return undefined;
  const arr = toArray(raw)
    .filter((m) => m && typeof m === "object")
    .map((m) => {
      const v = m as Record<string, unknown>;
      return {
        uid: typeof v.uid === "string" ? v.uid : undefined,
        displayName:
          typeof v.displayName === "string" ? v.displayName : undefined,
        sequences:
          v.sequences && typeof v.sequences === "object"
            ? toArray(v.sequences).map((n) => parseNumberish(n) ?? 0)
            : undefined,
        puttsPerSequence:
          v.puttsPerSequence && typeof v.puttsPerSequence === "object"
            ? toArray(v.puttsPerSequence).map((n) => parseNumberish(n) ?? 0)
            : undefined,
      };
    });
  return arr.length > 0 ? arr : undefined;
}

function parseNumberish(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

/**
 * Fetches the current user's favourite league IDs from _users/{uid}/favouriteLeagues.
 */
export async function fetchFavouriteLeagueIds(uid: string): Promise<string[]> {
  const db = getFirebaseDb();
  const snapshot = await get(ref(db, `_users/${uid}/favouriteLeagues`));

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, string>;
  return Object.keys(data);
}
