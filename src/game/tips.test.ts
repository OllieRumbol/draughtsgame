import { describe, expect, it } from "vitest";
import { type Board, type Player, CELL, STARTING_BOARD, cellAt } from "@/game/board";
import { legalMoves } from "@/game/rules";
import { boardWith } from "@/game/test-boards";

const { player1Man: M1, player2King: K2 } = CELL;

// The tips the API would give (spec section 5.2), worked out from the web app's own rules: every square that a
// piece of the player can finish a turn on, each once, and never a square where a piece stands.
function tipsFromRules(board: Board, player: Player): string[] {
  const squares = new Set<string>();
  for (const move of legalMoves(board, player)) {
    if (cellAt(board, move.to) === CELL.empty) {
      squares.add(`(${move.to.row},${move.to.col})`);
    }
  }
  return [...squares].sort();
}

// Plan section 7.2, test 3: the web app's rules and the API agree on the tips (risk 2).
describe("tips from the web app's rules match the API's tips", () => {
  it("example 7: the board in example 5 gives the API's 5 squares, and not the king's own square (1,2)", () => {
    const board = boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]);

    expect(tipsFromRules(board, 2)).toEqual(["(0,1)", "(0,3)", "(3,0)", "(3,4)", "(5,2)"]);
  });

  it("spec section 5.2: the starting board gives the API's 4 squares for player 1", () => {
    expect(tipsFromRules(STARTING_BOARD, 1)).toEqual(["(4,1)", "(4,3)", "(4,5)", "(4,7)"]);
  });
});
