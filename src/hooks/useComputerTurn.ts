// Asks the API for the computer's move while the game waits for it (spec section 6.1.5, items 1 to 3, and plan
// section 3.3.4). It runs in an effect, so the request starts only after the board is on screen, never while the
// page is drawn (spec section 4.1, item 8). It checks the answer with findPath, against the same rules the web app
// uses, then sends computerMoveReceived, or computerMoveFailed for any failure (spec section 6.1.9).
// When the phase changes, for example on Give up or New game, the effect's cleanup aborts the request, and a late
// answer is ignored (spec section 6.6, item 5).
import { useEffect } from "react";
import { type Action, type GameState, COMPUTER } from "@/game/game-state";
import { findPath } from "@/game/path";
import { getNextMove } from "@/services/api";

export function useComputerTurn(state: GameState, dispatch: (action: Action) => void): void {
  const requestId = state.phase.kind === "computerThinking" ? state.phase.requestId : null;
  const { board } = state;
  const { level } = state.settings;

  useEffect(() => {
    if (requestId === null) {
      return;
    }

    const controller = new AbortController();

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
      dispatch({ type: "computerMoveReceived", requestId: id, move });
    }

    void ask(requestId);
    return () => controller.abort();
  }, [requestId, board, level, dispatch]);
}
