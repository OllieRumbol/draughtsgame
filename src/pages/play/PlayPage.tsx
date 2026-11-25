import { useReducer } from "react";
import { loadSavedGame, useSavedGame } from "@/hooks/useSavedGame";
import { GameScreen } from "./GameScreen";
import { GameSetup } from "./GameSetup";
import { openPlay, playReducer } from "./play-state";

// The Play page (spec section 6.4.2): game setup, or the game. It opens the saved game when there is one, so a
// refresh or a visit to another page keeps the game (spec section 6.1.8, items 2 and 7). The game is saved at each
// save point, and New game clears it (plan section 3.4).
export function PlayPage() {
  const [play, dispatch] = useReducer(playReducer, null, () => openPlay(loadSavedGame()));
  useSavedGame(play.game);

  // data-page lets the page frame grow to fit the board (Layout.module.css, plan section 3.6, "Page size").
  return (
    <div data-page="play">
      <title>Draughts</title>
      {play.game === null ? (
        <GameSetup
          onStart={(settings) => dispatch({ type: "start", settings })}
          focusHeading={play.arrival === "closed"}
        />
      ) : (
        <GameScreen game={play.game} dispatch={dispatch} arrival={play.arrival} />
      )}
    </div>
  );
}
