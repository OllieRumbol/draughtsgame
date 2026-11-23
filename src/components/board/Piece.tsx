import { type Cell, type Position, isKing, ownerOf } from "@/game/board";
import styles from "./Piece.module.css";

// How a piece looks while a piece is selected (plan section 3.6, "How each board mark looks").
export type PieceLook = "resting" | "lifted" | "steppedBack";

type PieceProps = {
  cell: Cell;
  position: Position;
  look: PieceLook;
};

// A turned piece with lathe rings. A king is two men stacked, with a brass band on the top man, so it differs from
// a man by shape and not by colour alone (spec section 6.4.2, item 6). It sits in the layer above the squares,
// so T12 can slide it from square to square.
export function Piece({ cell, position, look }: PieceProps) {
  const colour = ownerOf(cell) === 1 ? styles.light : styles.dark;
  const kind = isKing(cell) ? styles.king : "";
  const lookClass = look === "lifted" ? styles.lifted : look === "steppedBack" ? styles.steppedBack : "";

  return (
    <div className={styles.slot} style={{ left: `${position.col * 12.5}%`, top: `${position.row * 12.5}%` }}>
      <div
        className={`${styles.piece} ${colour} ${kind} ${lookClass}`}
        data-piece={isKing(cell) ? "king" : "man"}
        data-look={look}
      />
    </div>
  );
}
