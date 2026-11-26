import type { ReactNode } from "react";

function Equation({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border bg-background px-4 py-3 font-mono text-base leading-relaxed">
      {children}
    </p>
  );
}

export function RatingCalculation() {
  return (
    <div className="space-y-6">
      <p>
        dgputt uses a modified Elo model. A new player starts at 1500. Each
        update compares an observed result with the result expected from the
        players’ ratings before the match or round.
      </p>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">1. Expected and observed results</h4>
        <p>Let <var>R<sub>i</sub></var> and <var>R<sub>j</sub></var> be the ratings of player <var>i</var> and opponent <var>j</var>.</p>
        <Equation>
          E<sub>ij</sub> = 1 / (1 + 10<sup>(R<sub>j</sub> − R<sub>i</sub>)/400</sup>)
        </Equation>
        <p>
          The observed result <var>S<sub>ij</sub></var> is 1 for a win, ½ for a tie,
          and 0 for a loss. In a field round, compare the two round scores:
          hits in StormPutt or the recorded points in Stations. Score margins
          have no effect beyond deciding which result applies.
        </p>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">2. How much a result can move the rating</h4>
        <p>
          Let <var>P</var> be the reference putt count and <var>d</var> the
          reference distance in metres. The effective update factor is:
        </p>
        <Equation>K = 20 × clamp(√(P / 40), 0.5, 1.5) × D(d)</Equation>
        <p>
          Here clamp limits the putt multiplier to the interval [0.5, 1.5].
          The distance factor <var>D(d)</var> is 0.8 for <var>d</var> ≤ 6,
          1.0 for 6 &lt; <var>d</var> ≤ 8, 1.2 for 8 &lt; <var>d</var> ≤ 10,
          and 1.4 for <var>d</var> &gt; 10.
        </p>
        <p>
          Cornhole uses a fixed <var>P</var> of 20 and the match distance.
          StormPutt uses its required putt count and a mean distance of 7.5 m.
          For Stations, let <var>p<sub>s</sub></var> be the required putts at
          station <var>s</var> and <var>d<sub>s</sub></var> its distance. The
          app uses 7.5 m for custom or undefined distances.
        </p>
        <Equation>
          P = Σ<sub>s</sub> p<sub>s</sub>, d = (Σ<sub>s</sub> p<sub>s</sub> × d<sub>s</sub>) / P
        </Equation>
      </section>

      <section className="space-y-3">
        <h4 className="text-lg font-semibold">3. Provisional players and the rating update</h4>
        <p>
          With <var>m<sub>i</sub></var> previous rated results, player <var>i</var>’s
          confidence is <var>C<sub>i</sub></var>. A rated match or field round counts
          as one result.
        </p>
        <Equation>C<sub>i</sub> = clamp(m<sub>i</sub> / 15, 0.1, 1)</Equation>
        <p>
          Each opponent’s contribution is weighted by the ratio of their
          confidence to yours, capped at 1. This limits how much a provisional
          player moves an established player’s rating. The two players’ changes
          can therefore differ in magnitude.
        </p>
        <Equation>
          ΔR<sub>i</sub> = K / (n − 1) × Σ<sub>j ≠ i</sub> [min(1, C<sub>j</sub> / C<sub>i</sub>) × (S<sub>ij</sub> − E<sub>ij</sub>)]
        </Equation>
        <p>
          <var>n</var> is the number of eligible players in the round. For a
          Cornhole match, <var>n</var> = 2, so there’s one comparison and the
          denominator is 1. For StormPutt and Stations, the app averages the
          weighted differences over every opponent. A larger field alone
          can’t increase the maximum change beyond <var>K</var> before rounding.
          The app rounds Δ<var>R<sub>i</sub></var> to the nearest integer, with
          halves rounded away from zero, then adds it to the old rating.
        </p>
        <p>
          A field round needs at least two eligible players. DNS rounds are
          excluded, and DNF rounds use the score actually recorded.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border bg-background p-4">
        <h4 className="text-lg font-semibold">Worked example: a StormPutt field round</h4>
        <p>
          Three established players rated 1500 play StormPutt 18. Each
          expected result is 0.5, all confidence weights are 1, and{" "}
          <var>K</var> = 20√(18 / 40) ≈ 13.42. With three distinct scores,
          the observed averages are 1, 0.5, and 0 from first to last.
        </p>
        <p>
          Their raw changes are approximately +6.71, 0, and −6.71. After
          rounding, their new ratings are <strong>1507, 1500, and 1493</strong>.
        </p>
      </section>
    </div>
  );
}
