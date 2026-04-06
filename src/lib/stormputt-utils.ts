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

export function computeTotals(
  players: Record<string, LeagueEventPlayer>,
): PlayerRow[] {
  const rows: Omit<PlayerRow, "place">[] = Object.entries(players)
    .map(([uid, player]) => {
      const distances = Array.from({ length: NUM_DISTANCES }, () => 0);
      const distancePutts = Array.from({ length: NUM_DISTANCES }, () => 0);
      let totalHits = 0;
      let totalPutts = 0;
      let roundsPlayed = 0;

      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        roundsPlayed++;
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
): PlayerRow[] {
  const rows: Omit<PlayerRow, "place">[] = Object.entries(players)
    .map(([uid, player]) => {
      const round = player.rounds?.[roundIndex];
      const dns = round?.dns === true;
      const dnf = round?.dnf === true;

      if (!round || dns) {
        return {
          uid,
          name: player.displayName ?? player.name ?? "Unknown",
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
