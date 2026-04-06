import type { LeagueEvent, LeagueEventPlayer } from "@/app/interfaces/league";

export interface StationDef {
  key: string;
  putts: number;
  weight: number;
  distanceIndex?: number | null;
  customDistance?: string | null;
  labelOverride?: string | null;
}

export interface StationsPlayerRow {
  uid: string;
  name: string;
  place: number;
  stationHits: number[];
  stationPutts: number[];
  stationScores: number[];
  totalHits: number;
  totalPutts: number;
  totalScore: number;
  hitPercent: number;
  dns?: boolean;
  dnf?: boolean;
}

export function getStations(event: LeagueEvent): StationDef[] {
  const cfg = event.formatConfig;
  if (!cfg) return [];
  const raw = cfg.stations;
  if (!Array.isArray(raw)) return [];
  return (raw as Record<string, unknown>[]).map((s, i) => ({
    key: (s.key as string) ?? `S${i + 1}`,
    putts: (s.putts as number) ?? 2,
    weight: (s.weight as number) ?? 1,
    distanceIndex: s.distanceIndex as number | null | undefined,
    customDistance: s.customDistance as string | null | undefined,
    labelOverride: s.labelOverride as string | null | undefined,
  }));
}

export function getStationLabel(station: StationDef, index: number): string {
  if (station.labelOverride) return station.labelOverride;
  if (station.customDistance) return `${station.customDistance}`;
  return `S${index + 1}`;
}

export function computeStationsTotals(
  players: Record<string, LeagueEventPlayer>,
  stations: StationDef[],
): StationsPlayerRow[] {
  const numStations = stations.length;
  const rows: Omit<StationsPlayerRow, "place">[] = Object.entries(players)
    .map(([uid, player]) => {
      const stationHits = Array.from({ length: numStations }, () => 0);
      const stationPutts = Array.from({ length: numStations }, () => 0);

      for (const round of player.rounds ?? []) {
        if (round.dns === true || round.dnf === true) continue;
        const hps = round.hitsPerSequence ?? [];
        const pps = round.puttsPerSequence ?? [];
        for (let i = 0; i < numStations; i++) {
          stationHits[i] += hps[i] ?? 0;
          stationPutts[i] += pps[i] ?? 0;
        }
      }

      const totalHits = stationHits.reduce((a, b) => a + b, 0);
      const totalPutts = stationPutts.reduce((a, b) => a + b, 0);

      const stationScores = stationHits.map(
        (h, i) => h * (stations[i]?.weight ?? 1),
      );
      const totalScore = stationScores.reduce((a, b) => a + b, 0);

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        stationHits,
        stationPutts,
        stationScores,
        totalHits,
        totalPutts,
        totalScore,
        hitPercent: totalPutts > 0 ? (totalHits / totalPutts) * 100 : 0,
      };
    })
    .sort(
      (a, b) =>
        b.totalScore - a.totalScore ||
        b.hitPercent - a.hitPercent ||
        b.totalHits - a.totalHits,
    );

  return assignPlaces(rows);
}

export function computeStationsRound(
  players: Record<string, LeagueEventPlayer>,
  stations: StationDef[],
  roundIndex: number,
): StationsPlayerRow[] {
  const numStations = stations.length;
  const rows: Omit<StationsPlayerRow, "place">[] = Object.entries(players)
    .map(([uid, player]) => {
      const round = player.rounds?.[roundIndex];
      const dns = round?.dns === true;
      const dnf = round?.dnf === true;

      if (!round || dns) {
        return {
          uid,
          name: player.displayName ?? player.name ?? "Unknown",
          stationHits: Array.from({ length: numStations }, () => 0),
          stationPutts: Array.from({ length: numStations }, () => 0),
          stationScores: Array.from({ length: numStations }, () => 0),
          totalHits: 0,
          totalPutts: 0,
          totalScore: 0,
          hitPercent: 0,
          dns,
        };
      }

      const hps = round.hitsPerSequence ?? [];
      const pps = round.puttsPerSequence ?? [];
      const stationHits = Array.from(
        { length: numStations },
        (_, i) => hps[i] ?? 0,
      );
      const stationPutts = Array.from(
        { length: numStations },
        (_, i) => pps[i] ?? 0,
      );
      const stationScores = stationHits.map(
        (h, i) => h * (stations[i]?.weight ?? 1),
      );
      const totalScore = stationScores.reduce((a, b) => a + b, 0);
      const totalHits = stationHits.reduce((a, b) => a + b, 0);
      const totalPutts = stationPutts.reduce((a, b) => a + b, 0);

      return {
        uid,
        name: player.displayName ?? player.name ?? "Unknown",
        stationHits,
        stationPutts,
        stationScores,
        totalHits,
        totalPutts,
        totalScore,
        hitPercent:
          totalPutts > 0
            ? (totalHits / totalPutts) * 100
            : 0,
        dns,
        dnf,
      };
    })
    .sort((a, b) => {
      if (a.dns || a.dnf) return 1;
      if (b.dns || b.dnf) return -1;
      return (
        b.totalScore - a.totalScore ||
        b.hitPercent - a.hitPercent ||
        b.totalHits - a.totalHits
      );
    });

  return assignPlaces(rows);
}

function assignPlaces(
  rows: Omit<StationsPlayerRow, "place">[],
): StationsPlayerRow[] {
  let currentPlace = 1;
  return rows.map((row, i) => {
    if (row.dns || row.dnf) return { ...row, place: 0 };
    if (
      i > 0 &&
      !rows[i - 1].dns &&
      !rows[i - 1].dnf &&
      (row.totalScore !== rows[i - 1].totalScore ||
        row.hitPercent !== rows[i - 1].hitPercent)
    ) {
      currentPlace = i + 1;
    }
    return { ...row, place: currentPlace };
  });
}
