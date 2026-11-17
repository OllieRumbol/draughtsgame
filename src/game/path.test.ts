import { describe, expect, it } from "vitest";
import { CELL } from "@/game/board";
import { findPath } from "@/game/path";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player2King: K2 } = CELL;

// Plan section 7.2, test 9: the computer's move, one jump at a time (spec section 6.1.5, items 3 and 4, and 6.2.2).
describe("findPath", () => {
  it("example 15: board order and jump order agree", () => {
    const board = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1]);

    const move = findPath(board, 2, at(0, 1), at(4, 5), [at(1, 2), at(3, 4)]);

    expect(move?.path).toEqual([at(2, 3), at(4, 5)]);
    expect(move?.captured).toEqual([at(1, 2), at(3, 4)]);
  });

  it("example 16: takes is in board order, the reverse of the jump order", () => {
    const board = boardWith([5, 2, K2], [4, 3, M1], [2, 3, M1]);

    const move = findPath(board, 2, at(5, 2), at(1, 2), [at(2, 3), at(4, 3)]);

    expect(move?.path).toEqual([at(3, 4), at(1, 2)]);
    expect(move?.captured).toEqual([at(4, 3), at(2, 3)]);
  });

  it("example 17: a chain that starts and ends on (1,2) gives four jumps, going either way round", () => {
    const board = boardWith([1, 2, K2], [2, 3, M1], [4, 3, M1], [4, 1, M1], [2, 1, M1]);
    const takes = [at(2, 1), at(2, 3), at(4, 1), at(4, 3)];

    const move = findPath(board, 2, at(1, 2), at(1, 2), takes);

    expect(move?.path).toHaveLength(4);
    expect(move?.path.at(-1)).toEqual(at(1, 2));
    expect(move?.captured).toHaveLength(4);
    expect(move?.captured).toEqual(expect.arrayContaining(takes));
    const clockwise = [at(3, 4), at(5, 2), at(3, 0), at(1, 2)];
    const anticlockwise = [at(3, 0), at(5, 2), at(3, 4), at(1, 2)];
    expect([clockwise, anticlockwise]).toContainEqual(move?.path);
  });

  it("gives a normal move as one step", () => {
    const board = boardWith([2, 3, M2]);

    expect(findPath(board, 2, at(2, 3), at(3, 2), [])).toEqual({
      from: at(2, 3),
      to: at(3, 2),
      captured: [],
      path: [at(3, 2)],
    });
  });

  it("example 18: a move from a square with no player 2 piece is not legal", () => {
    const board = boardWith([2, 3, M2], [5, 2, M1]);

    // (3,2) can be reached by the man on (2,3), but the response says the move starts on the empty square (1,4).
    expect(findPath(board, 2, at(1, 4), at(3, 2), [])).toBeNull();
    // A player 1 piece is not the computer's.
    expect(findPath(board, 2, at(5, 2), at(4, 1), [])).toBeNull();
    // From the right square, the same end is legal.
    expect(findPath(board, 2, at(2, 3), at(3, 2), [])?.path).toEqual([at(3, 2)]);
  });

  it("is null when no legal move matches the response", () => {
    const board = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1]);

    // An end square the piece cannot reach.
    expect(findPath(board, 2, at(0, 1), at(5, 6), [])).toBeNull();
    // The right end, but the wrong captured pieces.
    expect(findPath(board, 2, at(0, 1), at(4, 5), [at(1, 2)])).toBeNull();
    // A piece the chain does not take.
    expect(findPath(board, 2, at(0, 1), at(2, 3), [at(3, 4)])).toBeNull();
    // A captured piece named twice, for a chain that takes it once.
    expect(findPath(board, 2, at(0, 1), at(2, 3), [at(1, 2), at(1, 2)])).toBeNull();
  });

  it("is null for a capture that the house rules forbid: a man taking a king", () => {
    const board = boardWith([2, 3, M2], [3, 4, CELL.player1King]);

    expect(findPath(board, 2, at(2, 3), at(4, 5), [at(3, 4)])).toBeNull();
  });
});
