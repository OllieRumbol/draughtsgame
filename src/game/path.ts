// The jump order of the computer's move (spec section 6.1.5, items 3 and 4, and plan section 3.3.2).
// The API gives only the start, the end and the captured pieces ("takes", in board order).
import { type Board, type Move, type Player, type Position, samePosition } from "./board";
import { legalMoves } from "./rules";

// Finds a legal move from `from` to `to` that captures exactly the pieces in `takes`, in any order,
// and returns it with its jump order. Null when no legal move matches, which counts as a failure.
// It uses legalMoves, so it follows exactly the same rules. When several chains match, legalMoves keeps the first
// one it finds, and any of them is correct (spec section 6.1.5, item 4, and example 17).
export function findPath(board: Board, player: Player, from: Position, to: Position, takes: Position[]): Move | null {
  const wantedCaptures = squareSet(takes);

  const match = legalMoves(board, player).find(
    (move) => samePosition(move.from, from) && samePosition(move.to, to) && squareSet(move.captured) === wantedCaptures,
  );

  return match ?? null;
}

// The squares as one sorted text, so two lists compare as sets. A square listed twice stays twice,
// so a response that names the same piece twice does not match a chain that takes two pieces.
function squareSet(squares: Position[]): string {
  return squares
    .map((square) => `${square.row},${square.col}`)
    .sort()
    .join(" ");
}
