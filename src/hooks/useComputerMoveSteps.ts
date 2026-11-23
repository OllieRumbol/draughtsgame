// Shows the computer's move one jump at a time (spec section 6.1.5, item 4, and plan section 3.6, "Motion").
// While the phase is computerMoving, it sends computerStepShown for each step in turn: the first at once, and each
// later one when the jump before it has slid and the pause has passed. With reduced motion the jumps are instant,
// but the pause stays, so the captures can still be counted. T15 uses it with useComputerTurn.
import { useEffect } from "react";
import { timingsFor } from "@/components/board/timings";
import type { Action, GameState } from "@/game/game-state";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useComputerMoveSteps(state: GameState, dispatch: (action: Action) => void): void {
  const timings = timingsFor(usePrefersReducedMotion());
  const step = state.phase.kind === "computerMoving" ? state.phase.step : null;

  useEffect(() => {
    if (step === null) {
      return;
    }
    const wait = step === 0 ? 0 : timings.computerSlide + timings.computerPause;
    const timer = setTimeout(() => dispatch({ type: "computerStepShown" }), wait);
    return () => clearTimeout(timer);
  }, [step, dispatch, timings]);
}
