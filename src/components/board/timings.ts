// Every timing of the board's motion, in milliseconds (plan section 3.6, "Motion"). Nothing else in the board sets a
// duration: the CSS reads these through custom properties that the board sets, and the animations take them as
// arguments. Change them here, in one place.

export type Timings = {
  lift: number; // lift on select, and put down
  stepBack: number; // the player's other pieces fade: the design's 220 ms, as plan 3.6 gives no time
  targetFade: number; // target dots fade and grow in
  personSlide: number; // the person's move or jump
  computerThink: number; // the least time from the person's move landing to the computer's move starting
  computerSlide: number; // each of the computer's jumps
  computerPause: number; // the pause between the computer's jumps
  captureStart: number; // when a captured piece starts to fade, as a share of its jump
  captureLength: number; // how long it fades, as a share of its jump
  captureFadeWhenReduced: number; // the captured piece's fade when motion is reduced
  crownRise: number; // the crowning: the piece rises and grows
  crownRipple: number; // one soft brass ripple spreads out
  crownSettleStart: number; // the piece starts to settle, this long after the ripple starts
  crownSettle: number; // the piece settles back down with a small dip
  showMeStart: number; // How to play's "Show me": the pause before the first step, once the marks have faded (design)
  showMeReturn: number; // "Show me" returns to the still picture this long after its last step (plan 3.6: about 1 s)
};

export const NORMAL_TIMINGS: Timings = {
  lift: 180,
  stepBack: 220,
  targetFade: 180,
  personSlide: 200,
  computerThink: 700,
  computerSlide: 380,
  computerPause: 180,
  captureStart: 0.5,
  captureLength: 0.6,
  captureFadeWhenReduced: 100,
  crownRise: 180,
  crownRipple: 420,
  crownSettleStart: 160,
  crownSettle: 260,
  showMeStart: 250,
  showMeReturn: 1000,
};

// When the device asks for reduced motion, slides, lifts and the crowning are instant. Fades stay, shortened to
// 100 ms. The computer's jumps are still shown one at a time, with the pause, so captures can still be counted.
// The computer's thinking time stays too, so its move does not follow the person's at once.
export const REDUCED_TIMINGS: Timings = {
  ...NORMAL_TIMINGS,
  lift: 0,
  stepBack: 100,
  targetFade: 100,
  personSlide: 0,
  computerSlide: 0,
  crownRise: 0,
  crownRipple: 0,
  crownSettleStart: 0,
  crownSettle: 0,
};

export function timingsFor(reducedMotion: boolean): Timings {
  return reducedMotion ? REDUCED_TIMINGS : NORMAL_TIMINGS;
}

// How long the whole crowning lasts: the rise, then the ripple and the settle, which run side by side.
export function crowningLength(timings: Timings): number {
  return timings.crownRise + Math.max(timings.crownRipple, timings.crownSettleStart + timings.crownSettle);
}

// The captured piece fades and shrinks to 50%, starting halfway through the jump, for 60% of the jump time.
// With reduced motion there is no jump to follow, so it fades at once, for 100 ms.
export function captureFade(timings: Timings, slide: number): { delay: number; duration: number } {
  if (slide === 0) {
    return { delay: 0, duration: timings.captureFadeWhenReduced };
  }
  return { delay: slide * timings.captureStart, duration: slide * timings.captureLength };
}
