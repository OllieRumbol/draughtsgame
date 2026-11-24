// The Play page shows game setup or a game (spec section 6.4.2). This reducer wraps the game reducer with the two
// changes between them: Start game, and New game.
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";

// The old web app's defaults (spec section 6.1.1, item 2).
export const DEFAULT_SETTINGS: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };

// How the screen came to show: a saved game on opening the page, Start game, or New game. A screen that the player
// opened moves the focus to itself, and a started game says so in the live region.
export type Arrival = "opened" | "started" | "closed";

export type PlayState = {
  game: GameState | null; // null is game setup
  arrival: Arrival;
};

export type PlayAction = { type: "start"; settings: Settings } | { type: "newGame" } | Action;

// The saved game, or game setup when there is none (spec section 6.1.8, item 2).
export function openPlay(saved: GameState | null): PlayState {
  return { game: saved, arrival: "opened" };
}

export function playReducer(state: PlayState, action: PlayAction): PlayState {
  switch (action.type) {
    case "start":
      // The starting board, with the chosen first player to move (spec section 6.1.1, item 4).
      return { game: newGame(action.settings), arrival: "started" };
    case "newGame":
      // Game setup. useSavedGame clears the saved game (spec section 6.1.8, item 4).
      return { game: null, arrival: "closed" };
    default: {
      if (state.game === null) {
        return state;
      }
      const game = gameReducer(state.game, action);
      return game === state.game ? state : { ...state, game };
    }
  }
}
