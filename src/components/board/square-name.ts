// The name a screen reader reads for a square (spec section 6.4.3, item 2): its row and column, counted from 1 at
// the top left, then what stands on it. For example, "Row 8, column 1, your man". T13 makes the board keyboard
// playable with these names.
import { type Cell, type Position, CELL, isDarkSquare, isKing, ownerOf } from "@/game/board";
import type { Settings } from "@/game/game-state";

type SquareNameInput = {
  position: Position;
  cell: Cell;
  opponent: Settings["opponent"];
  isTarget: boolean;
  isSelected: boolean;
};

export function squareName({ position, cell, opponent, isTarget, isSelected }: SquareNameInput): string {
  const where = `Row ${position.row + 1}, column ${position.col + 1}`;
  if (!isDarkSquare(position)) {
    return `${where}, light square`;
  }

  const what = cell === CELL.empty ? "empty" : pieceName(cell, opponent);
  const marks = [isTarget ? "target" : null, isSelected ? "selected" : null].filter((mark) => mark !== null);

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
