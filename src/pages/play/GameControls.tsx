import { type GameState, canUndo } from "@/game/game-state";
import buttons from "@/styles/buttons.module.css";
import styles from "./GameControls.module.css";
import type { PlayAction } from "./play-state";

type GameControlsProps = {
  game: GameState;
  dispatch: (action: PlayAction) => void;
};

// The controls (spec section 6.4.2, item 2), as the design shows them. During a chain, End turn comes first and is
// the main action (spec section 6.1.3). When the game is over, only Undo and New game are left (spec section 6.1.6,
// item 3). Show tips comes in T16.
export function GameControls({ game, dispatch }: GameControlsProps) {
  const isOver = game.phase.kind === "over";
  const isInChain = game.phase.kind === "turn" && game.phase.chain !== null;
  const undoAvailable = canUndo(game);

  // Undo stays in place when it is not available, and says so, rather than going away (spec section 6.1.7, item 6).
  function undo(): void {
    if (undoAvailable) {
      dispatch({ type: "undo" });
    }
  }

  return (
    <div className={styles.controls}>
      {isInChain && (
        <button
          type="button"
          className={`${buttons.primary} ${styles.control} ${styles.wide}`}
          onClick={() => dispatch({ type: "endTurn" })}
        >
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
        <button
          type="button"
          className={`${buttons.secondary} ${styles.control}`}
          onClick={() => dispatch({ type: "giveUp" })}
        >
          Give up
        </button>
      )}
      <button
        type="button"
        className={`${isInChain ? buttons.secondary : buttons.primary} ${styles.control}`}
        onClick={() => dispatch({ type: "newGame" })}
      >
        New game
      </button>
    </div>
  );
}
