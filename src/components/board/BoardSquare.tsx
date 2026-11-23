import styles from "./BoardSquare.module.css";

type BoardSquareProps = {
  isDark: boolean;
  name: string;
  isTarget: boolean;
  isTip: boolean;
  isLastMove: boolean;
  onChoose: () => void;
};

// One square of the board, with its marks (plan section 3.6, "How each board mark looks"). Each mark looks
// different, so a tip and a target can show on the same square (spec section 6.6, item 12).
// A light square does nothing when chosen (plan section 3.3.6). T13 adds the keyboard, with one roving tabindex.
export function BoardSquare({ isDark, name, isTarget, isTip, isLastMove, onChoose }: BoardSquareProps) {
  return (
    <button
      type="button"
      role="gridcell"
      aria-label={name}
      tabIndex={-1}
      className={`${styles.square} ${isDark ? styles.dark : styles.light}`}
      onClick={isDark ? onChoose : undefined}
    >
      {isLastMove && <span className={styles.lastMove} data-testid="last-move" />}
      {isTip && <span className={styles.tip} data-testid="tip" />}
      {isTarget && <span className={styles.target} data-testid="target" />}
    </button>
  );
}
