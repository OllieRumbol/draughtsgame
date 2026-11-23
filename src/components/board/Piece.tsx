import { type RefObject, useEffect, useLayoutEffect, useRef } from "react";
import { type Cell, type Position, CELL, isKing, ownerOf, samePosition } from "@/game/board";
import styles from "./Piece.module.css";
import { type Timings, captureFade, crowningLength } from "./timings";

// How a piece looks while a piece is selected (plan section 3.6, "How each board mark looks").
export type PieceLook = "resting" | "lifted" | "steppedBack";

type PieceProps = {
  id: number;
  cell: Cell;
  crowning: boolean; // a man that has become a king: drawn as a man until its crowning shows the crown
  position: Position;
  look: PieceLook;
  leaving: boolean; // captured: it fades and shrinks, then the board removes it
  slide: number; // how long its slide takes, or, for a captured piece, the jump that took it
  timings: Timings;
  onLanded: (id: number) => void; // its slide has ended
  onCrowned: (id: number) => void; // its crown has appeared
  onFaded: (id: number) => void; // its capture fade has ended
};

// The slide's easing, as in the design (docs/design/site.html).
const SLIDE_EASING = "cubic-bezier(.4,0,.2,1)";

// A sliding piece passes over the others, and a piece being crowned is above everything, as in the design.
const SLIDING_LAYER = 5;
const CROWNING_LAYER = 6;

// A turned piece with lathe rings. A king is two men stacked, with a brass band on the top man, so it differs from
// a man by shape and not by colour alone (spec section 6.4.2, item 6).
// The lift and the step-back are CSS transitions. The slide, the capture fade and the crowning use the Web Animations
// API (plan section 3.5, decision 6). They animate `translate`, `scale` and `opacity`, which add to the piece's own
// `transform`, so a king's offset and a lift stay as they are.
export function Piece(props: PieceProps) {
  const { id, cell, crowning, position, look, leaving, slide, timings, onLanded, onCrowned, onFaded } = props;
  const slotRef = useRef<HTMLDivElement>(null);
  const pieceRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const shown = useRef({ row: position.row, col: position.col });
  const fadeStarted = useRef(false);
  const removed = useRef(false);
  const { row, col } = position;

  // An animation that ends after the piece has gone must not call back to the board.
  useEffect(() => {
    removed.current = false;
    return () => {
      removed.current = true;
    };
  }, []);

  // A move or a jump: the piece slides from the square it stood on, above the other pieces. A jump grows to 116%
  // halfway. A man that reaches the far row is crowned when the slide ends (plan section 3.6, "Motion").
  useLayoutEffect(() => {
    const before = shown.current;
    shown.current = { row, col };
    const slot = slotRef.current;
    const piece = pieceRef.current;
    if (slot === null || piece === null || samePosition(before, { row, col }) || slide === 0) {
      return;
    }

    const sliding = slot.animate(
      [
        { left: percent(before.col), top: percent(before.row), zIndex: SLIDING_LAYER },
        { left: percent(col), top: percent(row), zIndex: SLIDING_LAYER },
      ],
      { duration: slide, easing: SLIDE_EASING },
    );
    if (Math.abs(row - before.row) === 2) {
      piece.animate([{ scale: "1" }, { scale: "1.16", offset: 0.5 }, { scale: "1" }], { duration: slide });
    }

    // A slide that is cut short still counts as landed, so the piece is never left lifted or uncrowned.
    const land = async (finishedNormally: boolean) => {
      if (removed.current) {
        return;
      }
      if (!crowning || !finishedNormally) {
        onLanded(id);
        if (crowning) {
          onCrowned(id);
        }
        return;
      }
      // The design puts the piece down at once when it lands, so the crowning's rise shows from the board.
      piece.style.transition = "none";
      onLanded(id);
      await nextFrame();
      await nextFrame();
      await crown(slot, piece, rippleRef.current, timings, () => !removed.current && onCrowned(id), removed);
      piece.style.transition = "";
    };
    sliding.finished.then(
      () => land(true),
      () => land(false),
    );
    return () => sliding.cancel();
  }, [row, col, crowning, slide, timings, id, onLanded, onCrowned]);

  // A captured piece fades and shrinks to 50% at its own jump, then the board removes it. It starts once, even if
  // the board draws the piece again while it fades.
  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!leaving || slot === null || fadeStarted.current) {
      return;
    }
    fadeStarted.current = true;
    const { delay, duration } = captureFade(timings, slide);
    const fading = slot.animate(
      [
        { opacity: 1, scale: "1" },
        { opacity: 0, scale: "0.5" },
      ],
      { delay, duration, fill: "forwards" },
    );
    fading.finished.then(
      () => !removed.current && onFaded(id),
      () => {},
    );
  }, [leaving, id, slide, timings, onFaded]);

  const drawn = crowning ? asMan(cell) : cell;
  const colour = ownerOf(drawn) === 1 ? styles.light : styles.dark;
  const kind = isKing(drawn) ? styles.king : "";
  const lookClass = look === "lifted" ? styles.lifted : look === "steppedBack" ? styles.steppedBack : "";

  // The lifted piece sits above its neighbours, so its shadow and its larger size are never covered.
  const slotClass = look === "lifted" ? `${styles.slot} ${styles.raised}` : styles.slot;

  return (
    <div ref={slotRef} className={slotClass} style={{ left: percent(col), top: percent(row) }}>
      <div
        ref={pieceRef}
        className={`${styles.piece} ${colour} ${kind} ${lookClass}`}
        data-piece={isKing(drawn) ? "king" : "man"}
        data-look={look}
      />
      <span ref={rippleRef} className={styles.ripple} />
    </div>
  );
}

function percent(index: number): string {
  return `${index * 12.5}%`;
}

// A king drawn as the man it was, until its crowning shows the crown.
function asMan(cell: Cell): Cell {
  if (cell === CELL.player1King) {
    return CELL.player1Man;
  }
  return cell === CELL.player2King ? CELL.player2Man : cell;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

// The crowning (plan section 3.6): the man rises and grows. The second man and the brass band appear, and one soft
// brass ripple spreads out. Then the piece settles back down with a small dip. It stays above the other pieces.
async function crown(
  slot: HTMLElement,
  piece: HTMLElement,
  ripple: HTMLElement | null,
  timings: Timings,
  showCrown: () => void,
  removed: RefObject<boolean>,
): Promise<void> {
  slot.animate([{ zIndex: CROWNING_LAYER }, { zIndex: CROWNING_LAYER }], { duration: crowningLength(timings) });
  const shadow = getComputedStyle(piece).getPropertyValue("--lift-shadow").trim();
  const raised = { translate: "0 -6px", scale: "1.12", filter: `drop-shadow(0 8px 4px ${shadow})` };

  const rise = piece.animate([{ translate: "0 0", scale: "1" }, raised], {
    duration: timings.crownRise,
    easing: "ease-out",
    fill: "forwards",
  });
  await rise.finished;
  if (removed.current) {
    return;
  }

  showCrown();
  ripple?.animate(
    [
      { opacity: 0.6, scale: "1" },
      { opacity: 0, scale: "1.6" },
    ],
    { duration: timings.crownRipple, easing: "ease-out" },
  );
  await new Promise((resolve) => setTimeout(resolve, timings.crownSettleStart));
  if (removed.current) {
    return;
  }

  const settle = piece.animate(
    [raised, { translate: "0 1px", scale: "0.98", offset: 0.8 }, { translate: "0 0", scale: "1", filter: "none" }],
    { duration: timings.crownSettle, easing: "ease-in-out" },
  );
  rise.cancel();
  await settle.finished;
}
