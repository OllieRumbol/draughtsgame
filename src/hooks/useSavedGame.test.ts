import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type Move, CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { toSavedGame } from "@/game/saved-game";
import { at, boardWith } from "@/game/test-boards";
import { loadSavedGame, useSavedGame } from "@/hooks/useSavedGame";
import { SAVED_GAME_KEY } from "@/services/storage";

const { player1Man: M1, player2Man: M2 } = CELL;

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "normal", firstPlayer: 1 };

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });

function stored(): unknown {
  const text = window.localStorage.getItem(SAVED_GAME_KEY);
  return text === null ? null : JSON.parse(text);
}

// The game as a save holds it, after a JSON round trip.
function asSaved(game: GameState): unknown {
  return JSON.parse(JSON.stringify(toSavedGame(game)));
}

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

// Spec section 6.1.8, items 2 and 5, and plan section 7.2, test 19 (the old key).
describe("loadSavedGame", () => {
  it("gives null when there is no saved game", () => {
    expect(loadSavedGame()).toBeNull();
  });

  it("gives the saved game, as it was", () => {
    const game = play(newGame(twoPlayers), select(5, 2), target(4, 3));
    window.localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(toSavedGame(game)));

    expect(loadSavedGame()).toEqual(game);
  });

  it("gives null for damaged data, and removes it, so game setup shows with no error", () => {
    window.localStorage.setItem(SAVED_GAME_KEY, '{"settings":');

    expect(loadSavedGame()).toBeNull();
    expect(window.localStorage.getItem(SAVED_GAME_KEY)).toBeNull();
  });

  it("ignores a game saved under an old key", () => {
    window.localStorage.setItem("draughts.game.v0", JSON.stringify(toSavedGame(newGame(twoPlayers))));

    expect(loadSavedGame()).toBeNull();
  });

  it("gives null when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });

    expect(loadSavedGame()).toBeNull();
  });
});

// Spec section 6.1.8, items 1, 4 and 6, and plan section 3.4: the save points.
describe("useSavedGame", () => {
  function renderSaving(first: GameState | null) {
    return renderHook((game: GameState | null) => useSavedGame(game), { initialProps: first });
  }

  it("saves a new game (Start game)", () => {
    renderSaving(newGame(twoPlayers));

    expect(stored()).toEqual(asSaved(newGame(twoPlayers)));
  });

  it("saves at the end of every turn, and not when a piece is only selected", () => {
    const start = newGame(twoPlayers);
    const { rerender } = renderSaving(start);
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    const selected = play(start, select(5, 2));
    rerender(selected);
    expect(setItem).not.toHaveBeenCalled();

    const moved = play(selected, target(4, 3));
    rerender(moved);
    expect(setItem).toHaveBeenCalledTimes(1);
    expect(stored()).toEqual(asSaved(moved));
  });

  it("saves after Undo, so a refresh does not bring the undone turn back", () => {
    const start = newGame(twoPlayers);
    const moved = play(start, select(5, 2), target(4, 3));
    const { rerender } = renderSaving(moved);

    rerender(play(moved, { type: "undo" }));

    expect(stored()).toEqual(asSaved(start));
  });

  it("saves a finished game (spec section 6.1.8, item 6)", () => {
    const over = play(newGame(twoPlayers), { type: "giveUp" });

    renderSaving(over);

    expect(stored()).toEqual(asSaved(over));
  });

  it("saves the start of the computer's turn, and writes nothing while its jumps are shown", () => {
    const start = newGame(againstComputer);
    const board = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]);
    const thinking = play({ ...start, board, turnStart: { ...start.turnStart, board } }, select(7, 0), target(6, 1));
    const chain: Move = { from: at(0, 1), to: at(4, 5), captured: [at(1, 2), at(3, 4)], path: [at(2, 3), at(4, 5)] };
    const { rerender } = renderSaving(thinking);
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    const moving = play(thinking, { type: "computerMoveReceived", requestId: 1, move: chain });
    rerender(moving);
    rerender(play(moving, { type: "computerStepShown" }));

    expect(setItem).not.toHaveBeenCalled();
    expect(stored()).toEqual(asSaved(thinking));
  });

  it("writes nothing during the person's chain, so a refresh goes back to the start of the turn, mark and all", () => {
    const start = newGame(againstComputer);
    const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1], [0, 7, M2]);
    const thinking = play({ ...start, board, turnStart: { ...start.turnStart, board } }, select(7, 6), target(6, 7));
    const reply: Move = { from: at(0, 7), to: at(1, 6), captured: [], path: [at(1, 6)] };
    const marked = play(
      thinking,
      { type: "computerMoveReceived", requestId: 1, move: reply },
      { type: "computerStepShown" },
    );
    const { rerender } = renderSaving(marked);
    const setItem = vi.spyOn(Storage.prototype, "setItem");

    const afterFirstJump = play(marked, select(6, 1), target(4, 3));
    rerender(afterFirstJump);

    expect(afterFirstJump.lastComputerMove).toBeNull();
    expect(setItem).not.toHaveBeenCalled();
    expect(loadSavedGame()).toEqual(marked);

    const turnEnded = play(afterFirstJump, { type: "endTurn" });
    rerender(turnEnded);

    expect(stored()).toEqual(asSaved(turnEnded));
  });

  it("saves a failed computer move, and Try again", () => {
    const thinking = play(newGame(againstComputer), select(5, 2), target(4, 3));
    const failed = play(thinking, { type: "computerMoveFailed", requestId: 1 });
    const { rerender } = renderSaving(failed);
    expect(stored()).toEqual(asSaved(failed));

    const retried = play(failed, { type: "retry" });
    rerender(retried);

    expect(stored()).toEqual(asSaved(retried));
  });

  it("clears the saved game when the game is closed for game setup (New game)", () => {
    const { rerender } = renderSaving(newGame(twoPlayers));

    rerender(null);

    expect(window.localStorage.getItem(SAVED_GAME_KEY)).toBeNull();
  });

  it("keeps the saved game when the page closes, so a visit to another page keeps it (spec section 6.1.8, item 7)", () => {
    const { unmount } = renderSaving(newGame(twoPlayers));

    unmount();

    expect(stored()).toEqual(asSaved(newGame(twoPlayers)));
  });

  it("goes on when storage cannot be written (spec section 6.6, item 10)", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Full", "QuotaExceededError");
    });

    expect(() => renderSaving(newGame(twoPlayers))).not.toThrow();
  });
});
