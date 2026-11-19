import { describe, expect, it } from "vitest";
import { type Board, type Move, type Player, type Position, CELL, STARTING_BOARD } from "@/game/board";
import { type Action, type GameState, type Settings, canUndo, gameReducer, newGame } from "@/game/game-state";
import { findPath } from "@/game/path";
import { nextSteps } from "@/game/rules";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player1King: K1, player2King: K2 } = CELL;

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "normal", firstPlayer: 1 };

// A game in progress on the given board, at the start of a person's turn. In a computer game the person is
// always player 1, so a turn for player 2 there is a state real play never reaches.
function gameOn(board: Board, toMove: Player = 1, settings: Settings = twoPlayers): GameState {
  if (settings.opponent === "computer" && toMove === 2) {
    throw new Error("In a computer game, player 2 is the computer, so it never has a person's turn.");
  }
  const game = newGame({ ...settings, firstPlayer: 1 });
  return { ...game, board, toMove, turnStart: { board, toMove, capturedBy: game.capturedBy } };
}

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });
const endTurn: Action = { type: "endTurn" };
const undo: Action = { type: "undo" };
const giveUp: Action = { type: "giveUp" };
const stepShown: Action = { type: "computerStepShown" };
const retry: Action = { type: "retry" };
const answer = (requestId: number, move: Move): Action => ({ type: "computerMoveReceived", requestId, move });
const failure = (requestId: number): Action => ({ type: "computerMoveFailed", requestId });

// A normal move, as useComputerTurn passes it to the reducer.
function simpleMove(fromRow: number, fromCol: number, toRow: number, toCol: number): Move {
  return { from: at(fromRow, fromCol), to: at(toRow, toCol), captured: [], path: [at(toRow, toCol)] };
}

// The computer's move with its jump order, as useComputerTurn gets it from findPath.
function computerMove(board: Board, from: Position, to: Position, takes: Position[]): Move {
  const move = findPath(board, 2, from, to, takes);
  if (!move) {
    throw new Error("The test board has no such move for the computer.");
  }
  return move;
}

// The computer answers the request it is waiting for, and every jump of its move is shown.
function computerPlays(state: GameState, move: Move): GameState {
  if (state.phase.kind !== "computerThinking") {
    throw new Error("The computer is not thinking.");
  }
  const moving = gameReducer(state, answer(state.phase.requestId, move));
  return move.path.reduce((shown) => gameReducer(shown, stepShown), moving);
}

describe("newGame", () => {
  it("starts on the starting board with the chosen first player, nothing selected (spec section 6.1.1, item 4)", () => {
    const game = newGame(twoPlayers);

    expect(game.board).toEqual(STARTING_BOARD);
    expect(game.toMove).toBe(1);
    expect(game.capturedBy).toEqual({ 1: 0, 2: 0 });
    expect(game.history).toEqual([]);
    expect(game.turnStart).toEqual({ board: STARTING_BOARD, toMove: 1, capturedBy: { 1: 0, 2: 0 } });
    expect(game.phase).toEqual({ kind: "turn", selected: null, chain: null });
    expect(game.lastComputerMove).toBeNull();
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
    // (2,5) is the only target: the selected piece's next steps during the chain.
    if (afterFirstJump.phase.kind !== "turn" || !afterFirstJump.phase.chain) {
      throw new Error("Expected a chain under way.");
    }
    expect(nextSteps(afterFirstJump.board, at(4, 3), afterFirstJump.phase.chain)).toEqual([
      { to: at(2, 5), captured: at(3, 4) },
    ]);
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

// A computer game where the person has just moved (7,0) to (6,1), and the computer can take two men in a chain,
// as in spec section 6.2.2, example 15.
const chainBoard = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]);
const beforeChain = play(gameOn(chainBoard, 1, againstComputer), select(7, 0), target(6, 1));
const computersChain = computerMove(beforeChain.board, at(0, 1), at(4, 5), [at(1, 2), at(3, 4)]);

// Spec section 6.1.5, items 4 to 9: the computer's move is shown one jump at a time.
describe("the computer's move", () => {
  const moving = play(beforeChain, answer(1, computersChain));
  const oneJumpShown = play(moving, stepShown);

  it("starts to be shown when the answer arrives. The board does not change yet", () => {
    expect(moving.phase).toEqual({ kind: "computerMoving", move: computersChain, step: 0 });
    expect(moving.board).toEqual(beforeChain.board);
  });

  it("example 15: removes each captured piece at its own jump (item 4)", () => {
    expect(oneJumpShown.board).toEqual(boardWith([2, 3, M2], [3, 4, M1], [6, 1, M1]));
    expect(oneJumpShown.capturedBy).toEqual({ 1: 0, 2: 1 });
    expect(oneJumpShown.toMove).toBe(2);
    expect(oneJumpShown.phase).toEqual({ kind: "computerMoving", move: computersChain, step: 1 });
  });

  it("passes the turn to the person when the last jump has been shown, and marks the move (items 7 and 9)", () => {
    const shown = play(oneJumpShown, stepShown);

    expect(shown.board).toEqual(boardWith([4, 5, M2], [6, 1, M1]));
    expect(shown.capturedBy).toEqual({ 1: 0, 2: 2 });
    expect(shown.toMove).toBe(1);
    expect(shown.phase).toEqual({ kind: "turn", selected: null, chain: null });
    expect(shown.lastComputerMove).toEqual({ from: at(0, 1), to: at(4, 5) });
    expect(shown.history.at(-1)).toEqual(beforeChain.turnStart);
  });

  it("makes a man that reaches the far row a king (item 6)", () => {
    const personMoved = play(gameOn(boardWith([6, 3, M2], [5, 0, M1]), 1, againstComputer), select(5, 0), target(4, 1));

    const shown = computerPlays(personMoved, simpleMove(6, 3, 7, 2));

    expect(shown.board[7][2]).toBe(K2);
  });

  it("ignores a step that arrives when no move is being shown", () => {
    expect(play(beforeChain, stepShown)).toEqual(beforeChain);
    expect(play(newGame(twoPlayers), stepShown)).toEqual(newGame(twoPlayers));
  });
});

// Spec section 6.1.5, item 9: the mark on the computer's last move.
describe("the mark on the computer's last move", () => {
  const personMoved = play(newGame(againstComputer), select(5, 2), target(4, 3));
  const replied = computerPlays(personMoved, simpleMove(2, 1, 3, 0));

  it("stays while the person selects a piece, and goes when the person moves", () => {
    const selected = play(replied, select(5, 4));
    const moved = play(selected, target(4, 5));

    expect(selected.lastComputerMove).toEqual({ from: at(2, 1), to: at(3, 0) });
    expect(moved.lastComputerMove).toBeNull();
  });

  it("goes with the person's first jump of a chain", () => {
    const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1], [0, 7, M2]), 1, againstComputer);
    const personMoved = play(start, select(7, 6), target(6, 7));
    const marked = computerPlays(personMoved, simpleMove(0, 7, 1, 6));

    const afterFirstJump = play(marked, select(6, 1), target(4, 3));

    expect(marked.lastComputerMove).toEqual({ from: at(0, 7), to: at(1, 6) });
    expect(afterFirstJump.phase).toEqual({
      kind: "turn",
      selected: at(4, 3),
      chain: { start: at(6, 1), captured: [at(5, 2)] },
    });
    expect(afterFirstJump.lastComputerMove).toBeNull();
  });

  it("is never set in a two-player game", () => {
    const state = play(newGame(twoPlayers), select(5, 2), target(4, 3), select(2, 1), target(3, 0));

    expect(state.lastComputerMove).toBeNull();
  });
});

// Plan section 7.2, test 11: Undo (spec section 6.1.7, and section 6.2.3, examples 19, 21 and 22).
describe("Undo", () => {
  it("example 19: in a computer game, removes the computer's reply and the person's turn together", () => {
    const personMoved = play(newGame(againstComputer), select(5, 2), target(4, 3));
    const replied = computerPlays(personMoved, simpleMove(2, 1, 3, 0));

    const undone = play(replied, undo);

    expect(undone).toEqual({ ...newGame(againstComputer), requestCount: 1 });
  });

  it("example 21: in a two-player game, removes the last turn only", () => {
    const afterPlayer1 = play(newGame(twoPlayers), select(5, 2), target(4, 3));
    const afterPlayer2 = play(afterPlayer1, select(2, 1), target(3, 0));

    expect(play(afterPlayer2, undo)).toEqual(afterPlayer1);
  });

  it("can be repeated back to the start of the game, and then does nothing (item 2)", () => {
    const afterTwoTurns = play(newGame(twoPlayers), select(5, 2), target(4, 3), select(2, 1), target(3, 0));

    expect(play(afterTwoTurns, undo, undo)).toEqual(newGame(twoPlayers));
    expect(play(afterTwoTurns, undo, undo, undo)).toEqual(newGame(twoPlayers));
  });

  it("example 22: during a chain, returns to the start of the turn, with the captured count put back", () => {
    const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]));
    const afterFirstJump = play(start, select(6, 1), target(4, 3));

    expect(play(afterFirstJump, undo)).toEqual(start);
  });

  it("during a chain on a later turn, keeps the earlier turns", () => {
    const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1], [0, 7, M2]));
    const afterTwoTurns = play(start, select(7, 6), target(6, 7), select(0, 7), target(1, 6));
    const afterFirstJump = play(afterTwoTurns, select(6, 1), target(4, 3));

    expect(play(afterFirstJump, undo)).toEqual(afterTwoTurns);
  });

  it("in a game the computer started, goes back to the person's first turn, and does not ask the computer again", () => {
    const computerFirst = computerPlays(newGame({ ...againstComputer, firstPlayer: 2 }), simpleMove(2, 1, 3, 0));
    const personMoved = play(computerFirst, select(5, 2), target(4, 3));
    const replied = computerPlays(personMoved, simpleMove(2, 3, 3, 2));

    const undone = play(replied, undo);

    expect(undone).toEqual({ ...computerFirst, requestCount: 2, lastComputerMove: null });
    expect(undone.phase).toEqual({ kind: "turn", selected: null, chain: null });
  });
});

// Plan section 7.2, test 12: when Undo is available (spec section 6.1.7, items 4 and 6).
describe("canUndo", () => {
  const personMoved = play(newGame(againstComputer), select(5, 2), target(4, 3));

  it("is false when there is nothing to undo, and true in a two-player game once there is", () => {
    expect(canUndo(newGame(twoPlayers))).toBe(false);
    expect(canUndo(play(newGame(twoPlayers), select(5, 2)))).toBe(false);
    expect(canUndo(play(newGame(twoPlayers), select(5, 2), target(4, 3)))).toBe(true);
  });

  it("is true during a chain, even on the first turn", () => {
    const afterFirstJump = play(gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2])), select(6, 1), target(4, 3));

    expect(canUndo(afterFirstJump)).toBe(true);
  });

  it("example 20: is false while the computer is thinking or showing its move, and Undo does nothing then", () => {
    const moving = play(personMoved, answer(1, simpleMove(2, 1, 3, 0)));

    expect(canUndo(personMoved)).toBe(false);
    expect(play(personMoved, undo)).toEqual(personMoved);
    expect(canUndo(moving)).toBe(false);
    expect(play(moving, undo)).toEqual(moving);
    expect(canUndo(play(moving, stepShown))).toBe(true);
  });

  it("is false while a chain of the computer's is part-way shown", () => {
    const oneJumpShown = play(beforeChain, answer(1, computersChain), stepShown);

    expect(canUndo(oneJumpShown)).toBe(false);
  });

  it("example 24: is true after the computer's move fails, and Undo removes the person's move", () => {
    const failed = play(personMoved, failure(1));

    expect(failed.phase).toEqual({ kind: "computerFailed", requestId: 1 });
    expect(failed.board).toEqual(personMoved.board);
    expect(canUndo(failed)).toBe(true);
    expect(play(failed, undo)).toEqual({ ...newGame(againstComputer), requestCount: 1 });
  });

  it("in a game the computer started, is false until the person's first turn ends and the computer replies", () => {
    const computerFirst = computerPlays(newGame({ ...againstComputer, firstPlayer: 2 }), simpleMove(2, 1, 3, 0));
    const secondRequest = play(computerFirst, select(5, 2), target(4, 3));

    expect(canUndo(computerFirst)).toBe(false);
    expect(play(computerFirst, undo)).toEqual(computerFirst);
    expect(canUndo(secondRequest)).toBe(false);
    expect(canUndo(computerPlays(secondRequest, simpleMove(2, 3, 3, 2)))).toBe(true);
  });
});

// Plan section 7.2, test 13: Undo at the end of the game (spec section 6.1.7, item 7).
describe("Undo at the end of the game", () => {
  it("after a win in a two-player game, continues the game from the start of the last turn", () => {
    const start = gameOn(boardWith([5, 2, M1], [4, 3, M2]));
    const over = play(start, select(5, 2), target(3, 4));

    expect(canUndo(over)).toBe(true);
    expect(play(over, undo)).toEqual(start);
    expect(play(over, undo, select(5, 2), target(4, 1)).toMove).toBe(2);
  });

  it("example 13: after the person wins a computer game, gives the person their turn again", () => {
    const start = gameOn(boardWith([3, 2, M2], [4, 1, M1], [5, 0, M1], [5, 2, M1], [5, 4, M1]), 1, againstComputer);
    const over = play(start, select(5, 2), target(4, 3));

    expect(over.phase.kind).toBe("over");
    expect(play(over, undo)).toEqual(start);
  });

  it("after the computer wins, removes the computer's winning move and the person's turn", () => {
    const start = gameOn(boardWith([4, 3, M1], [2, 3, M2]), 1, againstComputer);
    const personMoved = play(start, select(4, 3), target(3, 2));
    const over = computerPlays(personMoved, computerMove(personMoved.board, at(2, 3), at(4, 1), [at(3, 2)]));

    expect(over.phase).toEqual({ kind: "over", result: { winner: 2, reason: "noPieces" } });
    expect(over.lastComputerMove).toEqual({ from: at(2, 3), to: at(4, 1) });
    expect(play(over, undo)).toEqual({ ...start, requestCount: 1 });
  });

  it("is not offered after a player gives up", () => {
    const gaveUp = play(newGame(twoPlayers), select(5, 2), target(4, 3), giveUp);

    expect(canUndo(gaveUp)).toBe(false);
    expect(play(gaveUp, undo)).toEqual(gaveUp);
  });
});

// Plan section 7.2, test 14: Give up (spec section 6.1.6, item 4).
describe("Give up", () => {
  it("in a two-player game, the player whose turn it is gives up, and the other player wins", () => {
    const afterPlayer1 = play(newGame(twoPlayers), select(5, 2), target(4, 3));

    const player2GaveUp = play(afterPlayer1, giveUp);

    expect(player2GaveUp.phase).toEqual({ kind: "over", result: { winner: 1, reason: "gaveUp" } });
    expect(player2GaveUp.board).toEqual(afterPlayer1.board);
    expect(play(newGame(twoPlayers), giveUp).phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
  });

  it("during a player's own chain, keeps the board as it is, because the final board stays on view (item 2)", () => {
    const afterFirstJump = play(gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2])), select(6, 1), target(4, 3));

    const gaveUp = play(afterFirstJump, giveUp);

    expect(gaveUp.phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
    expect(gaveUp.board).toEqual(afterFirstJump.board);
    expect(gaveUp.capturedBy).toEqual({ 1: 1, 2: 0 });
  });

  it("in a computer game, on the person's turn, the computer wins", () => {
    expect(play(newGame(againstComputer), giveUp).phase).toEqual({
      kind: "over",
      result: { winner: 2, reason: "gaveUp" },
    });
  });

  it("while the computer is thinking, cancels its move, and the computer wins", () => {
    const gaveUp = play(beforeChain, giveUp);

    expect(gaveUp.phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
    expect(gaveUp.board).toEqual(beforeChain.board);
  });

  it("while the computer's move is being shown, keeps the board from before the computer's move", () => {
    const oneJumpShown = play(beforeChain, answer(1, computersChain), stepShown);

    const gaveUp = play(oneJumpShown, giveUp);

    expect(oneJumpShown.board).not.toEqual(beforeChain.board);
    expect(gaveUp.phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
    expect(gaveUp.board).toEqual(beforeChain.board);
    expect(gaveUp.capturedBy).toEqual({ 1: 0, 2: 0 });
  });

  it("after the computer's move fails, the computer wins", () => {
    const gaveUp = play(beforeChain, failure(1), giveUp);

    expect(gaveUp.phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
    expect(gaveUp.board).toEqual(beforeChain.board);
  });

  it("does nothing once the game is over", () => {
    const won = play(gameOn(boardWith([5, 2, M1], [4, 3, M2])), select(5, 2), target(3, 4));
    const gaveUp = play(newGame(twoPlayers), giveUp);

    expect(play(won, giveUp)).toEqual(won);
    expect(play(gaveUp, giveUp)).toEqual(gaveUp);
  });
});

// Plan section 7.2, test 15: a late answer is ignored (spec section 6.6, item 5), and Try again (section 6.1.9).
describe("answers from the computer", () => {
  const failed = play(beforeChain, failure(1));
  const retried = play(failed, retry);

  it("Try again sends the request again, with the next id", () => {
    expect(retried.phase).toEqual({ kind: "computerThinking", requestId: 2 });
    expect(retried.requestCount).toBe(2);
    expect(retried.board).toEqual(beforeChain.board);
  });

  it("ignores Try again when no move has failed", () => {
    expect(play(beforeChain, retry)).toEqual(beforeChain);
  });

  it("ignores an answer or a failure for an older request", () => {
    expect(play(retried, answer(1, computersChain))).toEqual(retried);
    expect(play(retried, failure(1))).toEqual(retried);
    expect(play(retried, answer(2, computersChain)).phase.kind).toBe("computerMoving");
  });

  it("ignores an answer that arrives after Give up or Undo", () => {
    const gaveUp = play(beforeChain, giveUp);
    const undone = play(failed, undo);

    expect(play(gaveUp, answer(1, computersChain))).toEqual(gaveUp);
    expect(play(undone, answer(1, computersChain))).toEqual(undone);
    expect(play(undone, failure(1))).toEqual(undone);
  });

  it("ignores a second answer to the same request", () => {
    const moving = play(beforeChain, answer(1, computersChain));

    expect(play(moving, answer(1, simpleMove(0, 1, 1, 0)))).toEqual(moving);
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

  // Runs each action on a deep-frozen state, and checks that the state it was given is unchanged.
  function playFrozen(start: GameState, actions: Action[]): GameState {
    let state = deepFreeze(start);
    for (const action of actions) {
      const before = structuredClone(state);
      const next = gameReducer(state, action);

      expect(state).toEqual(before);
      state = deepFreeze(next);
    }
    return state;
  }

  it("never changes the state it is given, through a whole sequence of moves, a chain and End turn", () => {
    const actions: Action[] = [select(6, 1), target(4, 3), select(7, 6), endTurn, select(2, 1), target(3, 0)];

    const state = playFrozen(gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1], [2, 1, M2])), actions);

    expect(state.toMove).toBe(1);
  });

  it("never changes the state it is given, through the computer's turn, Try again, Undo and Give up", () => {
    const actions: Action[] = [
      select(7, 0),
      target(6, 1),
      failure(1),
      retry,
      answer(2, computersChain),
      stepShown,
      stepShown,
      undo,
      select(7, 0),
      target(6, 1),
      answer(3, computersChain),
      stepShown,
      giveUp,
    ];

    const state = playFrozen(gameOn(chainBoard, 1, againstComputer), actions);

    expect(state.phase).toEqual({ kind: "over", result: { winner: 2, reason: "gaveUp" } });
  });
});
