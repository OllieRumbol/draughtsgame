import type { Player } from "@/game/board";
import styles from "./ManIcon.module.css";

type ManIconProps = {
  player: Player;
  size: number;
};

// A small man in a player's colour, with the lathe rings of the board's men (plan section 3.6, "Status mark").
// It is decoration, so it is hidden from screen readers: the words beside it say whose turn it is.
export function ManIcon({ player, size }: ManIconProps) {
  const colour = player === 1 ? styles.light : styles.dark;
  return (
    <svg className={`${styles.man} ${colour}`} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <circle className={styles.body} cx="10" cy="10" r="9" />
      <circle className={styles.ring} cx="10" cy="10" r="5.5" />
      <circle className={styles.ring} cx="10" cy="10" r="2.5" />
    </svg>
  );
}
