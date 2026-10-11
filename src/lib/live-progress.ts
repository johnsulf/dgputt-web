import type { LeagueEventRound } from "@/app/interfaces/league";

/** The round's group number, or undefined when the round is not grouped. */
export function roundGroup(round?: LeagueEventRound): number | undefined {
  const group = round?.group;
  return group != null && group > 0 ? group : undefined;
}

/**
 * Cells per line when `n` cells wrap onto lines of at most `max`, split as
 * evenly as possible so no line is left short: 20 at 12 is 2 x 10.
 */
export function evenLineLength(n: number, max: number): number {
  if (n <= max) return Math.max(n, 1);
  return Math.ceil(n / Math.ceil(n / max));
}

/**
 * The distance or station a player is on now, given which ones already have
 * a score. Players fill in from left to right but don't always start at the
 * first one, so it is the first empty field to the right of the leftmost
 * score. When everything to the right is filled the player has wrapped
 * around, and it is the first empty field from the left.
 *
 * Returns -1 when nothing has a score yet or everything is filled.
 */
export function activeIndex(done: boolean[]): number {
  const first = done.indexOf(true);
  if (first === -1) return -1;
  const right = done.findIndex((isDone, i) => i > first && !isDone);
  return right !== -1 ? right : done.indexOf(false);
}

/**
 * A doubles team's round status from its members' statuses: the team is
 * finished (or not started) only when every member is, and otherwise still
 * active. Members who are DNS should be left out by the caller.
 */
export function teamRoundStatus<S extends string>(memberStatuses: S[]): S {
  const [first] = memberStatuses;
  return memberStatuses.every((s) => s === first) ? first : ("putting" as S);
}
