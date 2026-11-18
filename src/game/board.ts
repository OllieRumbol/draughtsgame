// The board, the pieces and the squares (spec section 2.3, plan section 3.3.1).
// Plain TypeScript: nothing in src/game/ imports React.

// The API's encoding (spec section 2.3). The web app never uses 6.
export type Cell = 0 | 1 | 2 | 3 | 4 | 5;
export type Board = readonly (readonly Cell[])[]; // 8 rows of 8
export type Player = 1 | 2;
export type Position = { row: number; col: number };

export type Move = {
  from: Position;
  to: Position;
  captured: Position[]; // in jump order
  path: Position[]; // every landing square, in order. One item for a simple move.
};

export const CELL = {
  light: 0,
  player1Man: 1,
  player2Man: 2,
  player1King: 3,
  player2King: 4,
  empty: 5,
} as const;

export const BOARD_SIZE = 8;

// Spec section 2.3. Row 0 is at the top. Player 2 starts on rows 0 to 2, and player 1 on rows 5 to 7.
// Frozen, because every new game starts from it: a change to it would change every later game.
const startingRows: Cell[][] = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [5, 0, 5, 0, 5, 0, 5, 0],
  [0, 5, 0, 5, 0, 5, 0, 5],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];
export const STARTING_BOARD: Board = Object.freeze(startingRows.map((row) => Object.freeze(row)));

export function isOnBoard(position: Position): boolean {
  return position.row >= 0 && position.row < BOARD_SIZE && position.col >= 0 && position.col < BOARD_SIZE;
}

// Pieces stand on dark squares only: odd columns on even rows, and even columns on odd rows.
export function isDarkSquare(position: Position): boolean {
  return isOnBoard(position) && (position.row + position.col) % 2 === 1;
}

export function cellAt(board: Board, position: Position): Cell {
  return board[position.row][position.col];
}

export function ownerOf(cell: Cell): Player | null {
  if (cell === CELL.player1Man || cell === CELL.player1King) {
    return 1;
  }
  if (cell === CELL.player2Man || cell === CELL.player2King) {
    return 2;
  }
  return null;
}

export function isKing(cell: Cell): boolean {
  return cell === CELL.player1King || cell === CELL.player2King;
}

// The row where a player's man becomes a king. Player 1 moves up the board, and player 2 moves down.
export function farRow(player: Player): number {
  return player === 1 ? 0 : BOARD_SIZE - 1;
}

export function samePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}
