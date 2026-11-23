import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type Move, CELL } from "@/game/board";
import { type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";
import { useComputerMoveSteps } from "@/hooks/useComputerMoveSteps";

const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

// A computer game with a two-jump chain for the computer (spec section 6.2.2, example 15), as it is being shown.
function chainShown(steps: number): GameState {
  const game = newGame(againstComputer);
  const board = boardWith(
    [0, 1, CELL.player2Man],
    [1, 2, CELL.player1Man],
    [3, 4, CELL.player1Man],
    [7, 0, CELL.player1Man],
  );
  const chain: Move = { from: at(0, 1), to: at(4, 5), captured: [at(1, 2), at(3, 4)], path: [at(2, 3), at(4, 5)] };
  let state = { ...game, board, turnStart: { ...game.turnStart, board } };
  state = gameReducer(gameReducer(state, { type: "select", at: at(7, 0) }), { type: "chooseTarget", at: at(6, 1) });
  state = gameReducer(state, { type: "computerMoveReceived", requestId: 1, move: chain });
  for (let step = 0; step < steps; step++) {
    state = gameReducer(state, { type: "computerStepShown" });
  }
  return state;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Spec section 6.1.5, item 4: the computer's move, one jump at a time, with the pause between jumps.
describe("useComputerMoveSteps", () => {
  it("shows the first jump at once", () => {
    const dispatch = vi.fn();
    renderHook(() => useComputerMoveSteps(chainShown(0), dispatch));

    vi.advanceTimersByTime(0);

    expect(dispatch).toHaveBeenCalledWith({ type: "computerStepShown" });
  });

  it("shows each later jump when the jump before it has slid (380 ms) and the pause (180 ms) has passed", () => {
    const dispatch = vi.fn();
    renderHook(() => useComputerMoveSteps(chainShown(1), dispatch));

    vi.advanceTimersByTime(559);
    expect(dispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("keeps the pause between jumps when the device asks for reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      addEventListener() {},
      removeEventListener() {},
    }));
    const dispatch = vi.fn();
    renderHook(() => useComputerMoveSteps(chainShown(1), dispatch));

    vi.advanceTimersByTime(179);
    expect(dispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(dispatch).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no move is being shown", () => {
    const dispatch = vi.fn();
    renderHook(() => useComputerMoveSteps(newGame(againstComputer), dispatch));

    vi.advanceTimersByTime(2000);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("stops waiting when the move stops being shown, for example after Give up", () => {
    const dispatch = vi.fn();
    const { rerender } = renderHook(({ state }) => useComputerMoveSteps(state, dispatch), {
      initialProps: { state: chainShown(1) },
    });

    rerender({ state: gameReducer(chainShown(1), { type: "giveUp" }) });
    vi.advanceTimersByTime(2000);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
