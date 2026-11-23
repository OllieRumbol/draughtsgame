// Gives each piece on the board a stable id, so the board can slide a piece from square to square (T12).
// The game state holds only the board. So between two states, this works out whether one piece made one step:
// the person's selected piece, or the computer's next jump. Anything else, such as Undo or a new game,
// gives every piece a new id, so the board is redrawn at once (spec section 6.1.7, item 5).
import { type Board, type Cell, type Position, BOARD_SIZE, cellAt, ownerOf, samePosition } from "@/game/board";
import type { GameState } from "@/game/game-state";

export type TrackedPiece = {
  id: number;
  cell: Cell;
  position: Position;
  leaving: boolean; // a captured piece, still shown while it fades
  mover: "person" | "computer"; // who moved it last, or took it, for the length of the slide it follows
  carried: boolean; // the person's piece stays lifted while it slides, and is put down when it lands (the design)
};

export type Tracked = {
  state: GameState;
  pieces: TrackedPiece[];
  nextId: number;
};

type Step = { from: Position; to: Position; captured: Position | null };

export function startTracking(state: GameState): Tracked {
  return fresh(state, 1);
}

// The pieces for the next state. A piece that made the step keeps its id. A piece it captured stays, marked
// leaving, until the board says it has faded.
export function trackNext(tracked: Tracked, state: GameState): Tracked {
  if (sameBoard(tracked.state.board, state.board)) {
    return { ...tracked, state };
  }

  const step = stepBetween(tracked.state, state);
  if (step === null) {
    return fresh(state, tracked.nextId);
  }

  const mover: TrackedPiece["mover"] = isComputersPiece(state, step.to) ? "computer" : "person";
  const pieces = tracked.pieces.map((piece) => {
    if (piece.leaving) {
      return piece;
    }
    if (samePosition(piece.position, step.from)) {
      return { ...piece, position: step.to, cell: cellAt(state.board, step.to), mover, carried: mover === "person" };
    }
    if (step.captured !== null && samePosition(piece.position, step.captured)) {
      // It fades at the jump that took it, so it takes that jump's mover.
      return { ...piece, leaving: true, mover };
    }
    return piece;
  });

  return { state, pieces, nextId: tracked.nextId };
}

// The carried piece has landed, so it can be put down.
export function landed(tracked: Tracked, id: number): Tracked {
  return {
    ...tracked,
    pieces: tracked.pieces.map((piece) => (piece.id === id ? { ...piece, carried: false } : piece)),
  };
}

export function withoutPiece(tracked: Tracked, id: number): Tracked {
  return { ...tracked, pieces: tracked.pieces.filter((piece) => piece.id !== id) };
}

// Every piece on the board, with a new id. A piece that was still fading is gone at once.
function fresh(state: GameState, nextId: number): Tracked {
  const pieces: TrackedPiece[] = [];
  let id = nextId;
  forEachSquare((position) => {
    const cell = cellAt(state.board, position);
    if (ownerOf(cell) !== null) {
      pieces.push({ id, cell, position, leaving: false, mover: "person", carried: false });
      id += 1;
    }
  });
  return { state, pieces, nextId: id };
}

// The one step between two states, or null. The piece that moved must be the one the rules expect to move:
// the person's selected piece, or the computer's piece at the start of its next jump.
function stepBetween(previous: GameState, next: GameState): Step | null {
  const from = expectedMover(previous);
  if (from === null) {
    return null;
  }

  const mover = ownerOf(cellAt(previous.board, from));
  const changed: Position[] = [];
  forEachSquare((position) => {
    if (cellAt(previous.board, position) !== cellAt(next.board, position)) {
      changed.push(position);
    }
  });

  const to = changed.find(
    (position) => ownerOf(cellAt(previous.board, position)) === null && ownerOf(cellAt(next.board, position)) === mover,
  );
  const captured =
    changed.find(
      (position) =>
        ownerOf(cellAt(previous.board, position)) !== mover &&
        ownerOf(cellAt(previous.board, position)) !== null &&
        ownerOf(cellAt(next.board, position)) === null,
    ) ?? null;

  const leftFrom =
    changed.some((position) => samePosition(position, from)) && ownerOf(cellAt(next.board, from)) === null;
  const expectedChanges = captured === null ? 2 : 3;
  if (mover === null || to === undefined || !leftFrom || changed.length !== expectedChanges) {
    return null;
  }

  return { from, to, captured };
}

function expectedMover(state: GameState): Position | null {
  const phase = state.phase;
  if (phase.kind === "turn") {
    return phase.selected;
  }
  if (phase.kind === "computerMoving") {
    return phase.step === 0 ? phase.move.from : phase.move.path[phase.step - 1];
  }
  return null;
}

function isComputersPiece(state: GameState, position: Position): boolean {
  return state.settings.opponent === "computer" && ownerOf(cellAt(state.board, position)) === 2;
}

function sameBoard(a: Board, b: Board): boolean {
  if (a === b) {
    return true;
  }
  let same = true;
  forEachSquare((position) => {
    same = same && cellAt(a, position) === cellAt(b, position);
  });
  return same;
}

function forEachSquare(visit: (position: Position) => void): void {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      visit({ row, col });
    }
  }
}
