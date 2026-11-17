import { describe, expect, it } from "vitest";
import { type Board, type Move, CELL, STARTING_BOARD, samePosition } from "@/game/board";
import { applyMove, hasMove, legalMoves, nextSteps } from "@/game/rules";
import { at, boardWith, describeMove, describeMoves } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player1King: K1, player2King: K2 } = CELL;

type Square = [row: number, col: number];

// A move in the form describeMove gives, so a list of moves compares as a set of start, end and captured set.
function move(from: Square, to: Square, ...captured: Square[]): string {
  return describeMove({
    from: at(...from),
    to: at(...to),
    captured: captured.map((square) => at(...square)),
    path: [],
  });
}

function expectMoves(moves: Move[], expected: string[]) {
  expect(describeMoves(moves)).toEqual([...expected].sort());
}

// Freezes a board and its rows, so a test fails if a function changes its input.
function frozen(board: Board): Board {
  return Object.freeze(board.map((row) => Object.freeze([...row])));
}

// Plan section 7.2, test 2: spec section 6.2.1, examples 1 to 6. They are the API's own examples
// (its spec section 6.2, examples 3, 4, 17, 18, 19 and 20), with the API's expected moves.
describe("legalMoves", () => {
  it("example 1: a king captures in every direction", () => {
    const board = boardWith([3, 2, K2], [4, 3, M1], [2, 3, M1]);

    expectMoves(legalMoves(board, 2), [
      move([3, 2], [2, 1]),
      move([3, 2], [4, 1]),
      move([3, 2], [5, 4], [4, 3]),
      move([3, 2], [1, 4], [2, 3]),
    ]);
  });

  it("example 2: a chain may stop after the first jump, and keeps its jumps in order", () => {
    const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]);
    const moves = legalMoves(board, 1);

    expectMoves(moves, [move([6, 1], [5, 0]), move([6, 1], [4, 3], [5, 2]), move([6, 1], [2, 5], [5, 2], [3, 4])]);

    const twoJumps = moves.find((candidate) => samePosition(candidate.to, at(2, 5)));
    expect(twoJumps?.captured).toEqual([at(5, 2), at(3, 4)]);
    expect(twoJumps?.path).toEqual([at(4, 3), at(2, 5)]);
  });

  it("example 3: a man cannot capture a king", () => {
    const board = boardWith([6, 1, M1], [5, 2, K2]);

    expectMoves(legalMoves(board, 1), [move([6, 1], [5, 0])]);
  });

  it("example 4: a king can capture a king, and moves in all four directions", () => {
    const board = boardWith([6, 1, K1], [5, 2, K2]);

    expectMoves(legalMoves(board, 1), [
      move([6, 1], [5, 0]),
      move([6, 1], [7, 0]),
      move([6, 1], [7, 2]),
      move([6, 1], [4, 3], [5, 2]),
    ]);
  });

  it("example 5: a chain may end where it began, and the loop in both directions is one move", () => {
    const board = boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]);

    expectMoves(legalMoves(board, 2), [
      move([1, 2], [0, 1]),
      move([1, 2], [0, 3]),
      move([1, 2], [3, 4], [2, 3]),
      move([1, 2], [5, 2], [2, 3], [4, 3]),
      move([1, 2], [3, 0], [2, 3], [4, 3], [4, 1]),
      move([1, 2], [3, 0], [2, 1]),
      move([1, 2], [5, 2], [2, 1], [4, 1]),
      move([1, 2], [3, 4], [2, 1], [4, 1], [4, 3]),
      move([1, 2], [1, 2], [2, 3], [4, 3], [4, 1], [2, 1]),
    ]);
  });

  it("example 6: a chain that loops ends, with no piece captured twice", () => {
    const board = boardWith([7, 4, K2], [6, 3, M1], [4, 1, M1], [4, 3, M1], [2, 1, M1], [2, 3, M1]);

    expectMoves(legalMoves(board, 2), [
      move([7, 4], [6, 5]),
      move([7, 4], [5, 2], [6, 3]),
      move([7, 4], [3, 0], [6, 3], [4, 1]),
      move([7, 4], [1, 2], [6, 3], [4, 1], [2, 1]),
      move([7, 4], [3, 4], [6, 3], [4, 1], [2, 1], [2, 3]),
      move([7, 4], [3, 4], [6, 3], [4, 3]),
      move([7, 4], [1, 2], [6, 3], [4, 3], [2, 3]),
      move([7, 4], [3, 0], [6, 3], [4, 3], [2, 3], [2, 1]),
      move([7, 4], [5, 2], [6, 3], [4, 1], [4, 3], [2, 1], [2, 3]),
    ]);
  });

  it("does not change the board it is given", () => {
    expect(() => legalMoves(frozen(boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1])), 2)).not.toThrow();
  });

  // T12 and T15 show a move one step at a time from its path (plan section 3.3.1).
  it("gives each move a path: the end square for a normal move, and each landing square in order for a chain", () => {
    const examples: [Board, 1 | 2][] = [
      [boardWith([3, 2, K2], [4, 3, M1], [2, 3, M1]), 2],
      [boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]), 1],
      [boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]), 2],
      [boardWith([7, 4, K2], [6, 3, M1], [4, 1, M1], [4, 3, M1], [2, 1, M1], [2, 3, M1]), 2],
    ];

    for (const [board, player] of examples) {
      for (const found of legalMoves(board, player)) {
        const name = describeMove(found);
        expect(found.path.at(-1), name).toEqual(found.to);

        if (found.captured.length === 0) {
          expect(found.path, name).toEqual([found.to]);
          continue;
        }

        // Each jump goes from the previous landing, over the captured piece, to the next landing.
        expect(found.path, name).toHaveLength(found.captured.length);
        found.path.forEach((landing, index) => {
          const takeoff = index === 0 ? found.from : found.path[index - 1];
          const over = { row: (takeoff.row + landing.row) / 2, col: (takeoff.col + landing.col) / 2 };
          expect(Math.abs(landing.row - takeoff.row), name).toBe(2);
          expect(Math.abs(landing.col - takeoff.col), name).toBe(2);
          expect(found.captured[index], name).toEqual(over);
        });
      }
    }
  });
});

// Plan section 7.2, test 6: promotion ends a chain (spec section 2.1, item 6, and section 6.1.3, item 5).
describe("promotion", () => {
  it("example 12: a man that jumps to the far row can stop there", () => {
    const board = boardWith([2, 3, M1], [1, 2, M2]);

    expectMoves(legalMoves(board, 1), [move([2, 3], [1, 4]), move([2, 3], [0, 1], [1, 2])]);
  });

  it("stops the chain of a player 1 man, even when the new king could jump again", () => {
    // After (2,1) jumps to (0,3), a king could jump (1,4) to (2,5). The new king may not.
    const board = boardWith([2, 1, M1], [1, 2, M2], [1, 4, M2]);

    expectMoves(legalMoves(board, 1), [move([2, 1], [1, 0]), move([2, 1], [0, 3], [1, 2])]);
  });

  it("stops the chain of a player 2 man, even when the new king could jump again", () => {
    // After (5,4) jumps to (7,2), a king could jump (6,1) to (5,0). The new king may not.
    const board = boardWith([5, 4, M2], [6, 3, M1], [6, 1, M1]);

    expectMoves(legalMoves(board, 2), [move([5, 4], [6, 5]), move([5, 4], [7, 2], [6, 3])]);
  });
});

// Plan section 7.2, test 4: the targets of a selected piece (spec section 6.1.2, items 2 and 6).
describe("nextSteps", () => {
  it("example 8: the man at (5,2) on the starting board has targets (4,1) and (4,3)", () => {
    expect(nextSteps(STARTING_BOARD, at(5, 2), null)).toEqual([
      { to: at(4, 1), captured: null },
      { to: at(4, 3), captured: null },
    ]);
  });

  it("example 11: the man at (5,4) on the starting board has targets (4,3) and (4,5)", () => {
    expect(nextSteps(STARTING_BOARD, at(5, 4), null)).toEqual([
      { to: at(4, 3), captured: null },
      { to: at(4, 5), captured: null },
    ]);
  });

  it("gives no targets for a piece that cannot move, for an empty square, or for a square off the board", () => {
    expect(nextSteps(STARTING_BOARD, at(6, 1), null)).toEqual([]);
    expect(nextSteps(STARTING_BOARD, at(4, 1), null)).toEqual([]);
    expect(nextSteps(STARTING_BOARD, at(8, 1), null)).toEqual([]);
  });

  it("gives normal moves and jumps when no chain is under way", () => {
    const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]);

    expect(nextSteps(board, at(6, 1), null)).toEqual([
      { to: at(5, 0), captured: null },
      { to: at(4, 3), captured: at(5, 2) },
    ]);
  });

  it("gives only further jumps during a chain (spec section 6.1.3)", () => {
    // Example 9, after the first jump: the man is on (4,3), and (5,2) has been taken.
    const board = boardWith([4, 3, M1], [3, 4, M2]);
    const chain = { start: at(6, 1), captured: [at(5, 2)] };

    expect(nextSteps(board, at(4, 3), chain)).toEqual([{ to: at(2, 5), captured: at(3, 4) }]);
  });

  it("gives nothing when the chain cannot go on, so the turn ends (spec section 6.1.3, item 4)", () => {
    const board = boardWith([2, 5, M1]);
    const chain = { start: at(6, 1), captured: [at(5, 2), at(3, 4)] };

    expect(nextSteps(board, at(2, 5), chain)).toEqual([]);
  });
});

// Plan section 7.2, test 7, and plan section 3.5, decision 13: a captured piece counts as taken until the move ends.
describe("captured pieces during a chain", () => {
  // Example 5, after three jumps: the king left (1,2) and took (2,3), (4,3) and (4,1). It is now on (3,0).
  const chain = { start: at(1, 2), captured: [at(2, 3), at(4, 3), at(4, 1)] };
  const expectedSteps = [{ to: at(1, 2), captured: at(2, 1) }];

  it("cannot be captured again while it is still drawn on the board", () => {
    const board = boardWith([3, 0, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]);

    expect(nextSteps(board, at(3, 0), chain)).toEqual(expectedSteps);
  });

  it("gives the same steps when the captured pieces have already faded from the board", () => {
    const board = boardWith([3, 0, K2], [2, 1, M1]);

    expect(nextSteps(board, at(3, 0), chain)).toEqual(expectedSteps);
  });

  it("never becomes a landing square, because a jump lands an even number of rows away and a captured piece is an odd number away", () => {
    const boards: [Board, 1 | 2][] = [
      [boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]), 2],
      [boardWith([7, 4, K2], [6, 3, M1], [4, 1, M1], [4, 3, M1], [2, 1, M1], [2, 3, M1]), 2],
    ];

    for (const [board, player] of boards) {
      for (const found of legalMoves(board, player)) {
        const landsOnCaptured = found.path.some((landing) =>
          found.captured.some((taken) => samePosition(taken, landing)),
        );
        expect(landsOnCaptured, describeMove(found)).toBe(false);
      }
    }
  });
});

describe("hasMove", () => {
  it("is true for both players on the starting board", () => {
    expect(hasMove(STARTING_BOARD, 1)).toBe(true);
    expect(hasMove(STARTING_BOARD, 2)).toBe(true);
  });

  it("is false for a player whose men are all blocked (the board in spec example 14)", () => {
    const board = boardWith(
      [0, 1, M2],
      [0, 3, M2],
      [0, 5, M2],
      [0, 7, M2],
      [1, 0, M1],
      [1, 2, M1],
      [1, 4, M1],
      [1, 6, M1],
      [2, 1, M1],
      [2, 3, M1],
      [2, 5, M1],
      [2, 7, M1],
    );

    expect(hasMove(board, 2)).toBe(false);
    expect(hasMove(board, 1)).toBe(false);
  });

  it("is false for a player with no pieces", () => {
    expect(hasMove(boardWith([4, 3, M1]), 2)).toBe(false);
  });

  it("is true when the only move is a jump", () => {
    // The man at (6,1) cannot step to (5,0) or (5,2), but it can jump (5,2).
    expect(hasMove(boardWith([6, 1, M1], [5, 0, M1], [5, 2, M2]), 1)).toBe(true);
  });
});

describe("applyMove", () => {
  it("moves the piece and empties its start square", () => {
    const next = applyMove(STARTING_BOARD, { from: at(5, 2), to: at(4, 3), captured: [], path: [at(4, 3)] });

    expect(next[5][2]).toBe(CELL.empty);
    expect(next[4][3]).toBe(M1);
  });

  it("removes every captured piece", () => {
    const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]);

    const next = applyMove(board, { from: at(6, 1), to: at(2, 5), captured: [at(5, 2), at(3, 4)], path: [] });

    expect(next).toEqual(boardWith([2, 5, M1]));
  });

  it("keeps a king whose chain ends on its start square", () => {
    const board = boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]);
    const loop: Move = { from: at(1, 2), to: at(1, 2), captured: [at(2, 3), at(4, 3), at(4, 1), at(2, 1)], path: [] };

    expect(applyMove(board, loop)).toEqual(boardWith([1, 2, K2]));
  });

  it("example 12: promotes a man that reaches the far row, for either player", () => {
    const player1 = applyMove(boardWith([2, 3, M1], [1, 2, M2]), {
      from: at(2, 3),
      to: at(0, 1),
      captured: [at(1, 2)],
      path: [at(0, 1)],
    });
    const player2 = applyMove(boardWith([6, 1, M2]), { from: at(6, 1), to: at(7, 0), captured: [], path: [at(7, 0)] });

    expect(player1).toEqual(boardWith([0, 1, K1]));
    expect(player2).toEqual(boardWith([7, 0, K2]));
  });

  it("returns a new board and leaves the old one as it was", () => {
    const board = frozen(STARTING_BOARD);

    const next = applyMove(board, { from: at(5, 2), to: at(4, 3), captured: [], path: [at(4, 3)] });

    expect(next).not.toBe(board);
    expect(board[5][2]).toBe(M1);
  });
});
