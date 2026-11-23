import { describe, expect, it } from "vitest";
import { NORMAL_TIMINGS, REDUCED_TIMINGS, captureFade, timingsFor } from "@/components/board/timings";

// Plan section 3.6, "Motion".
describe("the board's timings", () => {
  it("are the plan's: lift 180, slides 200 and 380, pause 180, crowning 180, 420 and 260", () => {
    expect(timingsFor(false)).toBe(NORMAL_TIMINGS);
    expect(NORMAL_TIMINGS).toMatchObject({
      lift: 180,
      targetFade: 180,
      personSlide: 200,
      computerSlide: 380,
      computerPause: 180,
      crownRise: 180,
      crownRipple: 420,
      crownSettle: 260,
    });
  });

  it("make slides, lifts and the crowning instant with reduced motion, keep fades at 100 ms, and keep the pause", () => {
    expect(timingsFor(true)).toBe(REDUCED_TIMINGS);
    expect(REDUCED_TIMINGS).toMatchObject({
      lift: 0,
      personSlide: 0,
      computerSlide: 0,
      crownRise: 0,
      crownRipple: 0,
      crownSettle: 0,
      stepBack: 100,
      targetFade: 100,
      computerPause: 180,
    });
  });

  it("start a captured piece's fade halfway through its jump, for 60% of the jump", () => {
    expect(captureFade(NORMAL_TIMINGS, 200)).toEqual({ delay: 100, duration: 120 });
    expect(captureFade(NORMAL_TIMINGS, 380)).toEqual({ delay: 190, duration: 228 });
  });

  it("fade a captured piece at once, for 100 ms, when the jump is instant", () => {
    expect(captureFade(REDUCED_TIMINGS, 0)).toEqual({ delay: 0, duration: 100 });
  });
});
