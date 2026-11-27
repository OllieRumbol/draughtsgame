import { CrownIcon } from "@/components/board/CrownIcon";
import { ManIcon } from "@/components/board/ManIcon";
import type { GameState } from "@/game/game-state";
import styles from "./GameStatus.module.css";
import { modeText, statusMark, statusNote, statusTitle, type StatusMark } from "./status-text";

type GameStatusProps = {
  game: GameState;
};

// The status card (spec section 6.4.2, item 2), as the design shows it: the mode and level, whose turn it is or the
// result, and a short note. The live region says each change, so this card is not a live region itself.
export function GameStatus({ game }: GameStatusProps) {
  return (
    <div className={styles.status}>
      <p className={styles.mode}>{modeText(game.settings)}</p>
      <p className={styles.title}>
        <TitleMark mark={statusMark(game)} />
        <span>{statusTitle(game)}</span>
      </p>
      <p className={styles.note}>{statusNote(game)}</p>
    </div>
  );
}

type TitleMarkProps = {
  mark: StatusMark;
};

// The picture before the title (plan section 3.6, "Status mark"). Both pictures are hidden from screen readers.
function TitleMark({ mark }: TitleMarkProps) {
  if (mark.kind === "crown") {
    return (
      <span className={`${styles.mark} ${styles.crown}`}>
        <CrownIcon size={20} />
      </span>
    );
  }
  return (
    <span className={styles.mark}>
      <ManIcon player={mark.player} size={16} />
    </span>
  );
}
