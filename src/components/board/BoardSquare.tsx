import styles from "./BoardSquare.module.css";

type BoardSquareProps = {
  isDark: boolean;
  name: string;
  isTarget: boolean;
  isTip: boolean;
  isLastMove: boolean;
  isFocusStop: boolean; // the one square of the board that Tab reaches (plan section 3.3.6)
  onChoose: (byKeyboard: boolean) => void;
  onFocus: () => void;
};

// One square of the board, with its marks (plan section 3.6, "How each board mark looks"). Each mark looks
// different, so a tip and a target can show on the same square (spec section 6.6, item 12).
// It is a button, so Enter and Space choose it as a click does. A click from a key press has a click count
// (`detail`) of 0, which tells the board it came from the keyboard.
export function BoardSquare(props: BoardSquareProps) {
  const { isDark, name, isTarget, isTip, isLastMove, isFocusStop, onChoose, onFocus } = props;

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={name}
      tabIndex={isFocusStop ? 0 : -1}
      className={`${styles.square} ${isDark ? styles.dark : styles.light}`}
      onClick={(event) => onChoose(event.detail === 0)}
      onFocus={onFocus}
    >
      {isLastMove && <span className={styles.lastMove} data-testid="last-move" />}
      {isTip && <span className={styles.tip} data-testid="tip" />}
      {isTarget && <span className={styles.target} data-testid="target" />}
    </button>
  );
}
