// Loads the saved game on start, and saves the game at each save point (spec section 6.1.8, plan section 3.4).
import { useEffect } from "react";
import type { GameState } from "@/game/game-state";
import { parseSavedGame, toSavedGame } from "@/game/saved-game";
import { SAVED_GAME_KEY, readItem, removeItem, writeItem } from "@/services/storage";

// The saved game, or null when there is none. Saved data that fails a check is removed, and game setup
// is shown with no error (spec section 6.1.8, item 5). For the reducer's starting state.
export function loadSavedGame(): GameState | null {
  const text = readItem(SAVED_GAME_KEY);
  if (text === null) {
    return null;
  }

  const game = parseSavedGame(text);
  if (game === null) {
    removeItem(SAVED_GAME_KEY);
  }
  return game;
}

// Saves the game whenever its saved form changes, so the saves fall at the save points in plan section 3.4:
// Start game, the end of every turn, Undo, Give up, a failed computer move and Try again. A selection and
// a computer jump being shown leave the saved form as it was, so they write nothing.
// null is game setup: New game clears the saved game (spec section 6.1.8, item 4).
export function useSavedGame(game: GameState | null): void {
  const savedText = game === null ? null : JSON.stringify(toSavedGame(game));
  const isInChain = game !== null && game.phase.kind === "turn" && game.phase.chain !== null;

  useEffect(() => {
    // A step inside a chain is not a save point either. The person's first jump clears the mark on the
    // computer's last move, which changes the saved form, so the save from the start of the turn is kept here.
    if (isInChain) {
      return;
    }

    if (savedText === null) {
      removeItem(SAVED_GAME_KEY);
    } else {
      writeItem(SAVED_GAME_KEY, savedText);
    }
  }, [savedText, isInChain]);
}
