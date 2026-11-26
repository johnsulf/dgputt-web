import { describe, expect, it } from "vitest";
import type { LeagueEvent, LeagueInstance } from "@/app/interfaces/league";
import {
  buildLeagueLeaderboard,
  standingsCutoff,
} from "./league-leaderboard-utils";
import {
  buildCornholeScores,
  buildRoundScores,
  getAvailableScoreFormat,
  getScoreFormats,
} from "./league-scores-utils";

const round = { finished: true, hits: 10, putts: 18 };

function stormPutt(
  id: string,
  overrides: Partial<LeagueEvent> = {},
): LeagueEvent {
  return {
    id,
    format: "stormputt",
    finished: true,
    players: { ada: { displayName: "Ada", rounds: [round] } },
    ...overrides,
  };
}

function league(events: LeagueEvent[]): LeagueInstance {
  return { id: "league", title: "League", validRoundsShare: "all", events };
}

describe("league standings", () => {
  it("awards full placement points to each event on the same date", () => {
    const events = [
      stormPutt("early", { date: "2026-11-25T17:00:00Z" }),
      stormPutt("late", { date: "2026-11-25T19:00:00Z" }),
    ];
    const [row] = buildLeagueLeaderboard(league(events));

    expect(row.placements.map(({ points }) => points)).toEqual([25, 25]);
    expect(row.totalPoints).toBe(50);
    expect(row.allPoints).toBe(50);

    const [best] = buildLeagueLeaderboard({
      ...league(events),
      validRoundsShare: "half",
    });
    expect(best.totalPoints).toBe(25);
    expect(best.allPoints).toBe(50);
  });

  it("includes an Overall opt-out in its own format standings and cutoff", () => {
    const data = league([
      stormPutt("format-only", { countsInAllFormats: false }),
    ]);

    expect(buildLeagueLeaderboard(data)).toEqual([]);
    expect(standingsCutoff(data).total).toBe(0);
    expect(getScoreFormats(data)).toEqual(["stormputt"]);

    const formatOptions = { formatFilter: "stormputt" } as const;
    expect(buildLeagueLeaderboard(data, formatOptions)[0].totalPoints).toBe(25);
    expect(standingsCutoff(data, formatOptions)).toEqual({
      counting: null,
      total: 1,
    });
  });

  it("falls back to All Formats when a season lacks the selected format", () => {
    const data = league([
      stormPutt("winter-stormputt", { seasonId: "winter" }),
      stormPutt("summer-cornhole", { seasonId: "summer", format: "cornhole" }),
    ]);
    expect(getAvailableScoreFormat(getScoreFormats(data), "cornhole")).toBe(
      "cornhole",
    );

    const seasonFilter = "winter";
    const formats = getScoreFormats(data, seasonFilter);
    const formatFilter = getAvailableScoreFormat(formats, "cornhole");

    expect(formatFilter).toBeUndefined();
    expect(
      buildLeagueLeaderboard(data, { seasonFilter, formatFilter })[0].totalPoints,
    ).toBe(25);
  });
});

function doublesEvent(
  id: string,
  format: "stormputt" | "cornhole",
  name: string,
  memberUids: string[],
): LeagueEvent {
  const pairId = `${id}-pair`;
  return stormPutt(id, {
    format,
    playerMode: "doubles",
    pairNames: { [pairId]: name },
    players: Object.fromEntries(
      memberUids.map((uid) => [
        uid,
        { displayName: uid, pairId, rounds: [round] },
      ]),
    ),
    matches: [
      {
        finished: true,
        player1: {
          uid: pairId,
          winner: true,
          members: memberUids.map((uid) => ({ uid })),
        },
        player2: { uid: `${id}-opponent`, displayName: "Opponent" },
      },
    ],
  });
}

describe.each(["stormputt", "cornhole"] as const)("%s doubles Scores", (format) => {
  it("keeps same-name teams separate and combines results across a rename", () => {
    const data = league([
      doublesEvent("one", format, "The Putters", ["ada", "bee"]),
      doublesEvent("two", format, "The Putters", ["cam", "dee"]),
      doublesEvent("three", format, "The Aces", ["bee", "ada"]),
    ]);
    const teams =
      format === "cornhole"
        ? buildCornholeScores(data, "cornhole:doubles")
            .filter(({ name }) => name !== "Opponent")
            .map(({ name, played }) => ({ name, events: played }))
        : buildRoundScores(data, "stormputt:doubles").map(({ name, rounds }) => ({
            name,
            events: rounds,
          }));

    expect(teams).toEqual([
      { name: "The Aces", events: 2 },
      { name: "The Putters", events: 1 },
    ]);
  });
});

it("identifies historical Cornhole teams from match members when the event roster is missing", () => {
  const events = [
    doublesEvent("one", "cornhole", "The Putters", ["ada", "bee"]),
    doublesEvent("two", "cornhole", "The Aces", ["bee", "ada"]),
  ].map((event) => ({ ...event, players: undefined }));

  const teams = buildCornholeScores(league(events), "cornhole:doubles");

  expect(teams.filter(({ won }) => won > 0)).toMatchObject([
    { name: "The Aces", won: 2 },
  ]);
  expect(teams.filter(({ lost }) => lost > 0).map(({ lost }) => lost)).toEqual([
    1, 1,
  ]);
});
