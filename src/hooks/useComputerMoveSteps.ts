// Shows the computer's move one jump at a time (spec section 6.1.5, items 4 and 7, and plan sections 3.3.3 and 3.6).
// While the phase is computerMoving, it sends computerStepShown for each step in turn: the first at once, and each
// later one when the jump before it has slid and the pause has passed. After the last jump, it sends one more when
// that jump has slid and any crowning has ended, so the turn passes only when the whole move has been shown.
// With reduced motion the jumps and the crowning are instant, but the pause stays, so the captures can still be
// counted. T15 uses it with useComputerTurn.
import { useEffect } from "react";
import { crowningLength, timingsFor } from "@/components/board/timings";
import { cellAt, isKing } from "@/game/board";
import type { Action, GameState } from "@/game/game-state";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useComputerMoveSteps(state: GameState, dispatch: (action: Action) => void): void {
  const timings = timingsFor(usePrefersReducedMotion());
  const phase = state.phase;
  const step = phase.kind === "computerMoving" ? phase.step : null;
  const jumps = phase.kind === "computerMoving" ? phase.move.path.length : 0;
  const crowned =
    phase.kind === "computerMoving" &&
    !isKing(cellAt(state.turnStart.board, phase.move.from)) &&
    isKing(cellAt(state.board, phase.move.to));

  useEffect(() => {
    if (step === null) {
      return;
    }
    let wait = 0;
    if (step > 0 && step < jumps) {
      wait = timings.computerSlide + timings.computerPause;
    } else if (step === jumps) {
      wait = timings.computerSlide + (crowned ? crowningLength(timings) : 0);
    }
    const timer = setTimeout(() => dispatch({ type: "computerStepShown" }), wait);
    return () => clearTimeout(timer);
  }, [step, jumps, crowned, dispatch, timings]);
}
