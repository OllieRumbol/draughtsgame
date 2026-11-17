import { describe, expect, it } from "vitest";
import {
  CELL,
  STARTING_BOARD,
  farRow,
  isDarkSquare,
  isKing,
  isOnBoard,
  ownerOf,
  samePosition,
  type Cell,
} from "@/game/board";

// Plan section 7.2, test 1: the starting board and the square helpers (spec section 2.3).
describe("the starting board", () => {
  it("is the board in spec section 2.3", () => {
    expect(STARTING_BOARD).toEqual([
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
      [5, 0, 5, 0, 5, 0, 5, 0],
      [0, 5, 0, 5, 0, 5, 0, 5],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
    ]);
  });

  it("has 12 men for each player, all on dark squares, with player 2 on rows 0 to 2 and player 1 on rows 5 to 7", () => {
    const pieces: { row: number; col: number; cell: Cell }[] = [];
    STARTING_BOARD.forEach((cells, row) => cells.forEach((cell, col) => pieces.push({ row, col, cell })));

    const player1 = pieces.filter((piece) => piece.cell === CELL.player1Man);
    const player2 = pieces.filter((piece) => piece.cell === CELL.player2Man);

    expect(player1).toHaveLength(12);
    expect(player2).toHaveLength(12);
    expect(pieces.filter((piece) => piece.cell !== CELL.light).every((piece) => isDarkSquare(piece))).toBe(true);
    expect(player1.every((piece) => piece.row >= 5)).toBe(true);
    expect(player2.every((piece) => piece.row <= 2)).toBe(true);
  });
});

describe("the square helpers", () => {
  it("knows which squares are on the board: rows and columns 0 to 7", () => {
    expect(isOnBoard({ row: 0, col: 0 })).toBe(true);
    expect(isOnBoard({ row: 7, col: 7 })).toBe(true);
    expect(isOnBoard({ row: -1, col: 0 })).toBe(false);
    expect(isOnBoard({ row: 0, col: 8 })).toBe(false);
  });

  it("knows the dark squares: odd columns on even rows, and even columns on odd rows", () => {
    expect(isDarkSquare({ row: 0, col: 1 })).toBe(true);
    expect(isDarkSquare({ row: 7, col: 0 })).toBe(true);
    expect(isDarkSquare({ row: 0, col: 0 })).toBe(false);
    expect(isDarkSquare({ row: 7, col: 1 })).toBe(false);
    expect(isDarkSquare({ row: 8, col: 1 })).toBe(false);
  });

  it("knows each piece's owner and whether it is a king", () => {
    expect([CELL.player1Man, CELL.player1King].map(ownerOf)).toEqual([1, 1]);
    expect([CELL.player2Man, CELL.player2King].map(ownerOf)).toEqual([2, 2]);
    expect([CELL.light, CELL.empty].map(ownerOf)).toEqual([null, null]);
    expect([CELL.player1King, CELL.player2King].every(isKing)).toBe(true);
    expect([CELL.player1Man, CELL.player2Man, CELL.empty].some(isKing)).toBe(false);
  });

  it("knows each player's far row: player 1 moves up to row 0, and player 2 moves down to row 7", () => {
    expect(farRow(1)).toBe(0);
    expect(farRow(2)).toBe(7);
  });

  it("compares squares by row and column", () => {
    expect(samePosition({ row: 2, col: 3 }, { row: 2, col: 3 })).toBe(true);
    expect(samePosition({ row: 2, col: 3 }, { row: 3, col: 2 })).toBe(false);
  });
});
