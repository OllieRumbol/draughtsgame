import { describe, expect, it } from "vitest";
import { type Board, type Move, CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";
import { announcement, resultSentence, resultTitle } from "@/components/live-region/announcement";

const { player1Man: M1, player2Man: M2, player1King: K1 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function gameOn(board: Board, settings: Settings = twoPlayers): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
}

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

// What the live region says for the last action, after the others.
function said(start: GameState, ...actions: Action[]): string | null {
  const before = play(start, ...actions.slice(0, -1));
  return announcement(before, gameReducer(before, actions[actions.length - 1]));
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });
const shown: Action = { type: "computerStepShown" };

function received(move: Move): Action {
  return { type: "computerMoveReceived", requestId: 1, move };
}

// A computer game where the person moves (7,0) to (6,1), so the computer is asked for its move.
function computerAsked(board: Board): GameState {
  return play(gameOn(board, againstComputer), select(7, 0), target(6, 1));
}

// Plan section 7.2, test 26 (spec section 6.4.3, item 3), with the wording from the design.
describe("announcement", () => {
  describe("selecting", () => {
    const board = boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1], [6, 7, M1], [5, 6, M2], [4, 5, M2]);

    it("says the selected square and how many targets it has", () => {
      expect(said(gameOn(board), select(5, 2))).toBe("Selected row 6, column 3. 2 targets.");
      expect(said(gameOn(board), select(7, 0))).toBe("Selected row 8, column 1. 1 target.");
    });

    it("says when the selected piece has no moves (spec section 6.1.2, item 6)", () => {
      expect(said(gameOn(board), select(6, 7))).toBe("Selected row 7, column 8. No moves.");
    });

    it("says 'Put down.' when the selection is cleared", () => {
      expect(said(gameOn(board), select(5, 2), select(5, 2))).toBe("Put down.");
      expect(said(gameOn(board), select(5, 2), target(3, 0))).toBe("Put down.");
    });

    it("says nothing for a click that changes nothing", () => {
      expect(said(gameOn(board), target(3, 0))).toBeNull();
    });
  });

  describe("the person's moves", () => {
    it("says the move, then whose turn it is", () => {
      expect(said(newGame(twoPlayers), select(5, 2), target(4, 3))).toBe(
        "Player 1 moved to row 5, column 4. Player 2's turn.",
      );
    });

    it("says 'You' in a computer game, then that the computer is thinking", () => {
      expect(said(newGame(againstComputer), select(5, 2), target(4, 3))).toBe(
        "You moved to row 5, column 4. The computer is thinking.",
      );
    });

    it("says a capture and the kind of piece taken, and that a chain can go on", () => {
      const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [0, 7, M2]));

      expect(said(start, select(6, 1), target(4, 3))).toBe(
        "Player 1 jumped to row 5, column 4, taking a man. You can jump again, or end your turn.",
      );
      expect(said(start, select(6, 1), target(4, 3), target(2, 5))).toBe(
        "Player 1 jumped to row 3, column 6, taking a man. Player 2's turn.",
      );
      expect(
        said(gameOn(boardWith([6, 1, K1], [5, 2, CELL.player2King], [0, 7, M2])), select(6, 1), target(4, 3)),
      ).toBe("Player 1 jumped to row 5, column 4, taking a king. Player 2's turn.");
    });

    it("says whose turn it is when the player ends a chain with End turn", () => {
      const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [0, 7, M2]));

      expect(said(start, select(6, 1), target(4, 3), { type: "endTurn" })).toBe("Player 2's turn.");
    });

    it("says when a man becomes a king (crowning)", () => {
      const start = gameOn(boardWith([1, 2, M1], [5, 6, M2]));

      expect(said(start, select(1, 2), target(0, 1))).toBe(
        "Player 1 moved to row 1, column 2. The man becomes a king. Player 2's turn.",
      );
      expect(said(gameOn(boardWith([1, 2, M1], [5, 6, M2]), againstComputer), select(1, 2), target(0, 1))).toBe(
        "You moved to row 1, column 2. Your man becomes a king. The computer is thinking.",
      );
    });
  });

  describe("the computer's moves", () => {
    it("says nothing while the move is shown, then the whole move once it has been shown", () => {
      const asked = computerAsked(boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]));
      const chain: Move = { from: at(0, 1), to: at(4, 5), captured: [at(1, 2), at(3, 4)], path: [at(2, 3), at(4, 5)] };

      expect(said(asked, received(chain))).toBeNull();
      expect(said(asked, received(chain), shown)).toBeNull();
      expect(said(asked, received(chain), shown, shown)).toBeNull();
      expect(said(asked, received(chain), shown, shown, shown)).toBe(
        "The computer jumped row 1, column 2 to row 5, column 6, taking 2 pieces. Your turn.",
      );
    });

    it("says a plain move, a single capture of a king, and a crowning", () => {
      const plain = computerAsked(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
      const step: Move = { from: at(2, 1), to: at(3, 0), captured: [], path: [at(3, 0)] };
      expect(said(plain, received(step), shown, shown)).toBe(
        "The computer moved row 3, column 2 to row 4, column 1. Your turn.",
      );

      const takesKing = computerAsked(boardWith([2, 1, M2], [3, 2, K1], [7, 0, M1]));
      const jump: Move = { from: at(2, 1), to: at(4, 3), captured: [at(3, 2)], path: [at(4, 3)] };
      expect(said(takesKing, received(jump), shown, shown)).toBe(
        "The computer jumped row 3, column 2 to row 5, column 4, taking your king. Your turn.",
      );

      const crowns = computerAsked(boardWith([6, 3, M2], [7, 0, M1]));
      const toFarRow: Move = { from: at(6, 3), to: at(7, 4), captured: [], path: [at(7, 4)] };
      expect(said(crowns, received(toFarRow), shown, shown)).toBe(
        "The computer moved row 7, column 4 to row 8, column 5. Its man becomes a king. Your turn.",
      );
    });

    it("says a failure, and that the computer is thinking again after Try again (spec section 6.1.9)", () => {
      const asked = computerAsked(boardWith([2, 1, M2], [7, 0, M1]));
      const failed: Action = { type: "computerMoveFailed", requestId: 1 };

      expect(said(asked, failed)).toBe("The computer couldn't move. Check your connection and try again.");
      expect(said(asked, failed, { type: "retry" })).toBe("The computer is thinking.");
    });
  });

  describe("the result", () => {
    it("says the result after the move that ends the game", () => {
      expect(said(gameOn(boardWith([5, 2, M1], [4, 3, M2])), select(5, 2), target(3, 4))).toBe(
        "Player 1 jumped to row 4, column 5, taking a man. Player 1 wins. Player 2 has no pieces left.",
      );
      expect(said(gameOn(boardWith([6, 1, M2], [7, 0, M1], [7, 2, M1], [5, 6, M1])), select(5, 6), target(4, 7))).toBe(
        "Player 1 moved to row 5, column 8. Player 1 wins. Player 2 can't move.",
      );
    });

    it("says who gave up and who wins, on the person's turn and while the computer thinks", () => {
      expect(said(newGame(twoPlayers), { type: "giveUp" })).toBe("Player 1 gave up. Player 2 wins.");
      expect(said(computerAsked(boardWith([2, 1, M2], [7, 0, M1])), { type: "giveUp" })).toBe(
        "You gave up. The computer wins.",
      );
    });

    it("words each result for both kinds of game (spec section 6.3)", () => {
      expect(resultTitle(againstComputer, { winner: 1, reason: "noMoves" })).toBe("You win");
      expect(resultSentence(againstComputer, { winner: 1, reason: "noMoves" })).toBe(
        "You win. The computer can't move.",
      );
      expect(resultSentence(againstComputer, { winner: 2, reason: "noMoves" })).toBe(
        "The computer wins. You can't move.",
      );
      expect(resultSentence(againstComputer, { winner: 2, reason: "noPieces" })).toBe(
        "The computer wins. You have no pieces left.",
      );
      expect(resultSentence(againstComputer, { winner: 1, reason: "noPieces" })).toBe(
        "You win. The computer has no pieces left.",
      );
      expect(resultSentence(twoPlayers, { winner: 2, reason: "gaveUp" })).toBe("Player 1 gave up. Player 2 wins.");
    });
  });

  describe("Undo", () => {
    it("says that the turn was undone, and whose turn it is", () => {
      expect(said(newGame(twoPlayers), select(5, 2), target(4, 3), { type: "undo" })).toBe("Undone. Player 1's turn.");
      const start = gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [0, 7, M2]));
      expect(said(start, select(6, 1), target(4, 3), { type: "undo" })).toBe("Undone. Player 1's turn.");
    });

    it("says 'Your turn' in a computer game", () => {
      const asked = computerAsked(boardWith([2, 1, M2], [7, 0, M1]));
      expect(said(asked, { type: "computerMoveFailed", requestId: 1 }, { type: "undo" })).toBe("Undone. Your turn.");
    });
  });
});
