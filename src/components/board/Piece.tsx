import { useLayoutEffect, useRef } from "react";
import { type Cell, type Position, isKing, ownerOf, samePosition } from "@/game/board";
import styles from "./Piece.module.css";
import { type Timings, captureFade } from "./timings";

// How a piece looks while a piece is selected (plan section 3.6, "How each board mark looks").
export type PieceLook = "resting" | "lifted" | "steppedBack";

type PieceProps = {
  id: number;
  cell: Cell;
  position: Position;
  look: PieceLook;
  leaving: boolean; // captured: it fades and shrinks, then the board removes it
  slide: number; // how long its slide takes, or, for a captured piece, the jump that took it
  timings: Timings;
  onLanded: (id: number) => void; // its slide has ended
  onFaded: (id: number) => void; // its capture fade has ended
};

// The slide's easing, as in the design (docs/design/site.html).
const SLIDE_EASING = "cubic-bezier(.4,0,.2,1)";

// A turned piece with lathe rings. A king is two men stacked, with a brass band on the top man, so it differs from
// a man by shape and not by colour alone (spec section 6.4.2, item 6).
// The lift and the step-back are CSS transitions. The slide, the capture fade and the crowning use the Web Animations
// API (plan section 3.5, decision 6). They animate `translate`, `scale` and `opacity`, which add to the piece's own
// `transform`, so a king's offset and a lift stay as they are.
export function Piece({ id, cell, position, look, leaving, slide, timings, onLanded, onFaded }: PieceProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const pieceRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const shown = useRef({ row: position.row, col: position.col, cell });
  const { row, col } = position;

  // A move or a jump: the piece slides from the square it stood on. A jump grows to 116% halfway, and a man that
  // reaches the far row is crowned when the slide ends (plan section 3.6, "Motion").
  useLayoutEffect(() => {
    const before = shown.current;
    shown.current = { row, col, cell };
    const slot = slotRef.current;
    const piece = pieceRef.current;
    if (slot === null || piece === null || samePosition(before, { row, col }) || slide === 0) {
      return;
    }

    const sliding = slot.animate(
      [
        { left: percent(before.col), top: percent(before.row) },
        { left: percent(col), top: percent(row) },
      ],
      { duration: slide, easing: SLIDE_EASING },
    );
    if (Math.abs(row - before.row) === 2) {
      piece.animate([{ scale: "1" }, { scale: "1.16", offset: 0.5 }, { scale: "1" }], { duration: slide });
    }
    sliding.finished
      .then(() => {
        onLanded(id);
        if (!isKing(before.cell) && isKing(cell)) {
          return crown(piece, rippleRef.current, timings);
        }
      })
      .catch(() => {});
  }, [row, col, cell, slide, timings, id, onLanded]);

  // A captured piece fades and shrinks to 50% at its own jump, then the board removes it.
  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!leaving || slot === null) {
      return;
    }
    const { delay, duration } = captureFade(timings, slide);
    const fading = slot.animate(
      [
        { opacity: 1, scale: "1" },
        { opacity: 0, scale: "0.5" },
      ],
      { delay, duration, fill: "forwards" },
    );
    fading.finished.then(() => onFaded(id)).catch(() => {});
  }, [leaving, id, slide, timings, onFaded]);

  const colour = ownerOf(cell) === 1 ? styles.light : styles.dark;
  const kind = isKing(cell) ? styles.king : "";
  const lookClass = look === "lifted" ? styles.lifted : look === "steppedBack" ? styles.steppedBack : "";

  // The lifted piece sits above its neighbours, so its shadow and its larger size are never covered.
  const slotClass = look === "lifted" ? `${styles.slot} ${styles.raised}` : styles.slot;

  return (
    <div ref={slotRef} className={slotClass} style={{ left: percent(col), top: percent(row) }}>
      <div
        ref={pieceRef}
        className={`${styles.piece} ${colour} ${kind} ${lookClass}`}
        data-piece={isKing(cell) ? "king" : "man"}
        data-look={look}
      />
      <span ref={rippleRef} className={styles.ripple} />
    </div>
  );
}

function percent(index: number): string {
  return `${index * 12.5}%`;
}

// The crowning (plan section 3.6): the piece rises and grows, one soft brass ripple spreads out, then the piece
// settles back down with a small dip. The new king's second man and brass band are already drawn.
async function crown(piece: HTMLElement, ripple: HTMLElement | null, timings: Timings): Promise<void> {
  if (timings.crownRise === 0) {
    return;
  }
  const shadow = getComputedStyle(piece).getPropertyValue("--lift-shadow").trim();
  const raised = { translate: "0 -6px", scale: "1.12", filter: `drop-shadow(0 8px 4px ${shadow})` };

  const rise = piece.animate([{ translate: "0 0", scale: "1" }, raised], {
    duration: timings.crownRise,
    easing: "ease-out",
    fill: "forwards",
  });
  await rise.finished;

  ripple?.animate(
    [
      { opacity: 0.6, scale: "1" },
      { opacity: 0, scale: "1.6" },
    ],
    { duration: timings.crownRipple, easing: "ease-out" },
  );
  await new Promise((resolve) => setTimeout(resolve, timings.crownSettleStart));

  const settle = piece.animate(
    [raised, { translate: "0 1px", scale: "0.98", offset: 0.8 }, { translate: "0 0", scale: "1", filter: "none" }],
    { duration: timings.crownSettle, easing: "ease-in-out" },
  );
  rise.cancel();
  await settle.finished;
}
