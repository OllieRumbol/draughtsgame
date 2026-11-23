import { describe, expect, it } from "vitest";
import { type Board, type Move, CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";
import {
  type Tracked,
  crowned,
  landed,
  startTracking,
  trackNext,
  withoutPiece,
} from "@/components/board/tracked-pieces";

const { player1Man: M1, player2Man: M2 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function gameOn(board: Board, settings: Settings = twoPlayers): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
}

// Tracks the pieces through each action, as the board does on each new state.
function follow(start: GameState, ...actions: Action[]): { tracked: Tracked; state: GameState } {
  return followWith(true, start, ...actions);
}

// The same, with the board's motion on (animates) or reduced.
function followWith(animates: boolean, start: GameState, ...actions: Action[]): { tracked: Tracked; state: GameState } {
  let state = start;
  let tracked = startTracking(start);
  for (const action of actions) {
    state = gameReducer(state, action);
    tracked = trackNext(tracked, state, animates);
  }
  return { tracked, state };
}

function idAt(tracked: Tracked, row: number, col: number): number | undefined {
  return tracked.pieces.find((piece) => !piece.leaving && piece.position.row === row && piece.position.col === col)?.id;
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });

describe("tracking the pieces", () => {
  it("gives every piece its own id", () => {
    const tracked = startTracking(newGame(twoPlayers));

    expect(tracked.pieces).toHaveLength(24);
    expect(new Set(tracked.pieces.map((piece) => piece.id)).size).toBe(24);
  });

  it("keeps the id of the piece that moved, so it can slide to its new square", () => {
    const start = startTracking(newGame(twoPlayers));
    const before = idAt(start, 5, 2);

    const { tracked } = follow(newGame(twoPlayers), select(5, 2), target(4, 3));

    expect(idAt(tracked, 4, 3)).toBe(before);
    expect(idAt(tracked, 5, 2)).toBeUndefined();
    expect(tracked.pieces.find((piece) => piece.id === before)?.mover).toBe("person");
  });

  it("carries the person's moved piece until it lands, then puts it down", () => {
    const { tracked } = follow(newGame(twoPlayers), select(5, 2), target(4, 3));
    const id = idAt(tracked, 4, 3) ?? -1;

    expect(tracked.pieces.find((piece) => piece.id === id)?.carried).toBe(true);
    expect(landed(tracked, id).pieces.find((piece) => piece.id === id)?.carried).toBe(false);
  });

  it("keeps a captured piece, marked leaving, until the board says it has faded", () => {
    const start = gameOn(boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1]));
    const capturedId = idAt(startTracking(start), 4, 3);

    const { tracked } = follow(start, select(5, 2), target(3, 4));

    expect(tracked.pieces.find((piece) => piece.id === capturedId)).toMatchObject({ leaving: true, mover: "person" });
    expect(withoutPiece(tracked, capturedId ?? -1).pieces.some((piece) => piece.id === capturedId)).toBe(false);
  });

  it("keeps the ids when only the selection changes", () => {
    const start = startTracking(newGame(twoPlayers));

    const { tracked } = follow(newGame(twoPlayers), select(5, 2));

    // Fresh ids would start at 25, so the same ids show that nothing was redrawn.
    expect(tracked.pieces).toEqual(start.pieces);
  });

  it("gives new ids after Undo, so the board is redrawn at once with no slide (spec section 6.1.7, item 5)", () => {
    const { tracked } = follow(newGame(twoPlayers), select(5, 2), target(4, 3), { type: "undo" });
    const startIds = startTracking(newGame(twoPlayers)).pieces.map((piece) => piece.id);

    expect(tracked.pieces.map((piece) => piece.id).some((id) => startIds.includes(id))).toBe(false);
    expect(idAt(tracked, 5, 2)).toBeDefined();
  });

  it("follows the computer's move jump by jump, marking each taken piece at its own jump", () => {
    const board = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]);
    const thinking = gameReducer(gameReducer(gameOn(board, againstComputer), select(7, 0)), target(6, 1));
    const chain: Move = { from: at(0, 1), to: at(4, 5), captured: [at(1, 2), at(3, 4)], path: [at(2, 3), at(4, 5)] };
    const computerId = idAt(startTracking(thinking), 0, 1);

    const firstJump = follow(
      thinking,
      { type: "computerMoveReceived", requestId: 1, move: chain },
      {
        type: "computerStepShown",
      },
    );
    expect(idAt(firstJump.tracked, 2, 3)).toBe(computerId);
    expect(firstJump.tracked.pieces.filter((piece) => piece.leaving)).toHaveLength(1);
    expect(firstJump.tracked.pieces.find((piece) => piece.id === computerId)?.mover).toBe("computer");

    const secondJump = follow(
      thinking,
      { type: "computerMoveReceived", requestId: 1, move: chain },
      { type: "computerStepShown" },
      { type: "computerStepShown" },
    );
    expect(idAt(secondJump.tracked, 4, 5)).toBe(computerId);
    expect(secondJump.tracked.pieces.filter((piece) => piece.leaving)).toHaveLength(2);
  });

  it("carries a man's new crown with its id, marked crowning, until the board says the crown has appeared", () => {
    const start = gameOn(boardWith([1, 2, M1], [5, 6, M2]));
    const id = idAt(startTracking(start), 1, 2) ?? -1;

    const { tracked } = follow(start, select(1, 2), target(0, 1));
    const piece = tracked.pieces.find((each) => each.id === id);

    expect(piece).toMatchObject({ cell: CELL.player1King, crowning: true });
    expect(crowned(tracked, id).pieces.find((each) => each.id === id)?.crowning).toBe(false);
  });

  it("does not mark a king that moves as crowning", () => {
    const start = gameOn(boardWith([1, 2, CELL.player1King], [5, 6, M2]));

    const { tracked } = follow(start, select(1, 2), target(0, 1));

    expect(tracked.pieces.some((piece) => piece.crowning)).toBe(false);
  });

  it("with reduced motion, neither carries nor marks crowning, so nothing waits for an animation", () => {
    const start = gameOn(boardWith([1, 2, M1], [5, 6, M2]));

    const { tracked } = followWith(false, start, select(1, 2), target(0, 1));

    expect(tracked.pieces.some((piece) => piece.carried || piece.crowning)).toBe(false);
  });

  it("gives back the same tracking when a piece lands or is crowned with nothing to change, so the board does not draw again", () => {
    const tracked = startTracking(newGame(twoPlayers));
    const id = tracked.pieces[0].id;

    expect(landed(tracked, id)).toBe(tracked);
    expect(crowned(tracked, id)).toBe(tracked);
  });
});
