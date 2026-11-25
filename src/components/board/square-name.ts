// The name a screen reader reads for a square (spec section 6.4.3, item 2): its row and column, counted from 1 at
// the top left, then what stands on it. For example, "Row 8, column 1, your man". A target or the selected piece
// is said after it, as in the design, and then a tip (Show tips), so the rings are not seen only.
import { type Cell, type Position, CELL, isDarkSquare, isKing, ownerOf } from "@/game/board";
import type { Settings } from "@/game/game-state";

type SquareNameInput = {
  position: Position;
  cell: Cell;
  opponent: Settings["opponent"];
  isTarget: boolean;
  isSelected: boolean;
  isTip?: boolean;
};

export function squareName({ position, cell, opponent, isTarget, isSelected, isTip = false }: SquareNameInput): string {
  const where = `Row ${position.row + 1}, column ${position.col + 1}`;
  if (!isDarkSquare(position)) {
    return `${where}, light square`;
  }

  const what = cell === CELL.empty ? "empty" : pieceName(cell, opponent);
  const marks = [isTarget ? "target" : null, isSelected ? "selected" : null, isTip ? "tip" : null].filter(
    (mark) => mark !== null,
  );

  return [where, what, ...marks].join(", ");
}

// Spec section 6.1.11, items 1 and 2: "man" and "king"; "your" and "the computer's" in a computer game.
function pieceName(cell: Cell, opponent: Settings["opponent"]): string {
  const kind = isKing(cell) ? "king" : "man";
  const owner = ownerOf(cell);
  if (opponent === "computer") {
    return owner === 1 ? `your ${kind}` : `the computer's ${kind}`;
  }
  return `player ${owner}'s ${kind}`;
}
