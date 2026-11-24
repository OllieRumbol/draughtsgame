import type { GameState } from "@/game/game-state";
import styles from "./GameStatus.module.css";
import { modeText, statusNote, statusTitle } from "./status-text";

type GameStatusProps = {
  game: GameState;
};

// The status card (spec section 6.4.2, item 2), as the design shows it: the mode and level, whose turn it is or the
// result, and a short note. The live region says each change, so this card is not a live region itself.
export function GameStatus({ game }: GameStatusProps) {
  return (
    <div className={styles.status}>
      <p className={styles.mode}>{modeText(game.settings)}</p>
      <p className={styles.title}>{statusTitle(game)}</p>
      <p className={styles.note}>{statusNote(game)}</p>
    </div>
  );
}
