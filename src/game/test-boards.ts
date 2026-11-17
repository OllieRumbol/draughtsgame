// Helpers for the rules tests. The worked examples in spec section 6.2.1 say "every other dark square empty".
import { type Board, type Cell, type Move, type Position, BOARD_SIZE, CELL, isDarkSquare } from "./board";

export type Piece = [row: number, col: number, cell: Cell];

// A board with only the given pieces. Every other dark square is empty, and every light square is light.
export function boardWith(...pieces: Piece[]): Board {
  const board: Cell[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const cells: Cell[] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      cells.push(isDarkSquare({ row, col }) ? CELL.empty : CELL.light);
    }
    board.push(cells);
  }

  for (const [row, col, cell] of pieces) {
    if (!isDarkSquare({ row, col })) {
      throw new Error(`(${row},${col}) is a light square. Pieces stand on dark squares only.`);
    }
    board[row][col] = cell;
  }

  return board;
}

export function at(row: number, col: number): Position {
  return { row, col };
}

// A move as "(from)->(to) x (captured, sorted)", so a list of moves can be compared as a set,
// with the start, the end and the captured set, as plan section 7.2, test 2 says.
export function describeMove(move: Move): string {
  const square = (position: Position) => `(${position.row},${position.col})`;
  const captured = move.captured.map(square).sort().join(" ");
  return `${square(move.from)}->${square(move.to)} x ${captured || "none"}`;
}

export function describeMoves(moves: Move[]): string[] {
  return moves.map(describeMove).sort();
}
