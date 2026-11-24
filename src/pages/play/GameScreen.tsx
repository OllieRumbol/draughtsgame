import { useEffect, useRef } from "react";
import { Board } from "@/components/board/Board";
import { CapturedStack } from "@/components/board/CapturedStack";
import { gameStarted } from "@/components/live-region/announcement";
import type { GameState } from "@/game/game-state";
import { GameControls } from "./GameControls";
import styles from "./GameScreen.module.css";
import { GameStatus } from "./GameStatus";
import type { Arrival, PlayAction } from "./play-state";

type GameScreenProps = {
  game: GameState;
  dispatch: (action: PlayAction) => void;
  arrival: Arrival;
};

// The game screen (spec section 6.4.2, item 2), laid out as the design shows. On desktop: the captured men, the
// board, then the status and the controls. On a phone: the status, the captured men above and below the board,
// then the controls.
export function GameScreen({ game, dispatch, arrival }: GameScreenProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const started = arrival === "started";
  const againstComputer = game.settings.opponent === "computer";

  // Start game removes the setup screen, so the focus goes to the board's first square, ready to play.
  useEffect(() => {
    if (started) {
      focusTabStop(boardRef.current);
    }
  }, [started]);

  return (
    <div className={styles.game}>
      <h1 className="visually-hidden">Play</h1>
      <div className={styles.topStack}>
        <CapturedStack
          count={game.capturedBy[2]}
          menOf={1}
          label={againstComputer ? "The computer took" : "Player 2 took"}
        />
      </div>
      <div className={styles.board} ref={boardRef}>
        <Board state={game} dispatch={dispatch} tips={[]} opening={started ? gameStarted(game.settings) : undefined} />
      </div>
      <div className={styles.bottomStack}>
        <CapturedStack count={game.capturedBy[1]} menOf={2} label={againstComputer ? "You took" : "Player 1 took"} />
      </div>
      <div className={styles.side}>
        <div className={styles.status}>
          <GameStatus game={game} />
        </div>
        <div className={styles.controls}>
          <GameControls game={game} dispatch={dispatch} onFocusBoard={() => focusTabStop(boardRef.current)} />
        </div>
      </div>
    </div>
  );
}

// Puts the focus on the board's one square that Tab reaches (plan section 3.3.6).
function focusTabStop(board: HTMLElement | null): void {
  board?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus();
}
