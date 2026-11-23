import { describe, expect, it } from "vitest";
import { CELL } from "@/game/board";
import { squareName } from "@/components/board/square-name";
import { at } from "@/game/test-boards";

const plain = { isTarget: false, isSelected: false };

// Spec section 6.4.3, item 2: row and column from 1 at the top left, then what stands on the square.
describe("squareName", () => {
  it("gives the spec's example: square (7,0) with the person's man is 'Row 8, column 1, your man'", () => {
    expect(squareName({ position: at(7, 0), cell: CELL.player1Man, opponent: "computer", ...plain })).toBe(
      "Row 8, column 1, your man",
    );
  });

  it("names the computer's pieces, and a king, in a computer game", () => {
    expect(squareName({ position: at(0, 1), cell: CELL.player2King, opponent: "computer", ...plain })).toBe(
      "Row 1, column 2, the computer's king",
    );
  });

  it("names the players' pieces in a two-player game (spec section 6.1.11, item 2)", () => {
    expect(squareName({ position: at(0, 1), cell: CELL.player2Man, opponent: "twoPlayers", ...plain })).toBe(
      "Row 1, column 2, player 2's man",
    );
    expect(squareName({ position: at(5, 0), cell: CELL.player1King, opponent: "twoPlayers", ...plain })).toBe(
      "Row 6, column 1, player 1's king",
    );
  });

  it("names an empty square and a light square", () => {
    expect(squareName({ position: at(3, 0), cell: CELL.empty, opponent: "twoPlayers", ...plain })).toBe(
      "Row 4, column 1, empty",
    );
    expect(squareName({ position: at(7, 1), cell: CELL.light, opponent: "twoPlayers", ...plain })).toBe(
      "Row 8, column 2, light square",
    );
  });

  it("adds 'target' and 'selected'", () => {
    expect(
      squareName({ position: at(4, 1), cell: CELL.empty, opponent: "twoPlayers", isTarget: true, isSelected: false }),
    ).toBe("Row 5, column 2, empty, target");
    expect(
      squareName({
        position: at(5, 2),
        cell: CELL.player1Man,
        opponent: "twoPlayers",
        isTarget: false,
        isSelected: true,
      }),
    ).toBe("Row 6, column 3, player 1's man, selected");
  });
});
