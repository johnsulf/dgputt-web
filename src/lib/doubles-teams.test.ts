import { describe, expect, it } from "vitest";
import type { LeagueEvent, LeagueEventPlayer } from "@/app/interfaces/league";
import { buildParticipants } from "@/lib/cornhole-utils";
import { parseSingleEvent } from "@/lib/league-service";
import { buildStationsLiveState } from "@/lib/stations-live";
import { buildStormPuttLiveState } from "@/lib/stormputt-live";

const finishedRound = {
  finished: true,
  hits: 6,
  putts: 12,
  hitsPerSequence: [1, 1, 1, 1, 1, 1],
  puttsPerSequence: [2, 2, 2, 2, 2, 2],
};
// Two of six distances done.
const partialRound = {
  hits: 2,
  putts: 4,
  hitsPerSequence: [1, 1, 0, 0, 0, 0],
  puttsPerSequence: [2, 2, 0, 0, 0, 0],
};
const emptyRound = {
  hits: 0,
  putts: 0,
  hitsPerSequence: [0, 0, 0, 0, 0, 0],
  puttsPerSequence: [0, 0, 0, 0, 0, 0],
};

function team(
  a: LeagueEventPlayer["rounds"],
  b: LeagueEventPlayer["rounds"],
): Record<string, LeagueEventPlayer> {
  return {
    u1: { displayName: "Ann", pairId: "t1", division: "Open", rounds: a },
    u2: { displayName: "Bo", pairId: "t1", division: "Open", rounds: b },
  };
}

function stormputt(players: Record<string, LeagueEventPlayer>): LeagueEvent {
  return {
    id: "e",
    format: "stormputt",
    playerMode: "doubles",
    players,
  };
}

function stations(players: Record<string, LeagueEventPlayer>): LeagueEvent {
  return {
    id: "e",
    format: "stations",
    playerMode: "doubles",
    players,
    formatConfig: {
      stations: [
        { putts: 2, weight: 1 },
        { putts: 2, weight: 1 },
        { putts: 2, weight: 1 },
      ],
    },
  };
}

describe("doubles team round status", () => {
  it("StormPutt team stays active while one partner is still putting", () => {
    const state = buildStormPuttLiveState(
      stormputt(team([finishedRound], [partialRound])),
    );
    expect(state.standings[0].round.status).toBe("putting");
    expect(state.roundStats).toEqual({ finished: 0, playing: 1, total: 1 });
    // Combined score is still the sum of both partners.
    expect(state.standings[0].hits).toBe(8);
  });

  it("StormPutt team is active when one partner finished and the other has not started", () => {
    const state = buildStormPuttLiveState(
      stormputt(team([finishedRound], [emptyRound])),
    );
    expect(state.standings[0].round.status).toBe("putting");
  });

  it("StormPutt team finishes only when both partners have", () => {
    const state = buildStormPuttLiveState(
      stormputt(team([finishedRound], [finishedRound])),
    );
    expect(state.standings[0].round.status).toBe("finished");
    expect(state.roundStats.finished).toBe(1);
    expect(state.standings[0].hits).toBe(12);
  });

  it("StormPutt team ignores a DNS partner", () => {
    const state = buildStormPuttLiveState(
      stormputt(team([finishedRound], [{ ...emptyRound, dns: true }])),
    );
    expect(state.standings[0].round.status).toBe("finished");
  });

  const stationDone = {
    finished: true,
    hitsPerSequence: [1, 1, 1],
    puttsPerSequence: [2, 2, 2],
  };
  const stationPartial = {
    hitsPerSequence: [1, 0, 0],
    puttsPerSequence: [2, 0, 0],
  };

  it("Stations team stays active until both partners finish", () => {
    const state = buildStationsLiveState(
      stations(team([stationDone], [stationPartial])),
    );
    expect(state.standings[0].round.status).toBe("putting");
    expect(state.roundStats).toEqual({ finished: 0, playing: 1, total: 1 });
    expect(state.standings[0].score).toBe(4);
  });

  it("Stations team finishes when both partners have", () => {
    const state = buildStationsLiveState(
      stations(team([stationDone], [stationDone])),
    );
    expect(state.standings[0].round.status).toBe("finished");
    expect(state.standings[0].score).toBe(6);
  });
});

describe("doubles team divisions", () => {
  const raw = {
    title: "Doubles",
    playerMode: "doubles",
    _pairs: { t1: { name: "The Aces", division: "Mixed" } },
    _players: {
      u1: { displayName: "Ann", pairId: "t1", division: "Open" },
      u2: { displayName: "Bo", pairId: "t1" },
    },
  };

  it("parses the pair division from _pairs", () => {
    const event = parseSingleEvent("e", raw);
    expect(event?.pairDivisions).toEqual({ t1: "Mixed" });
    expect(event?.pairNames).toEqual({ t1: "The Aces" });
  });

  it("has no pair divisions when none are set", () => {
    const event = parseSingleEvent("e", {
      ...raw,
      _pairs: { t1: { name: "A" } },
    });
    expect(event?.pairDivisions).toBeUndefined();
  });

  it("uses the pair division for StormPutt and Stations standings", () => {
    const players = team([finishedRound], [finishedRound]);
    players.u2.division = undefined;
    const pairDivisions = { t1: "Mixed" };

    const sp = buildStormPuttLiveState({
      ...stormputt(players),
      pairDivisions,
    });
    expect(sp.standings[0].division).toBe("Mixed");

    const st = buildStationsLiveState({ ...stations(players), pairDivisions });
    expect(st.standings[0].division).toBe("Mixed");
  });

  it("uses the pair division for Cornhole participants", () => {
    const event = parseSingleEvent("e", { ...raw, format: "cornhole" })!;
    expect(buildParticipants(event).participants.get("t1")?.division).toBe(
      "Mixed",
    );
  });

  it("falls back to the first member's division without a pair division", () => {
    const event = parseSingleEvent("e", {
      ...raw,
      _pairs: { t1: { name: "The Aces" } },
      format: "cornhole",
    })!;
    expect(buildParticipants(event).participants.get("t1")?.division).toBe(
      "Open",
    );
  });
});
