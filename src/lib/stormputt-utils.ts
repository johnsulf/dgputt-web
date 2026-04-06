import type { LeagueEventPlayer } from "@/app/interfaces/league";

export const METER_DST_NORMAL = ["5m", "6m", "7m", "8m", "9m", "10m"];
export const FEET_DST_NORMAL = ["16ft", "20ft", "23ft", "26ft", "30ft", "33ft"];
export const METER_DST_LONG = ["10m", "11m", "12m", "13m", "14m", "15m"];
export const FEET_DST_LONG = ["33ft", "36ft", "40ft", "43ft", "46ft", "50ft"];

export function getDistanceLabels(dstIndex?: number): {
  meter: string[];
  feet: string[];
} {
  if (dstIndex === 1) return { meter: METER_DST_LONG, feet: FEET_DST_LONG };
  return { meter: METER_DST_NORMAL, feet: FEET_DST_NORMAL };
}

export interface PlayerRow {
  uid: string;
  name: string;
  pdgaNumber?: string;
  place: number;
  distances: number[];
  distancePutts: number[];
  hits: number;
  putts: number;
  hitPercent: number;
  roundsPlayed: number;
  dns?: boolean;
  dnf?: boolean;
}

export const NUM_DISTANCES = 6;

/**
 * Group players into teams for doubles mode.
 * Players sharing a pairId are merged into a single entry with combined rounds.
 */
function groupPlayersForDoubles(
  players: Record<string, LeagueEventPlayer>,
): Record<string, LeagueEventPlayer> {
  const teams = new Map<
    string,
    {
      names: string[];
      pdgaNumbers: string[];
      rounds: LeagueEventPlayer["rounds"];
      division?: string;
    }
  >();

  for (const [uid, player] of Object.entries(players)) {
    const teamId = player.pairId ?? uid;
    const existing = teams.get(teamId);
    const name = player.displayName ?? player.name ?? "Unknown";
    if (existing) {
      existing.names.push(name);
      if (player.pdgaNumber) existing.pdgaNumbers.push(player.pdgaNumber);
      // Merge rounds: sum hitsPerSequence, puttsPerSequence, hits, putts per round
      const existingRounds = existing.rounds ?? [];
      const newRounds = player.rounds ?? [];
      const maxLen = Math.max(existingRounds.length, newRounds.length);
      const merged: LeagueEventPlayer["rounds"] = [];
      for (let i = 0; i < maxLen; i++) {
        const a = existingRounds[i];
        const b = newRounds[i];
        if (!a && !b) {
          merged.push({});
          continue;
        }
        if (!a) {
          merged.push(b!);
          continue;
        }
        if (!b) {
          merged.push(a);
          continue;
        }
        const aHps = a.hitsPerSequence ?? [];
        const bHps = b.hitsPerSequence ?? [];
        const aPps = a.puttsPerSequence ?? [];
        const bPps = b.puttsPerSequence ?? [];
        const hps = Array.from(
          { length: NUM_DISTANCES },
          (_, j) => (aHps[j] ?? 0) + (bHps[j] ?? 0),
        );
        const pps = Array.from(
          { length: NUM_DISTANCES },
          (_, j) => (aPps[j] ?? 0) + (bPps[j] ?? 0),
        );
        merged.push({
          hits: (a.hits ?? 0) + (b.hits ?? 0),
          putts: (a.putts ?? 0) + (b.putts ?? 0),
          hitsPerSequence: hps,
          puttsPerSequence: pps,
          dns: a.dns === true && b.dns === true,
          dnf: a.dnf === true || b.dnf === true,
          finished: a.finished === true || b.finished === true,
        });
      }
      existing.rounds = merged;
    } else {
      teams.set(teamId, {
        names: [name],
        pdgaNumbers: player.pdgaNumber ? [player.pdgaNumber] : [],
        rounds: player.rounds ? [...player.rounds] : [],
        division: player.division,
      });
    }
  }

  const result: Record<string, LeagueEventPlayer> = {};
  for (const [teamId, team] of teams.entries()) {
    result[teamId] = {
      displayName: team.names.slice(0, 2).join(" / "),
      division: team.division,
      pdgaNumber: undefined,
      rounds: team.rounds,
    };
  }
  return result;
}

export function computeTotals(
  players: Record<string, LeagueEventPlayer>,
  isDoubles?: boolean,
): PlayerRow[] {
  const effective = isDoubles ? groupPlayersForDoubles(players) : players;
  const rows: Omit<PlayerRow, "place">[] = Object.entries(effective)
    .map(([uid, player]) => {
      const distances = Array.from({ length: NUM_DISTANCES }, () => 0);
      const distancePutts = Array.from({ length: NUM_DISTANCES }, () => 0);
      let totalHits = 0;
      let totalPutts = 0;
      let roundsPlayed = 0;

      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        if (round.finished === true) roundsPlayed++;
        const hps = round.hitsPerSequence ?? [];
        const pps = round.puttsPerSequence ?? [];
        for (let i = 0; i < NUM_DISTANCES; i++) {
          distances[i] += hps[i] ?? 0;
          distancePutts[i] += pps[i] ?? 0;
        }
        totalHits += round.hits ?? 0;
        totalPutts += round.putts ?? 0;
      }

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        pdgaNumber: player.pdgaNumber || undefined,
        distances,
        distancePutts,
        hits: totalHits,
        putts: totalPutts,
        hitPercent: totalPutts > 0 ? (totalHits / totalPutts) * 100 : 0,
        roundsPlayed,
      };
    })
    .sort((a, b) => b.hits - a.hits || b.hitPercent - a.hitPercent);

  return assignPlaces(rows);
}

export function computeRound(
  players: Record<string, LeagueEventPlayer>,
  roundIndex: number,
  isDoubles?: boolean,
): PlayerRow[] {
  const effective = isDoubles ? groupPlayersForDoubles(players) : players;
  const rows: Omit<PlayerRow, "place">[] = Object.entries(effective)
    .map(([uid, player]) => {
      const round = player.rounds?.[roundIndex];
      const dns = round?.dns === true;
      const dnf = round?.dnf === true;

      if (!round || dns) {
        return {
          uid,
          name: player.displayName ?? player.name ?? "Unknown",
          pdgaNumber: player.pdgaNumber || undefined,
          distances: Array.from({ length: NUM_DISTANCES }, () => 0),
          distancePutts: Array.from({ length: NUM_DISTANCES }, () => 0),
          hits: 0,
          putts: 0,
          hitPercent: 0,
          roundsPlayed: 0,
          dns,
        };
      }

      const hps = round.hitsPerSequence ?? [];
      const pps = round.puttsPerSequence ?? [];
      const distances = Array.from(
        { length: NUM_DISTANCES },
        (_, i) => hps[i] ?? 0,
      );
      const distancePutts = Array.from(
        { length: NUM_DISTANCES },
        (_, i) => pps[i] ?? 0,
      );

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        pdgaNumber: player.pdgaNumber || undefined,
        distances,
        distancePutts,
        hits: round.hits ?? 0,
        putts: round.putts ?? 0,
        hitPercent:
          (round.putts ?? 0) > 0
            ? ((round.hits ?? 0) / (round.putts ?? 0)) * 100
            : 0,
        roundsPlayed: 0,
        dns,
        dnf,
      };
    })
    .sort((a, b) => {
      if (a.dns || a.dnf) return 1;
      if (b.dns || b.dnf) return -1;
      return b.hits - a.hits || b.hitPercent - a.hitPercent;
    });

  return assignPlaces(rows);
}

export function assignPlaces(rows: Omit<PlayerRow, "place">[]): PlayerRow[] {
  let currentPlace = 1;
  return rows.map((row, i) => {
    if (row.dns || row.dnf) return { ...row, place: 0 };
    if (
      i > 0 &&
      !rows[i - 1].dns &&
      !rows[i - 1].dnf &&
      (row.hits !== rows[i - 1].hits ||
        row.hitPercent !== rows[i - 1].hitPercent)
    ) {
      currentPlace = i + 1;
    }
    return { ...row, place: currentPlace };
  });
}
