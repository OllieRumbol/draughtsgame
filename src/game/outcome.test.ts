import { describe, expect, it } from "vitest";
import { CELL, STARTING_BOARD } from "@/game/board";
import { applyMove, outcome } from "@/game/rules";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player1King: K1 } = CELL;

// Plan section 7.2, test 8: the end of the game (spec section 2.1, item 7, and section 6.3).
describe("outcome", () => {
  it("is still playing when the player to move has a legal move", () => {
    expect(outcome(STARTING_BOARD, 1)).toEqual({ kind: "playing" });
    expect(outcome(STARTING_BOARD, 2)).toEqual({ kind: "playing" });
  });

  it("example 13: player 1's move leaves player 2 with no legal move, so player 1 wins", () => {
    const before = boardWith([3, 2, M2], [4, 1, M1], [5, 0, M1], [5, 2, M1], [5, 4, M1]);
    const after = applyMove(before, { from: at(5, 2), to: at(4, 3), captured: [], path: [at(4, 3)] });

    expect(outcome(before, 2)).toEqual({ kind: "playing" });
    expect(outcome(after, 2)).toEqual({ kind: "win", winner: 1, reason: "noMoves" });
  });

  it("example 14: player 2 cannot move, so player 1 wins, although player 1 could not move either", () => {
    const board = boardWith(
      [0, 1, M2],
      [0, 3, M2],
      [0, 5, M2],
      [0, 7, M2],
      [1, 0, M1],
      [1, 2, M1],
      [1, 4, M1],
      [1, 6, M1],
      [2, 1, M1],
      [2, 3, M1],
      [2, 5, M1],
      [2, 7, M1],
    );

    expect(outcome(board, 2)).toEqual({ kind: "win", winner: 1, reason: "noMoves" });
  });

  it("checks only the player who moves next", () => {
    // Player 1's man on (5,0) is blocked: (4,1) is taken, and the jump to (3,2) is taken too.
    // Player 2 can still move, for example (3,2) to (4,3).
    const board = boardWith([5, 0, M1], [4, 1, M2], [3, 2, M2]);

    expect(outcome(board, 1)).toEqual({ kind: "win", winner: 2, reason: "noMoves" });
    expect(outcome(board, 2)).toEqual({ kind: "playing" });
  });

  it("gives the reason 'no pieces' when the player to move has none left", () => {
    expect(outcome(boardWith([4, 3, K1]), 2)).toEqual({ kind: "win", winner: 1, reason: "noPieces" });
    expect(outcome(boardWith([4, 3, M2]), 1)).toEqual({ kind: "win", winner: 2, reason: "noPieces" });
  });

  it("has no tie: when neither player can move, the player to move loses", () => {
    // Player 2's man on its far row has no forward move, and player 1's men are blocked by each other.
    const board = boardWith([7, 0, M2], [1, 0, M1], [0, 1, M1]);
    // (1,0) cannot move to (0,1), which is taken; (0,1) is on player 1's far row and cannot move.

    expect(outcome(board, 1)).toEqual({ kind: "win", winner: 2, reason: "noMoves" });
    expect(outcome(board, 2)).toEqual({ kind: "win", winner: 1, reason: "noMoves" });
  });
});
