import { describe, expect, it } from "vitest";
import { type Board, type Player, CELL, STARTING_BOARD } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player1King: K1 } = CELL;

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "normal", firstPlayer: 1 };

// A game in progress on the given board, at the start of `toMove`'s turn.
function gameOn(board: Board, toMove: Player = 1, settings: Settings = twoPlayers): GameState {
  const game = newGame({ ...settings, firstPlayer: 1 });
  return { ...game, board, toMove, turnStart: { board, toMove, capturedBy: game.capturedBy } };
}

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });
const endTurn: Action = { type: "endTurn" };

describe("newGame", () => {
  it("starts on the starting board with the chosen first player, nothing selected (spec section 6.1.1, item 4)", () => {
    const game = newGame(twoPlayers);

    expect(game.board).toEqual(STARTING_BOARD);
    expect(game.toMove).toBe(1);
    expect(game.capturedBy).toEqual({ 1: 0, 2: 0 });
    expect(game.history).toEqual([]);
    expect(game.turnStart).toEqual({ board: STARTING_BOARD, toMove: 1, capturedBy: { 1: 0, 2: 0 } });
    expect(game.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });

  it("lets player 2 move first in a two-player game", () => {
    const game = newGame({ ...twoPlayers, firstPlayer: 2 });

    expect(game.toMove).toBe(2);
    expect(game.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });

  it("asks the computer for its move when the computer moves first", () => {
    const game = newGame({ ...againstComputer, firstPlayer: 2 });

    expect(game.toMove).toBe(2);
    expect(game.phase).toEqual({ kind: "computerThinking", requestId: 1 });
    expect(game.requestCount).toBe(1);
  });
});

// Plan section 7.2, test 10: select, select again, switch, and a square that is not a target (spec section 6.1.2).
describe("selecting a piece", () => {
  it("selects one of the player's own pieces", () => {
    const state = play(newGame(twoPlayers), select(5, 2));

    expect(state.phase).toEqual({ kind: "turn", selected: at(5, 2), chain: null });
  });

  it("puts the piece down when it is chosen again (item 7)", () => {
    const state = play(newGame(twoPlayers), select(5, 2), select(5, 2));

    expect(state.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });

  it("example 11: switches to another of the player's pieces (item 4)", () => {
    const state = play(newGame(twoPlayers), select(5, 2), select(5, 4));

    expect(state.phase).toEqual({ kind: "turn", selected: at(5, 4), chain: null });
  });

  it("selects a piece that has no targets (item 6)", () => {
    const state = play(newGame(twoPlayers), select(6, 1));

    expect(state.phase).toEqual({ kind: "turn", selected: at(6, 1), chain: null });
  });

  it("does not select the other player's piece, or an empty square, and clears the selection instead (items 1 and 5)", () => {
    expect(play(newGame(twoPlayers), select(5, 2), select(2, 1)).phase).toEqual({
      kind: "turn",
      selected: null,
      chain: null,
    });
    expect(play(newGame(twoPlayers), select(5, 2), select(4, 1)).phase).toEqual({
      kind: "turn",
      selected: null,
      chain: null,
    });
  });

  it("treats a square that is not a target as a plain click: no move, no error (spec section 4.1, item 13)", () => {
    const selected = play(newGame(twoPlayers), select(5, 2));

    const clearedByEmptySquare = play(selected, target(3, 2));
    const switchedByOwnPiece = play(selected, target(5, 4));

    expect(clearedByEmptySquare.board).toEqual(STARTING_BOARD);
    expect(clearedByEmptySquare.phase).toEqual({ kind: "turn", selected: null, chain: null });
    expect(switchedByOwnPiece.phase).toEqual({ kind: "turn", selected: at(5, 4), chain: null });
  });
});

describe("a normal move", () => {
  it("example 8: moves the man, and the turn passes to the other player", () => {
    const state = play(newGame(twoPlayers), select(5, 2), target(4, 3));

    expect(state.board[5][2]).toBe(CELL.empty);
    expect(state.board[4][3]).toBe(M1);
    expect(state.toMove).toBe(2);
    expect(state.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });

  it("keeps the start of each finished turn for Undo, and starts the next turn from the new board", () => {
    const first = play(newGame(twoPlayers), select(5, 2), target(4, 3));
    const second = play(first, select(2, 1), target(3, 0));

    expect(second.history).toEqual([
      { board: STARTING_BOARD, toMove: 1, capturedBy: { 1: 0, 2: 0 } },
      { board: first.board, toMove: 2, capturedBy: { 1: 0, 2: 0 } },
    ]);
    expect(second.turnStart).toEqual({ board: second.board, toMove: 1, capturedBy: { 1: 0, 2: 0 } });
  });

  it("gives each request for the computer's move the next id, so a late answer to an older one can be ignored", () => {
    const afterThreeRequests = { ...newGame(againstComputer), requestCount: 3 };

    const state = play(afterThreeRequests, select(5, 2), target(4, 3));

    expect(state.phase).toEqual({ kind: "computerThinking", requestId: 4 });
    expect(state.requestCount).toBe(4);
  });

  it("asks the computer for its move after the person's turn in a computer game", () => {
    const state = play(newGame(againstComputer), select(5, 2), target(4, 3));

    expect(state.toMove).toBe(2);
    expect(state.phase).toEqual({ kind: "computerThinking", requestId: 1 });
  });
});

// Plan section 7.2, test 5: chains (spec section 6.1.3, and section 6.2.1, examples 9 and 10).
describe("a chain", () => {
  const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]);
  const afterFirstJump = play(gameOn(board), select(6, 1), target(4, 3));

  it("example 9: after a jump, the man stays selected and its next jump is the target", () => {
    expect(afterFirstJump.phase).toEqual({
      kind: "turn",
      selected: at(4, 3),
      chain: { start: at(6, 1), captured: [at(5, 2)] },
    });
    expect(afterFirstJump.toMove).toBe(1);
  });

  it("removes the captured piece at its own jump, and counts it (plan section 3.5, decision 13)", () => {
    expect(afterFirstJump.board).toEqual(boardWith([4, 3, M1], [3, 4, M2]));
    expect(afterFirstJump.capturedBy).toEqual({ 1: 1, 2: 0 });
  });

  it("ignores another piece, the same piece and other squares during a chain (spec section 6.1.2, items 5 and 7)", () => {
    const withAnotherMan = play(
      gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1])),
      select(6, 1),
      target(4, 3),
    );

    expect(play(withAnotherMan, select(7, 6))).toEqual(withAnotherMan);
    expect(play(afterFirstJump, select(4, 3))).toEqual(afterFirstJump);
    expect(play(afterFirstJump, select(5, 4))).toEqual(afterFirstJump);
    expect(play(afterFirstJump, target(3, 2))).toEqual(afterFirstJump);
  });

  it("example 10: End turn stops the chain. The man stays on (4,3), and (3,4) is not taken", () => {
    const state = play(afterFirstJump, endTurn);

    expect(state.toMove).toBe(2);
    expect(state.phase).toEqual({ kind: "turn", selected: null, chain: null });
    expect(state.board).toEqual(boardWith([4, 3, M1], [3, 4, M2]));
  });

  it("ends the turn by itself when no further jump is possible (item 4)", () => {
    const state = play(afterFirstJump, target(2, 5));

    expect(state.board).toEqual(boardWith([2, 5, M1]));
    expect(state.capturedBy).toEqual({ 1: 2, 2: 0 });
    expect(state.toMove).toBe(2);
  });

  it("ignores End turn when no chain is under way", () => {
    const selected = play(newGame(twoPlayers), select(5, 2));

    expect(play(selected, endTurn)).toEqual(selected);
  });
});

// Plan section 7.2, test 6, in the reducer: promotion ends the turn (spec section 6.1.3, item 5).
describe("promotion", () => {
  it("example 12: a man that jumps to the far row becomes a king, and the turn ends", () => {
    const state = play(gameOn(boardWith([2, 3, M1], [1, 2, M2], [5, 6, M2])), select(2, 3), target(0, 1));

    expect(state.board[0][1]).toBe(K1);
    expect(state.toMove).toBe(2);
  });

  it("ends the turn even when the new king could jump again", () => {
    // After (2,1) jumps to (0,3), a king could jump (1,4) to (2,5).
    const state = play(gameOn(boardWith([2, 1, M1], [1, 2, M2], [1, 4, M2])), select(2, 1), target(0, 3));

    expect(state.board).toEqual(boardWith([0, 3, K1], [1, 4, M2]));
    expect(state.toMove).toBe(2);
    expect(state.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });
});

// Spec section 6.1.6, items 1 and 2: the end of the game is checked after every turn.
describe("the end of the game", () => {
  it("example 13: the move that leaves player 2 with no legal move ends the game, and player 1 wins", () => {
    const board = boardWith([3, 2, M2], [4, 1, M1], [5, 0, M1], [5, 2, M1], [5, 4, M1]);

    const state = play(gameOn(board, 1, againstComputer), select(5, 2), target(4, 3));

    expect(state.phase).toEqual({ kind: "over", result: { winner: 1, reason: "noMoves" } });
    expect(state.requestCount).toBe(0);
  });

  it("taking the last piece ends the game with the reason 'no pieces'", () => {
    const state = play(gameOn(boardWith([5, 2, M1], [4, 3, M2])), select(5, 2), target(3, 4));

    expect(state.phase).toEqual({ kind: "over", result: { winner: 1, reason: "noPieces" } });
  });

  it("allows no further moves once the game is over", () => {
    const over = play(gameOn(boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1])), select(5, 2), target(3, 4));

    expect(play(over, select(7, 0), target(6, 1), endTurn)).toEqual(over);
  });
});

// Plan section 7.2, test 16: the reducer never changes its input (spec section 4.1, item 3).
describe("purity", () => {
  function deepFreeze<T>(value: T): T {
    if (value !== null && typeof value === "object") {
      Object.values(value).forEach(deepFreeze);
      Object.freeze(value);
    }
    return value;
  }

  it("never changes the state it is given, through a whole sequence of moves, a chain and End turn", () => {
    const actions: Action[] = [select(6, 1), target(4, 3), select(7, 6), endTurn, select(2, 1), target(3, 0)];
    let state = deepFreeze(gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1], [2, 1, M2])));

    for (const action of actions) {
      const before = structuredClone(state);
      const next = gameReducer(state, action);

      expect(state).toEqual(before);
      state = deepFreeze(next);
    }

    expect(state.toMove).toBe(1);
  });
});
