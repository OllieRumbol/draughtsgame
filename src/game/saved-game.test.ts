import { describe, expect, it } from "vitest";
import { type Move, CELL, STARTING_BOARD } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { parseSavedGame, toSavedGame } from "@/game/saved-game";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2 } = CELL;

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

const select = (row: number, col: number): Action => ({ type: "select", at: at(row, col) });
const target = (row: number, col: number): Action => ({ type: "chooseTarget", at: at(row, col) });

// A computer game where the person has moved (7,0) to (6,1), and the computer's two-jump chain is half shown.
function computerChainHalfShown(): { before: GameState; halfShown: GameState } {
  const board = boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]);
  const start = newGame(againstComputer);
  const game: GameState = { ...start, board, turnStart: { ...start.turnStart, board } };
  const before = play(game, select(7, 0), target(6, 1));
  const chain: Move = {
    from: at(0, 1),
    to: at(4, 5),
    captured: [at(1, 2), at(3, 4)],
    path: [at(2, 3), at(4, 5)],
  };
  const halfShown = play(
    before,
    { type: "computerMoveReceived", requestId: 1, move: chain },
    { type: "computerStepShown" },
  );
  return { before, halfShown };
}

// What a save holds after a JSON round trip: the same text the hook writes.
function savedText(state: GameState): string {
  return JSON.stringify(toSavedGame(state));
}

describe("toSavedGame (plan section 3.4)", () => {
  it("does not save a selection", () => {
    const selected = play(newGame(twoPlayers), select(5, 2));

    expect(toSavedGame(selected)).toEqual(newGame(twoPlayers));
  });

  it("saves a chain in progress as the start of its turn", () => {
    const start = newGame(twoPlayers);
    const board = boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]);
    const game: GameState = { ...start, board, turnStart: { ...start.turnStart, board } };
    const afterFirstJump = play(game, select(6, 1), target(4, 3));

    expect(afterFirstJump.phase.kind === "turn" && afterFirstJump.phase.chain).toBeTruthy();
    expect(toSavedGame(afterFirstJump)).toEqual(game);
  });

  it("saves a computer move part-way shown as the request for it, on the board from before it", () => {
    const { before, halfShown } = computerChainHalfShown();

    expect(halfShown.phase.kind).toBe("computerMoving");
    expect(toSavedGame(halfShown)).toEqual(before);
    expect(toSavedGame(halfShown).phase).toEqual({ kind: "computerThinking", requestId: 1 });
  });

  it("saves the other phases as they are", () => {
    const { before } = computerChainHalfShown();
    const failed = play(before, { type: "computerMoveFailed", requestId: 1 });
    const over = play(newGame(twoPlayers), { type: "giveUp" });

    expect(toSavedGame(before)).toEqual(before);
    expect(toSavedGame(failed)).toEqual(failed);
    expect(toSavedGame(over)).toEqual(over);
  });
});

// Plan section 7.2, test 19: a good save, damaged JSON, a wrong board size and a bad cell value
// (spec section 6.1.8, item 5, and section 6.6, item 9). The old key is in useSavedGame.test.ts.
describe("parseSavedGame", () => {
  // A save with history, captured pieces and the computer's last move.
  function goodSave(): GameState {
    const start = newGame(againstComputer);
    const personMoved = play(start, select(5, 2), target(4, 3));
    const reply: Move = { from: at(2, 1), to: at(3, 0), captured: [], path: [at(3, 0)] };
    return play(
      personMoved,
      { type: "computerMoveReceived", requestId: 1, move: reply },
      { type: "computerStepShown" },
    );
  }

  // The good save as plain JSON data, with one part changed.
  function changed(change: (save: Record<string, unknown>) => void): string {
    const save = JSON.parse(savedText(goodSave())) as Record<string, unknown>;
    change(save);
    return JSON.stringify(save);
  }

  it("reads a good save back as the same game", () => {
    const game = goodSave();

    expect(game.history).toHaveLength(2);
    expect(game.lastComputerMove).not.toBeNull();
    expect(parseSavedGame(savedText(game))).toEqual(game);
  });

  it("reads back a game in each phase that is saved: waiting for the computer, failed, and over", () => {
    const { before } = computerChainHalfShown();
    const failed = play(before, { type: "computerMoveFailed", requestId: 1 });
    const over = play(goodSave(), { type: "giveUp" });

    for (const game of [before, failed, over]) {
      expect(parseSavedGame(savedText(game))).toEqual(game);
    }
  });

  it.each([
    ["damaged JSON", '{"settings":'],
    ["an empty text", ""],
    ["JSON that is not an object", "[1, 2, 3]"],
    ["null", "null"],
  ])("discards %s", (_name, text) => {
    expect(parseSavedGame(text)).toBeNull();
  });

  it.each([
    ["7 rows", (save: Record<string, unknown>) => (save.board = STARTING_BOARD.slice(0, 7))],
    [
      "a row of 9 cells",
      (save: Record<string, unknown>) => (save.board = [[...STARTING_BOARD[0], 0], ...STARTING_BOARD.slice(1)]),
    ],
    ["a board that is not a list", (save: Record<string, unknown>) => (save.board = "board")],
  ])("discards a wrong board size: %s", (_name, change) => {
    expect(parseSavedGame(changed(change))).toBeNull();
  });

  it.each([
    ["6", 6],
    ["-1", -1],
    ["2.5", 2.5],
    ["text", "1"],
    ["null", null],
  ])("discards a bad cell value: %s", (_name, cell) => {
    const text = changed((save) => {
      const board = save.board as unknown[][];
      board[3][0] = cell;
    });

    expect(parseSavedGame(text)).toBeNull();
  });

  it("checks the cells of turnStart and of every snapshot in the history, as well as the board", () => {
    const badTurnStart = changed((save) => ((save.turnStart as { board: unknown[][] }).board[0][0] = 6));
    const badHistory = changed((save) => ((save.history as { board: unknown[][] }[])[1].board[0][0] = 6));
    const historyNotAList = changed((save) => (save.history = {}));

    expect(parseSavedGame(badTurnStart)).toBeNull();
    expect(parseSavedGame(badHistory)).toBeNull();
    expect(parseSavedGame(historyNotAList)).toBeNull();
  });

  it.each([
    [
      "an unknown opponent",
      (save: Record<string, unknown>) => ((save.settings as Record<string, unknown>).opponent = "robot"),
    ],
    [
      "an unknown level",
      (save: Record<string, unknown>) => ((save.settings as Record<string, unknown>).level = "expert"),
    ],
    [
      "a first player of 3",
      (save: Record<string, unknown>) => ((save.settings as Record<string, unknown>).firstPlayer = 3),
    ],
    ["no settings", (save: Record<string, unknown>) => delete save.settings],
  ])("discards bad settings: %s", (_name, change) => {
    expect(parseSavedGame(changed(change))).toBeNull();
  });

  it.each([
    ["a player 3 to move", (save: Record<string, unknown>) => (save.toMove = 3)],
    ["a negative captured count", (save: Record<string, unknown>) => (save.capturedBy = { 1: -1, 2: 0 })],
    ["a request count that is not whole", (save: Record<string, unknown>) => (save.requestCount = 1.5)],
    ["no request count", (save: Record<string, unknown>) => delete save.requestCount],
    [
      "a last move off the board",
      (save: Record<string, unknown>) => (save.lastComputerMove = { from: at(2, 1), to: at(8, 0) }),
    ],
    ["an unknown phase", (save: Record<string, unknown>) => (save.phase = { kind: "paused" })],
    [
      "a selection",
      (save: Record<string, unknown>) => (save.phase = { kind: "turn", selected: at(5, 0), chain: null }),
    ],
    [
      "a computer move part-way shown",
      (save: Record<string, unknown>) => (save.phase = { kind: "computerMoving", step: 0 }),
    ],
    [
      "a result with an unknown reason",
      (save: Record<string, unknown>) => (save.phase = { kind: "over", result: { winner: 1, reason: "draw" } }),
    ],
  ])("discards %s", (_name, change) => {
    expect(parseSavedGame(changed(change))).toBeNull();
  });

  it("discards a phase that does not fit whose turn it is, so a loaded game never waits for a move that cannot come", () => {
    const personsTurnForTheComputer = changed((save) => (save.toMove = 2));
    const { before } = computerChainHalfShown();
    const thinkingSave = JSON.parse(savedText(before)) as Record<string, unknown>;
    const computerThinksInTwoPlayerGame = JSON.stringify({ ...thinkingSave, settings: twoPlayers });
    const requestNotYetMade = JSON.stringify({ ...thinkingSave, phase: { kind: "computerThinking", requestId: 2 } });

    expect(parseSavedGame(personsTurnForTheComputer)).toBeNull();
    expect(parseSavedGame(computerThinksInTwoPlayerGame)).toBeNull();
    expect(parseSavedGame(requestNotYetMade)).toBeNull();
  });
});
