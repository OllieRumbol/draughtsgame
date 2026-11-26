import { describe, expect, it } from "vitest";
import { type Board, type Position, CELL } from "@/game/board";
import { hasMove, legalMoves, nextSteps } from "@/game/rules";
import { type Piece, at, boardWith } from "@/game/test-boards";
import { type RulePictureData, JUMPING_AGAIN, KINGS, MOVING, TAKING, WINNING, piecesAfter } from "./rule-pictures";

// Each picture is a corner of the board. This puts it on the whole board, `rowsDown` rows from the top, so the web
// app's own rules can check it. An even number of rows keeps the dark squares dark.
function onBoard(picture: RulePictureData, rowsDown: number): { board: Board; place: (p: Position) => Position } {
  const place = (position: Position) => at(position.row + rowsDown, position.col);
  const pieces = picture.pieces.map(({ position, cell }): Piece => [place(position).row, place(position).col, cell]);
  const board = boardWith(...pieces);
  return { board, place };
}

function sortPositions(positions: Position[]): Position[] {
  return [...positions].sort((a, b) => a.row - b.row || a.col - b.col);
}

// Spec section 6.1.11, item 3: each picture shows its rule (spec section 2.1), so the house rules must agree with it.
describe("the rule pictures follow the house rules", () => {
  it.each([
    ["Moving", MOVING, 2],
    ["Taking", TAKING, 2],
    ["Jumping again", JUMPING_AGAIN, 2],
    ["Kings", KINGS, 0],
  ])("%s: what Show me plays is one legal move for the light pieces", (_, picture, rowsDown) => {
    const { board, place } = onBoard(picture, rowsDown);
    const steps = picture.steps;

    const played = {
      from: place(steps[0].from),
      to: place(steps[steps.length - 1].to),
      captured: sortPositions(steps.flatMap((step) => (step.captured === null ? [] : [place(step.captured)]))),
    };

    const moves = legalMoves(board, 1).map((move) => ({
      from: move.from,
      to: move.to,
      captured: sortPositions(move.captured),
    }));
    expect(moves).toContainEqual(played);
  });

  it("Moving and Taking: the dots are the light man's targets", () => {
    for (const picture of [MOVING, TAKING]) {
      const { board, place } = onBoard(picture, 2);
      const targets = nextSteps(board, place(picture.steps[0].from), null).map((step) => step.to);

      expect(sortPositions(targets)).toEqual(sortPositions(picture.marks.targets.map(place)));
    }
  });

  it("Kings: the man reaches the far row, and the dots round the king are its targets", () => {
    const { board } = onBoard(KINGS, 0);
    const kingTargets = nextSteps(board, at(3, 2), null).map((step) => step.to);

    expect(KINGS.steps[0]).toMatchObject({ to: at(0, 1), crowned: true });
    expect(sortPositions(kingTargets)).toEqual(sortPositions([at(2, 1), at(2, 3), at(4, 1), at(4, 3)]));
    expect(KINGS.marks.targets).toEqual(expect.arrayContaining(kingTargets));
  });

  it("Winning: light, to move, has no legal move, so light loses (spec section 2.1, item 7)", () => {
    const { board } = onBoard(WINNING, 2);

    expect(hasMove(board, 1)).toBe(false);
    expect(WINNING.steps).toEqual([]);
    expect(WINNING.marks.arrows).toEqual([{ from: at(3, 0), to: at(1, 2), blocked: true }]);
  });

  it("marks each man that Show me takes with a taken ring, and no other", () => {
    for (const picture of [MOVING, TAKING, JUMPING_AGAIN, KINGS, WINNING]) {
      const captured = picture.steps.flatMap((step) => (step.captured === null ? [] : [step.captured]));

      expect(sortPositions(picture.marks.taken)).toEqual(sortPositions(captured));
    }
  });
});

describe("piecesAfter", () => {
  it("gives the still picture before Show me plays a step", () => {
    expect(piecesAfter(JUMPING_AGAIN, 0, true)).toEqual([
      { id: 0, cell: CELL.player1Man, position: at(4, 1), leaving: false, crowning: false },
      { id: 1, cell: CELL.player2Man, position: at(3, 2), leaving: false, crowning: false },
      { id: 2, cell: CELL.player2Man, position: at(1, 2), leaving: false, crowning: false },
    ]);
  });

  it("moves the same piece at each jump; the man just taken is leaving, and one taken before has gone", () => {
    expect(piecesAfter(JUMPING_AGAIN, 1, true)).toEqual([
      { id: 0, cell: CELL.player1Man, position: at(2, 3), leaving: false, crowning: false },
      { id: 1, cell: CELL.player2Man, position: at(3, 2), leaving: true, crowning: false },
      { id: 2, cell: CELL.player2Man, position: at(1, 2), leaving: false, crowning: false },
    ]);
    expect(piecesAfter(JUMPING_AGAIN, 2, true)).toEqual([
      { id: 0, cell: CELL.player1Man, position: at(0, 1), leaving: false, crowning: false },
      { id: 2, cell: CELL.player2Man, position: at(1, 2), leaving: true, crowning: false },
    ]);
  });

  it("crowns the man; it is crowning only when the board animates (plan section 3.6, reduced motion)", () => {
    const crowned = { id: 0, cell: CELL.player1King, position: at(0, 1), leaving: false };

    expect(piecesAfter(KINGS, 1, true)[0]).toEqual({ ...crowned, crowning: true });
    expect(piecesAfter(KINGS, 1, false)[0]).toEqual({ ...crowned, crowning: false });
  });
});
