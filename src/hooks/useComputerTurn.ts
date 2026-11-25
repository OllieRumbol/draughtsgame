// Asks the API for the computer's move while the game waits for it (spec section 6.1.5, items 1 to 3, and plan
// section 3.3.4). It runs in an effect, so the request starts only after the board is on screen, never while the
// page is drawn (spec section 4.1, item 8). It checks the answer with findPath, against the same rules the web app
// uses, then sends computerMoveReceived, or computerMoveFailed for any failure (spec section 6.1.9).
// A good answer waits until the computer's thinking time has passed (plan section 3.6), so its move never follows the
// person's at once. A failure is shown as soon as it is known.
// When the phase changes, for example on Give up or New game, the effect's cleanup aborts the request and the wait,
// and nothing it gives back reaches the game (spec section 6.6, item 5).
import { useEffect } from "react";
import { timingsFor } from "@/components/board/timings";
import { type Action, type GameState, COMPUTER } from "@/game/game-state";
import { findPath } from "@/game/path";
import { getNextMove } from "@/services/api";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useComputerTurn(state: GameState, dispatch: (action: Action) => void): void {
  const timings = timingsFor(usePrefersReducedMotion());
  const requestId = state.phase.kind === "computerThinking" ? state.phase.requestId : null;
  const { board } = state;
  const { level } = state.settings;

  // The request starts as the person's move starts to slide, so the thinking time is counted from when it lands.
  const leastWait = timings.personSlide + timings.computerThink;

  useEffect(() => {
    if (requestId === null) {
      return;
    }

    const controller = new AbortController();
    const thinkingTimeOver = wait(leastWait, controller.signal);

    async function ask(id: number): Promise<void> {
      const result = await getNextMove(board, level, controller.signal);
      if (controller.signal.aborted) {
        return;
      }

      // A move that is not legal on this board counts as a failure (spec section 6.1.5, item 3).
      const move = result.ok ? findPath(board, COMPUTER, result.value.from, result.value.to, result.value.takes) : null;
      if (move === null) {
        dispatch({ type: "computerMoveFailed", requestId: id });
        return;
      }

      await thinkingTimeOver;
      if (controller.signal.aborted) {
        return;
      }
      dispatch({ type: "computerMoveReceived", requestId: id, move });
    }

    void ask(requestId);
    return () => controller.abort();
  }, [requestId, board, level, leastWait, dispatch]);
}

// Resolves after the given time. If the signal aborts first, it never resolves, and its timer is cleared.
function wait(milliseconds: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener("abort", () => clearTimeout(timer), { once: true });
  });
}
