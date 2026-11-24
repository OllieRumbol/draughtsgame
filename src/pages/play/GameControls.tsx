import { useRef } from "react";
import { type GameState, canUndo } from "@/game/game-state";
import buttons from "@/styles/buttons.module.css";
import styles from "./GameControls.module.css";
import type { PlayAction } from "./play-state";

type GameControlsProps = {
  game: GameState;
  dispatch: (action: PlayAction) => void;
  onFocusBoard: () => void; // puts the focus on the board's square that Tab reaches
};

// The controls (spec section 6.4.2, item 2), as the design shows them. During a chain, End turn comes first and is
// the main action (spec section 6.1.3). When the game is over, only Undo and New game are left (spec section 6.1.6,
// item 3). Show tips comes in T16.
export function GameControls({ game, dispatch, onFocusBoard }: GameControlsProps) {
  const isOver = game.phase.kind === "over";
  const isInChain = game.phase.kind === "turn" && game.phase.chain !== null;
  const undoAvailable = canUndo(game);
  const newGameRef = useRef<HTMLButtonElement>(null);

  // Undo stays in place when it is not available, and says so, rather than going away (spec section 6.1.7, item 6).
  // After Give up it stays too, shown as not available, as the design shows.
  function undo(): void {
    if (undoAvailable) {
      dispatch({ type: "undo" });
    }
  }

  // End turn and Give up go away once they are used, so the focus moves to what comes next and is never lost
  // (spec section 6.4.3, item 4): the board for the next player, or New game for the result.
  function endTurn(): void {
    dispatch({ type: "endTurn" });
    onFocusBoard();
  }

  function giveUp(): void {
    dispatch({ type: "giveUp" });
    newGameRef.current?.focus();
  }

  return (
    <div className={styles.controls}>
      {isInChain && (
        <button type="button" className={`${buttons.primary} ${styles.control} ${styles.wide}`} onClick={endTurn}>
          End turn
        </button>
      )}
      <button
        type="button"
        className={`${buttons.secondary} ${styles.control}`}
        aria-disabled={!undoAvailable}
        onClick={undo}
      >
        Undo
      </button>
      {!isOver && (
        <button type="button" className={`${buttons.secondary} ${styles.control}`} onClick={giveUp}>
          Give up
        </button>
      )}
      <button
        ref={newGameRef}
        type="button"
        className={`${isInChain ? buttons.secondary : buttons.primary} ${styles.control}`}
        onClick={() => dispatch({ type: "newGame" })}
      >
        New game
      </button>
    </div>
  );
}
