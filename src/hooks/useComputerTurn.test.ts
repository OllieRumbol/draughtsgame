import { renderHook } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";
import { useComputerTurn } from "@/hooks/useComputerTurn";
import { API_BASE_URL, server } from "@/test-server";

const againstComputer: Settings = { opponent: "computer", level: "easy", firstPlayer: 1 };

// A computer game where the person has moved (7,0) to (6,1), so the computer is asked for its move.
function waitingForTheComputer(): GameState {
  const board = boardWith([2, 1, CELL.player2Man], [7, 0, CELL.player1Man], [5, 6, CELL.player1Man]);
  const start = newGame(againstComputer);
  const actions: Action[] = [
    { type: "select", at: at(7, 0) },
    { type: "chooseTarget", at: at(6, 1) },
  ];
  return actions.reduce(gameReducer, { ...start, board, turnStart: { ...start.turnStart, board } });
}

// Spec section 6.6, item 5: once the request is cancelled, nothing it gives back reaches the game. Request ids
// start again at 1 in each new game, so this, and not the id, keeps a late answer out of the next game.
describe("useComputerTurn", () => {
  it("sends nothing to the game after the request is cancelled", async () => {
    let requests = 0;
    server.use(
      http.post(`${API_BASE_URL}/GetNextMove`, () => {
        requests += 1;
        return new Promise<Response>(() => {});
      }),
    );
    const dispatch = vi.fn();
    const waiting = waitingForTheComputer();
    const { rerender } = renderHook(({ state }) => useComputerTurn(state, dispatch), {
      initialProps: { state: waiting },
    });
    await vi.waitFor(() => expect(requests).toBe(1));

    // Give up changes the phase, so the effect's cleanup cancels the request, which then ends at once.
    rerender({ state: gameReducer(waiting, { type: "giveUp" }) });
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("sends the move once the answer has been checked", async () => {
    server.use(
      http.post(`${API_BASE_URL}/GetNextMove`, () =>
        HttpResponse.json({
          successful: true,
          nextMove: { currentHeight: 2, currentWidth: 1, nextHeight: 3, nextWidth: 0, takes: [] },
        }),
      ),
    );
    const dispatch = vi.fn();

    renderHook(() => useComputerTurn(waitingForTheComputer(), dispatch));

    await vi.waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith({
        type: "computerMoveReceived",
        requestId: 1,
        move: { from: at(2, 1), to: at(3, 0), captured: [], path: [at(3, 0)] },
      }),
    );
  });
});
