import { type CSSProperties, useState } from "react";
import { type Position, BOARD_SIZE, cellAt, isDarkSquare, ownerOf, samePosition } from "@/game/board";
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

// The family board (plan section 3.6): wood grain on every square, a walnut frame with a brass inlay, and
// "For Ernest" with a crown in the bottom edge. The squares take the clicks. The pieces sit in a layer above them.
// The board follows the ARIA grid pattern (plan section 3.3.6). T13 adds its keyboard use.
export function Board({ state, dispatch, tips }: BoardProps) {
  const timings = timingsFor(usePrefersReducedMotion());

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
  function choose(position: Position): void {
    if (pieces.some((piece) => piece.carried)) {
      return;
    }
    dispatch({ type: "chooseTarget", at: position });
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
          <div role="grid" aria-label="Draughts board" className={styles.grid}>
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
                      onChoose={() => choose(position)}
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
    </div>
  );
}
