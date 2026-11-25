import { useRef } from "react";
import { type GameState, canUndo } from "@/game/game-state";
import type { Tips } from "@/hooks/useTips";
import buttons from "@/styles/buttons.module.css";
import styles from "./GameControls.module.css";
import type { PlayAction } from "./play-state";
import { TIPS_FAILED } from "./status-text";

type GameControlsProps = {
  game: GameState;
  dispatch: (action: PlayAction) => void;
  onFocusBoard: () => void; // puts the focus on the board's square that Tab reaches
  tips: Tips;
};

// The controls (spec section 6.4.2, item 2), as the design shows them. During a chain, End turn comes first and is
// the main action (spec section 6.1.3). When the computer's move has failed, Try again comes first and is the main
// action (spec section 6.1.9); Undo, Give up and New game still work. When the game is over, only Undo and New game
// are left (spec section 6.1.6, item 3).
// Show tips comes before Undo, as in the design. It is pressed while the tips load or show, and not available outside
// the person's turn or during a chain (spec section 6.1.4). A failure shows a note directly under it (plan section 4).
export function GameControls({ game, dispatch, onFocusBoard, tips }: GameControlsProps) {
  const isOver = game.phase.kind === "over";
  const isInChain = game.phase.kind === "turn" && game.phase.chain !== null;
  const hasFailed = game.phase.kind === "computerFailed";
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

  // Try again sends the same request again (spec section 6.1.9, item 2). It goes away, so the focus goes to the
  // board, where the person plays once the computer has moved.
  function tryAgain(): void {
    dispatch({ type: "retry" });
    onFocusBoard();
  }

  function giveUp(): void {
    dispatch({ type: "giveUp" });
    newGameRef.current?.focus();
  }

  return (
    <div className={styles.controls}>
      {hasFailed && (
        <button type="button" className={`${buttons.primary} ${styles.control} ${styles.wide}`} onClick={tryAgain}>
          Try again
        </button>
      )}
      {isInChain && (
        <button type="button" className={`${buttons.primary} ${styles.control} ${styles.wide}`} onClick={endTurn}>
          End turn
        </button>
      )}
      {!isOver && (
        <button
          type="button"
          className={`${buttons.secondary} ${styles.control}`}
          aria-pressed={tips.status === "loading" || tips.status === "shown"}
          aria-disabled={!tips.available}
          aria-busy={tips.status === "loading"}
          onClick={tips.toggle}
        >
          {tips.status === "loading" ? "Loading tips…" : "Show tips"}
        </button>
      )}
      {!isOver && tips.status === "failed" && <p className={styles.note}>{TIPS_FAILED}</p>}
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
        className={`${isInChain || hasFailed ? buttons.secondary : buttons.primary} ${styles.control}`}
        onClick={() => dispatch({ type: "newGame" })}
      >
        New game
      </button>
    </div>
  );
}
