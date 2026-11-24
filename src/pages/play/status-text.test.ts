import { describe, expect, it } from "vitest";
import { type GameState, type Settings, newGame } from "@/game/game-state";
import { at } from "@/game/test-boards";
import { modeText, statusNote, statusTitle } from "@/pages/play/status-text";

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "normal", firstPlayer: 1 };

function inPhase(settings: Settings, phase: GameState["phase"]): GameState {
  return { ...newGame(settings), phase };
}

// Spec section 6.4.2, item 2, and section 6.3, with the design's words.
describe("the status card's words", () => {
  it("gives the mode, and the level in a computer game (spec section 6.1.11, item 1)", () => {
    expect(modeText(twoPlayers)).toBe("Two players");
    expect(modeText(againstComputer)).toBe("Against the computer · Normal");
  });

  it("says whose turn it is, and what to do during a chain", () => {
    expect(statusTitle(newGame(twoPlayers))).toBe("Player 1's turn");
    expect(statusTitle(newGame(againstComputer))).toBe("Your turn");
    expect(
      statusTitle(inPhase(twoPlayers, { kind: "turn", selected: at(4, 3), chain: { start: at(6, 1), captured: [] } })),
    ).toBe("Jump again or end your turn");
  });

  it("says what the computer is doing, and the result", () => {
    expect(statusTitle(inPhase(againstComputer, { kind: "computerThinking", requestId: 1 }))).toBe(
      "The computer is thinking…",
    );
    expect(
      statusTitle(
        inPhase(againstComputer, {
          kind: "computerMoving",
          move: { from: at(2, 1), to: at(3, 0), captured: [], path: [at(3, 0)] },
          step: 0,
        }),
      ),
    ).toBe("The computer is moving");
    expect(statusTitle(inPhase(againstComputer, { kind: "computerFailed", requestId: 1 }))).toBe(
      "The computer couldn't move",
    );
    expect(statusTitle(inPhase(againstComputer, { kind: "over", result: { winner: 2, reason: "noMoves" } }))).toBe(
      "The computer wins",
    );
  });

  it("notes who moves first until the first turn ends, the reason for the result, and the failure", () => {
    expect(statusNote(newGame(twoPlayers))).toBe("Player 1 moves first.");
    expect(statusNote(newGame({ ...againstComputer, firstPlayer: 1 }))).toBe("You move first.");
    expect(statusNote({ ...newGame(twoPlayers), history: [newGame(twoPlayers).turnStart] })).toBe("");
    expect(statusNote(inPhase(twoPlayers, { kind: "over", result: { winner: 1, reason: "noPieces" } }))).toBe(
      "Player 2 has no pieces left.",
    );
    expect(statusNote(inPhase(againstComputer, { kind: "computerFailed", requestId: 1 }))).toBe(
      "Check your connection and try again.",
    );
  });
});
