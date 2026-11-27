// The words in the game screen's status card (spec section 6.4.2, item 2), as the design shows them: the mode,
// then a title that says whose turn it is, that the computer is thinking, or the result, then a short note.
import { firstMove, lastMove, resultReason, resultTitle } from "@/components/live-region/announcement";
import type { Player } from "@/game/board";
import type { GameState, Settings } from "@/game/game-state";

// When Show tips fails (spec section 6.1.4, item 4, and plan section 4).
export const TIPS_FAILED = "Tips aren't available right now.";

const LEVEL_NAMES: Record<Settings["level"], string> = { easy: "Easy", normal: "Normal", hard: "Hard" };

// "Two players", or "Against the computer · Hard" (spec section 6.4.2, item 2: the mode, and the level).
export function modeText(settings: Settings): string {
  if (settings.opponent === "computer") {
    return `Against the computer · ${levelName(settings.level)}`;
  }
  return "Two players";
}

// Spec section 6.1.11, item 1: "Easy", "Normal" and "Hard".
export function levelName(level: Settings["level"]): string {
  return LEVEL_NAMES[level];
}

export function statusTitle(game: GameState): string {
  const phase = game.phase;
  switch (phase.kind) {
    case "turn":
      if (phase.chain !== null) {
        return "Jump again or end your turn";
      }
      return game.settings.opponent === "computer" ? "Your turn" : `Player ${game.toMove}'s turn`;
    case "computerThinking":
      return "The computer is thinking…";
    case "computerMoving":
      return "The computer is moving";
    case "computerFailed":
      return "The computer couldn't move";
    case "over":
      return resultTitle(game.settings, phase.result);
  }
}

// The note under the title (spec section 6.4.2, item 2): the reason for the result; what to do after a failure;
// the last move; or who moves first, until the first turn ends.
export function statusNote(game: GameState): string {
  const phase = game.phase;
  if (phase.kind === "over") {
    return resultReason(game.settings, phase.result);
  }
  if (phase.kind === "computerFailed") {
    return "Check your connection and try again.";
  }
  const move = lastMove(game);
  if (move !== null) {
    return move;
  }
  if (game.history.length === 0 && phase.kind === "turn") {
    return firstMove(game.settings, game.toMove);
  }
  return "";
}

// The small picture before the title (plan section 3.6, "Status mark"): a man in the colour of the player who moves,
// or the brass crown when a player has won. Every game that is over has a winner, because there is no tie.
export type StatusMark = { kind: "man"; player: Player } | { kind: "crown" };

export function statusMark(game: GameState): StatusMark {
  if (game.phase.kind === "over") {
    return { kind: "crown" };
  }
  return { kind: "man", player: game.toMove };
}
