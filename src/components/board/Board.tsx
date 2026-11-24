import { type CSSProperties, type KeyboardEvent, useRef, useState } from "react";
import { LiveRegion } from "@/components/live-region/LiveRegion";
import { type Position, BOARD_SIZE, cellAt, isDarkSquare, isOnBoard, ownerOf, samePosition } from "@/game/board";
import type { Action, GameState } from "@/game/game-state";
import { nextSteps } from "@/game/rules";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Board.module.css";
import { BoardSquare } from "./BoardSquare";
import { CrownIcon } from "./CrownIcon";
import { type PieceLook, Piece } from "./Piece";
import { squareName } from "./square-name";
import { timingsFor } from "./timings";
import { type TrackedPiece, crowned, landed, startTracking, trackNext, withoutPiece } from "./tracked-pieces";

type BoardProps = {
  state: GameState;
  dispatch: (action: Action) => void;
  tips: Position[]; // from useTips (T16)
};

const INDEXES = Array.from({ length: BOARD_SIZE }, (_, index) => index);

// Each arrow key moves the focus one square (plan section 3.3.6).
const ARROWS: Record<string, Position> = {
  ArrowUp: { row: -1, col: 0 },
  ArrowDown: { row: 1, col: 0 },
  ArrowLeft: { row: 0, col: -1 },
  ArrowRight: { row: 0, col: 1 },
};

// The square that Tab first reaches: the bottom row's first man, as in the design.
const FIRST_FOCUS: Position = { row: 5, col: 0 };

// The family board (plan section 3.6): wood grain on every square, a walnut frame with a brass inlay, and
// "For Ernest" with a crown in the bottom edge. The squares take the clicks. The pieces sit in a layer above them.
// The board follows the ARIA grid pattern (plan section 3.3.6): one square at a time can be reached with Tab,
// the arrow keys move between all 64 squares, Enter or Space act on a square, and Escape puts the piece down.
// A live region says what each change in the game did (spec section 6.4.3, item 3).
export function Board({ state, dispatch, tips }: BoardProps) {
  const timings = timingsFor(usePrefersReducedMotion());
  const gridRef = useRef<HTMLDivElement>(null);

  // The one square that Tab reaches. It follows the focus, so Tab comes back to the last square used.
  const [focusAt, setFocusAt] = useState(FIRST_FOCUS);

  // The square the player last chose, so the live region can tell putting the piece down from other clicks.
  const [chosen, setChosen] = useState<Position | null>(null);

  // Each piece keeps its id while it moves, so it can slide (tracked-pieces.ts). When the game state changes,
  // the pieces are worked out again during this render, as React's guide on adjusting state to new props shows.
  const [tracked, setTracked] = useState(() => startTracking(state));
  let pieces = tracked.pieces;
  if (tracked.state !== state) {
    const next = trackNext(tracked, state, timings.personSlide > 0);
    setTracked(next);
    pieces = next.pieces;
  }

  function removePiece(id: number): void {
    setTracked((current) => withoutPiece(current, id));
  }

  function putDown(id: number): void {
    setTracked((current) => landed(current, id));
  }

  function showCrown(id: number): void {
    setTracked((current) => crowned(current, id));
  }

  // The person's piece stays lifted while it slides, as the design shows. With reduced motion it is never carried.
  function lookOf(piece: TrackedPiece): PieceLook {
    if (piece.leaving) {
      return "resting";
    }
    if (piece.carried) {
      return "lifted";
    }
    return pieceLook(piece.position);
  }

  // The CSS transitions read their durations from timings.ts through these properties.
  const motion = {
    "--lift-ms": `${timings.lift}ms`,
    "--step-back-ms": `${timings.stepBack}ms`,
    "--target-fade-ms": `${timings.targetFade}ms`,
  } as CSSProperties;

  const selected = state.phase.kind === "turn" ? state.phase.selected : null;
  const chain = state.phase.kind === "turn" ? state.phase.chain : null;

  // The selected piece's targets come from the web app's own rules (spec section 6.1.2, item 2).
  const targets = selected ? nextSteps(state.board, selected, chain).map((step) => step.to) : [];
  const lastMove = state.lastComputerMove;

  function isIn(list: Position[], position: Position): boolean {
    return list.some((item) => samePosition(item, position));
  }

  // The reducer treats a square that is not a target as a plain click, so one action covers every square.
  // A click while the person's piece slides is ignored, as in the design, so the next jump starts from where it lands.
  // Enter or Space on a light square does nothing (plan section 3.3.6). A click on one clears the selection
  // (spec section 6.1.2, item 5).
  function choose(position: Position, byKeyboard: boolean): void {
    if (pieces.some((piece) => piece.carried)) {
      return;
    }
    if (byKeyboard && !isDarkSquare(position)) {
      return;
    }
    setChosen(position);
    dispatch({ type: "chooseTarget", at: position });
  }

  // Enter and Space reach the squares as clicks, because each square is a button.
  function onGridKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === "Escape") {
      // Choosing the selected piece again puts it down. During a chain the reducer ignores it.
      if (selected !== null) {
        dispatch({ type: "select", at: selected });
      }
      return;
    }

    // An arrow with Alt, Ctrl, Shift or the Windows key is left to the browser, such as Alt+Left to go back.
    const move = ARROWS[event.key];
    if (move === undefined || event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) {
      return;
    }
    // The arrow keys move the focus and not the page. They stop at the edge of the board.
    event.preventDefault();
    const next = { row: focusAt.row + move.row, col: focusAt.col + move.col };
    if (isOnBoard(next)) {
      squareAt(next)?.focus();
    }
  }

  function squareAt(position: Position): HTMLElement | null {
    const row = gridRef.current?.children[position.row];
    return (row?.children[position.col] as HTMLElement | undefined) ?? null;
  }

  function pieceLook(position: Position): PieceLook {
    if (selected === null) {
      return "resting";
    }
    if (samePosition(selected, position)) {
      return "lifted";
    }
    return ownerOf(cellAt(state.board, position)) === state.toMove ? "steppedBack" : "resting";
  }

  return (
    <div className={styles.frame} style={motion}>
      <div className={styles.inlay}>
        <div className={styles.board}>
          <div ref={gridRef} role="grid" aria-label="Draughts board" className={styles.grid} onKeyDown={onGridKey}>
            {INDEXES.map((row) => (
              <div role="row" key={row} className={styles.row}>
                {INDEXES.map((col) => {
                  const position = { row, col };
                  const isTarget = isIn(targets, position);
                  const isSelected = selected !== null && samePosition(selected, position);
                  return (
                    <BoardSquare
                      key={col}
                      isDark={isDarkSquare(position)}
                      name={squareName({
                        position,
                        cell: cellAt(state.board, position),
                        opponent: state.settings.opponent,
                        isTarget,
                        isSelected,
                      })}
                      isTarget={isTarget}
                      isTip={isIn(tips, position)}
                      isLastMove={lastMove !== null && isIn([lastMove.from, lastMove.to], position)}
                      isFocusStop={samePosition(focusAt, position)}
                      onChoose={(byKeyboard) => choose(position, byKeyboard)}
                      onFocus={() => setFocusAt(position)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className={styles.pieces} aria-hidden="true">
            {pieces.map((piece) => (
              <Piece
                key={piece.id}
                id={piece.id}
                cell={piece.cell}
                crowning={piece.crowning}
                position={piece.position}
                look={lookOf(piece)}
                leaving={piece.leaving}
                slide={piece.mover === "computer" ? timings.computerSlide : timings.personSlide}
                timings={timings}
                onLanded={putDown}
                onCrowned={showCrown}
                onFaded={removePiece}
              />
            ))}
          </div>
        </div>
      </div>
      <p className={styles.mark} aria-hidden="true">
        <CrownIcon size={14} />
        For Ernest
      </p>
      <LiveRegion state={state} chosen={chosen} />
    </div>
  );
}
