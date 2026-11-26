// The small board pictures on How to play (spec section 6.1.11, item 3), as the design draws them
// (docs/design/site.html, RULES). Each picture is a corner of the board, a few squares wide. Plain TypeScript.
import type { PictureMarks, PicturePiece } from "@/components/board/RulePicture";
import { type Cell, type Position, CELL, samePosition } from "@/game/board";

// One step of "Show me": a move or one jump, which may take a man, or crown the man that makes it.
export type RuleStep = { from: Position; to: Position; captured: Position | null; crowned: boolean };

export type RulePictureData = {
  squares: number;
  pieces: { position: Position; cell: Cell }[];
  marks: PictureMarks;
  label: string; // the text alternative (spec section 6.4.4)
  steps: RuleStep[]; // what "Show me" plays. None for the end of the game, which has no "Show me".
};

const { player1Man: LIGHT_MAN, player2Man: DARK_MAN, player1King: LIGHT_KING } = CELL;

function at(row: number, col: number): Position {
  return { row, col };
}

export const MOVING: RulePictureData = {
  squares: 4,
  pieces: [{ position: at(3, 2), cell: LIGHT_MAN }],
  marks: {
    targets: [at(2, 1), at(2, 3)],
    taken: [],
    arrows: [
      { from: at(3, 2), to: at(2, 1), blocked: false },
      { from: at(3, 2), to: at(2, 3), blocked: false },
    ],
  },
  label: "A light man with a dot on each empty dark square diagonally ahead of it.",
  steps: [{ from: at(3, 2), to: at(2, 1), captured: null, crowned: false }],
};

export const TAKING: RulePictureData = {
  squares: 4,
  pieces: [
    { position: at(3, 0), cell: LIGHT_MAN },
    { position: at(2, 1), cell: DARK_MAN },
  ],
  marks: {
    targets: [at(1, 2)],
    taken: [at(2, 1)],
    arrows: [{ from: at(3, 0), to: at(1, 2), blocked: false }],
  },
  label:
    "A light man jumps over a dark man to the empty square beyond it. The dark man has a dashed ring, because it is taken.",
  steps: [{ from: at(3, 0), to: at(1, 2), captured: at(2, 1), crowned: false }],
};

export const JUMPING_AGAIN: RulePictureData = {
  squares: 5,
  pieces: [
    { position: at(4, 1), cell: LIGHT_MAN },
    { position: at(3, 2), cell: DARK_MAN },
    { position: at(1, 2), cell: DARK_MAN },
  ],
  marks: {
    targets: [at(2, 3), at(0, 1)],
    taken: [at(3, 2), at(1, 2)],
    arrows: [
      { from: at(4, 1), to: at(2, 3), blocked: false },
      { from: at(2, 3), to: at(0, 1), blocked: false },
    ],
  },
  label:
    "A light man jumps one dark man, then jumps a second dark man in the same turn. Both dark men have a dashed ring, because they are taken.",
  steps: [
    { from: at(4, 1), to: at(2, 3), captured: at(3, 2), crowned: false },
    { from: at(2, 3), to: at(0, 1), captured: at(1, 2), crowned: false },
  ],
};

export const KINGS: RulePictureData = {
  squares: 5,
  pieces: [
    { position: at(1, 0), cell: LIGHT_MAN },
    { position: at(3, 2), cell: LIGHT_KING },
  ],
  marks: {
    targets: [at(0, 1), at(2, 1), at(2, 3), at(4, 1), at(4, 3)],
    taken: [],
    arrows: [{ from: at(1, 0), to: at(0, 1), blocked: false }],
  },
  label:
    "A light man one step from the far side. Below it, a light king, shown as two stacked men with a brass band, with a dot on each of the four diagonal squares around it.",
  steps: [{ from: at(1, 0), to: at(0, 1), captured: null, crowned: true }],
};

export const WINNING: RulePictureData = {
  squares: 4,
  pieces: [
    { position: at(3, 0), cell: LIGHT_MAN },
    { position: at(2, 1), cell: DARK_MAN },
    { position: at(1, 2), cell: DARK_MAN },
  ],
  marks: {
    targets: [],
    taken: [],
    arrows: [{ from: at(3, 0), to: at(1, 2), blocked: true }],
  },
  label:
    "Light to move. A light man at the edge of the board. The square ahead holds a dark man, and the square beyond that is taken too, so the dashed arrow is blocked and the light man cannot move.",
  steps: [],
};

// The pieces once "Show me" has played the first `shown` steps. Each piece keeps its id, so a moved piece slides.
// A man taken in the last of those steps is leaving, so it fades at its own jump. One taken earlier has gone.
// A man crowned in the last step is crowning when the board animates, so the crowning shows its crown.
export function piecesAfter(picture: RulePictureData, shown: number, animates: boolean): PicturePiece[] {
  let pieces: PicturePiece[] = picture.pieces.map((piece, index) => ({
    id: index,
    cell: piece.cell,
    position: piece.position,
    leaving: false,
    crowning: false,
  }));

  picture.steps.slice(0, shown).forEach((step, index) => {
    const isLast = index === shown - 1;
    pieces = pieces
      .filter((piece) => !piece.leaving)
      .map((piece) => {
        if (samePosition(piece.position, step.from)) {
          const cell = step.crowned ? asKing(piece.cell) : piece.cell;
          return { ...piece, position: step.to, cell, crowning: step.crowned && isLast && animates };
        }
        if (step.captured !== null && samePosition(piece.position, step.captured)) {
          return { ...piece, leaving: true };
        }
        return piece;
      });
  });

  return pieces;
}

function asKing(cell: Cell): Cell {
  if (cell === CELL.player1Man) {
    return CELL.player1King;
  }
  return cell === CELL.player2Man ? CELL.player2King : cell;
}
