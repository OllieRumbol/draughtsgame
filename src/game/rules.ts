// The house rules (spec section 2.1), ported from the API's MoveGenerator.cs (plan section 3.2),
// so that the web app and the API give the same moves (spec section 6.2.1).
import {
  type Board,
  type Cell,
  type Move,
  type Player,
  type Position,
  BOARD_SIZE,
  CELL,
  cellAt,
  farRow,
  isKing,
  isOnBoard,
  ownerOf,
  samePosition,
} from "./board";

// The next steps for one piece. During a chain, only further jumps by the same piece.
export type Step = { to: Position; captured: Position | null };
export type ChainSoFar = { start: Position; captured: Position[] };

type Direction = { row: -1 | 1; col: -1 | 1 };

const UP_LEFT: Direction = { row: -1, col: -1 };
const UP_RIGHT: Direction = { row: -1, col: 1 };
const DOWN_LEFT: Direction = { row: 1, col: -1 };
const DOWN_RIGHT: Direction = { row: 1, col: 1 };

// The same order as the API, so both find the chains in the same order.
const KING_DIRECTIONS = [UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT];

export function legalMoves(board: Board, player: Player): Move[] {
  const moves: Move[] = [];

  for (const from of squaresOf(board, player)) {
    moves.push(...simpleMoves(board, from));
    moves.push(...captureChains(board, from, player));
  }

  return moves;
}

export function hasMove(board: Board, player: Player): boolean {
  return squaresOf(board, player).some((from) => nextSteps(board, from, null).length > 0);
}

// The board holds the piece on `from`. During a chain, `chain` holds the chain so far. The captured pieces
// may still be on the board or already faded: either way they cannot be captured again (plan section 3.5, decision 13).
export function nextSteps(board: Board, from: Position, chain: ChainSoFar | null): Step[] {
  const piece = cellAt(board, from);
  if (ownerOf(piece) === null) {
    return [];
  }

  const steps: Step[] = [];

  // During a chain the piece may only jump again (spec section 6.1.3).
  if (chain === null) {
    for (const direction of directionsFor(piece)) {
      const to = offset(from, direction, 1);
      if (isEmpty(board, to)) {
        steps.push({ to, captured: null });
      }
    }
  }

  const chainSoFar = chain ?? { start: from, captured: [] };
  for (const direction of directionsFor(piece)) {
    const jump = jumpFrom(board, piece, from, direction, chainSoFar);
    if (jump) {
      steps.push(jump);
    }
  }

  return steps;
}

// Applies a whole move: removes the captured pieces and promotes a man on the far row.
export function applyMove(board: Board, move: Move): Board {
  const next = board.map((row) => [...row]);
  const piece = next[move.from.row][move.from.col];

  // Clear the start square first, so a chain that ends where it began keeps its piece.
  next[move.from.row][move.from.col] = CELL.empty;
  for (const square of move.captured) {
    next[square.row][square.col] = CELL.empty;
  }
  next[move.to.row][move.to.col] = promoted(piece, move.to.row);

  return next;
}

function squaresOf(board: Board, player: Player): Position[] {
  const squares: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (ownerOf(board[row][col]) === player) {
        squares.push({ row, col });
      }
    }
  }
  return squares;
}

function simpleMoves(board: Board, from: Position): Move[] {
  return nextSteps(board, from, null)
    .filter((step) => step.captured === null)
    .map((step) => ({ from, to: step.to, captured: [], path: [step.to] }));
}

// Follows every capture chain from `start`. Each landing square is a separate legal move,
// because a chain may stop after any jump (spec section 2.1, item 2).
function captureChains(board: Board, start: Position, player: Player): Move[] {
  const piece = cellAt(board, start);
  const moves: Move[] = [];
  const found = new Set<string>();

  // The board is not changed during the search, so each captured piece stays on its square until the move ends.
  const follow = (current: Position, captured: Position[], path: Position[]) => {
    for (const direction of directionsFor(piece)) {
      const jump = jumpFrom(board, piece, current, direction, { start, captured });
      if (!jump || !jump.captured) {
        continue;
      }

      const capturedNow = [...captured, jump.captured];
      const pathNow = [...path, jump.to];

      // Two chains with the same start, end and captured pieces are one move. The first one found is kept.
      const key = moveKey(jump.to, capturedNow);
      if (!found.has(key)) {
        found.add(key);
        moves.push({ from: start, to: jump.to, captured: capturedNow, path: pathNow });
      }

      // A man that reaches the far row becomes a king, and its chain stops (spec section 2.1, item 6).
      const becomesKing = !isKing(piece) && jump.to.row === farRow(player);
      if (!becomesKing) {
        follow(jump.to, capturedNow, pathNow);
      }
    }
  };

  follow(start, [], []);
  return moves;
}

// One jump from `from` in one direction, or null when it is not allowed.
function jumpFrom(board: Board, piece: Cell, from: Position, direction: Direction, chain: ChainSoFar): Step | null {
  const over = offset(from, direction, 1);
  const landing = offset(from, direction, 2);
  if (!isOnBoard(landing)) {
    return null;
  }

  // A piece cannot be captured twice in the same chain (spec section 2.1, item 5).
  const alreadyCaptured = chain.captured.some((square) => samePosition(square, over));
  if (alreadyCaptured || !canCapture(piece, cellAt(board, over))) {
    return null;
  }

  // The piece has left its start square, so a king may land back on it (spec section 2.1, item 3).
  // A landing is never a square captured in the same chain: landings are an even number of rows from the start,
  // and captured pieces an odd number. So it does not matter whether a captured piece is still drawn.
  const canLand = samePosition(landing, chain.start) || isEmpty(board, landing);
  if (!canLand) {
    return null;
  }

  return { to: landing, captured: over };
}

// Men capture only men, and kings capture men and kings (spec section 2.1, item 4).
function canCapture(piece: Cell, target: Cell): boolean {
  const mover = ownerOf(piece);
  const victim = ownerOf(target);
  if (mover === null || victim === null || victim === mover) {
    return false;
  }
  return isKing(piece) || !isKing(target);
}

// Men move and capture forward only. Kings use all four directions (spec section 2.1, item 3).
function directionsFor(piece: Cell): Direction[] {
  if (piece === CELL.player1Man) {
    return [UP_LEFT, UP_RIGHT];
  }
  if (piece === CELL.player2Man) {
    return [DOWN_LEFT, DOWN_RIGHT];
  }
  return KING_DIRECTIONS;
}

function promoted(piece: Cell, row: number): Cell {
  if (piece === CELL.player1Man && row === farRow(1)) {
    return CELL.player1King;
  }
  if (piece === CELL.player2Man && row === farRow(2)) {
    return CELL.player2King;
  }
  return piece;
}

function isEmpty(board: Board, position: Position): boolean {
  return isOnBoard(position) && cellAt(board, position) === CELL.empty;
}

function offset(from: Position, direction: Direction, distance: number): Position {
  return { row: from.row + direction.row * distance, col: from.col + direction.col * distance };
}

function moveKey(to: Position, captured: Position[]): string {
  const capturedSet = captured
    .map((square) => `${square.row},${square.col}`)
    .sort()
    .join(" ");
  return `${to.row},${to.col}|${capturedSet}`;
}
