/**
 * How a league turns an event placing into standings points, and how much of
 * its events count towards a player's total. Both are league settings written
 * by the app, so this mirrors how the app reads them.
 */

export type PointsSystemKind = "standard" | "custom";

export interface PointsSystem {
  kind: PointsSystemKind;
  /** The least a player gets for finishing an event. */
  floor: number;
  /** Points per place for a custom system, 1st place first. */
  places: number[];
}

/** Formula 1 table, 1st place first. */
export const STANDARD_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const DEFAULT_FLOOR = 1;
const MAX_FLOOR = 10;
const MAX_PLACES = 30;
const MAX_POINTS = 999;

export const STANDARD_POINTS_SYSTEM: PointsSystem = {
  kind: "standard",
  floor: DEFAULT_FLOOR,
  places: [],
};

/** The table in use, 1st place first. Places beyond it get the floor. */
export function pointsTable(system: PointsSystem): number[] {
  return system.kind === "custom" ? system.places : STANDARD_POINTS;
}

/** Points for finishing in `place` (1 is the winner). */
export function pointsForPlace(system: PointsSystem, place: number): number {
  const table = pointsTable(system);
  const fromTable = place >= 1 && place <= table.length ? table[place - 1] : 0;
  return Math.max(fromTable, system.floor);
}

/** A custom table must fall with each place and stay at or above the floor. */
function isValidCustom(system: PointsSystem): boolean {
  const { places, floor } = system;
  if (places.length === 0 || places.length > MAX_PLACES) return false;
  for (let i = 0; i < places.length; i++) {
    if (places[i] < 0 || places[i] > MAX_POINTS) return false;
    if (i > 0 && places[i] >= places[i - 1]) return false;
  }
  return places[places.length - 1] >= floor;
}

/**
 * Reads the league's `pointsSystem`. Anything missing or unusable becomes the
 * standard system, so a league that never set one still has standings.
 */
export function parsePointsSystem(raw: unknown): PointsSystem {
  if (!raw || typeof raw !== "object") return STANDARD_POINTS_SYSTEM;
  const r = raw as Record<string, unknown>;
  const floor =
    typeof r.floor === "number"
      ? Math.min(MAX_FLOOR, Math.max(0, Math.trunc(r.floor)))
      : DEFAULT_FLOOR;
  const places = (
    Array.isArray(r.places)
      ? r.places
      : r.places && typeof r.places === "object"
        ? Object.values(r.places)
        : []
  )
    .filter((p): p is number => typeof p === "number")
    .map(Math.trunc);
  const parsed: PointsSystem = {
    kind: r.type === "custom" ? "custom" : "standard",
    floor,
    places,
  };
  if (parsed.kind === "custom" && !isValidCustom(parsed)) {
    return { ...parsed, kind: "standard" };
  }
  return parsed;
}

export type ValidRoundsShare = "half" | "twoThirds" | "all";

export const DEFAULT_SHARE: ValidRoundsShare = "twoThirds";

export function parseValidRoundsShare(raw: unknown): ValidRoundsShare {
  return raw === "half" || raw === "twoThirds" || raw === "all"
    ? raw
    : DEFAULT_SHARE;
}

const SHARE_FRACTION: Record<ValidRoundsShare, [number, number]> = {
  half: [1, 2],
  twoThirds: [2, 3],
  all: [1, 1],
};

/**
 * How many events or rounds count toward rank, rounded up and at least one.
 */
export function shareCount(share: ValidRoundsShare, total: number): number {
  if (total <= 0) return 1;
  const [num, den] = SHARE_FRACTION[share];
  return Math.max(1, Math.ceil((total * num) / den));
}
