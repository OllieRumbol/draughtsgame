import { useReducer } from "react";
import { Board } from "@/components/board/Board";
import { CapturedStack } from "@/components/board/CapturedStack";
import { type Settings, gameReducer, newGame } from "@/game/game-state";
import styles from "./PlayPage.module.css";

// The old web app's defaults (spec section 6.1.1, item 2).
const DEFAULT_SETTINGS: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };

// The game screen, laid out as the design shows. T14 adds game setup, the status, the controls and saving.
// Until then a two-player game starts here, so the board can be played and seen.
export function PlayPage() {
  const [game, dispatch] = useReducer(gameReducer, DEFAULT_SETTINGS, newGame);

  return (
    <>
      <title>Draughts</title>
      <h1 className="visually-hidden">Play</h1>
      <div className={styles.game}>
        <div className={styles.topStack}>
          <CapturedStack count={game.capturedBy[2]} menOf={1} label="Player 2 took" />
        </div>
        <div className={styles.board}>
          <Board state={game} dispatch={dispatch} tips={[]} />
        </div>
        <div className={styles.bottomStack}>
          <CapturedStack count={game.capturedBy[1]} menOf={2} label="Player 1 took" />
        </div>
        <div className={styles.panel}>
          <p className={styles.placeholder}>The game status and the controls come in T14.</p>
        </div>
      </div>
    </>
  );
}
