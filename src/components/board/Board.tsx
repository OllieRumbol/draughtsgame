import { type Position, BOARD_SIZE, cellAt, isDarkSquare, ownerOf, samePosition } from "@/game/board";
import type { Action, GameState } from "@/game/game-state";
import { nextSteps } from "@/game/rules";
import styles from "./Board.module.css";
import { BoardSquare } from "./BoardSquare";
import { CrownIcon } from "./CrownIcon";
import { type PieceLook, Piece } from "./Piece";
import { squareName } from "./square-name";

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
  const selected = state.phase.kind === "turn" ? state.phase.selected : null;
  const chain = state.phase.kind === "turn" ? state.phase.chain : null;

  // The selected piece's targets come from the web app's own rules (spec section 6.1.2, item 2).
  const targets = selected ? nextSteps(state.board, selected, chain).map((step) => step.to) : [];
  const lastMove = state.lastComputerMove;

  function isIn(list: Position[], position: Position): boolean {
    return list.some((item) => samePosition(item, position));
  }

  // The reducer treats a square that is not a target as a plain click, so one action covers every square.
  function choose(position: Position): void {
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
    <div className={styles.frame}>
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
            {INDEXES.flatMap((row) =>
              INDEXES.map((col) => {
                const position = { row, col };
                const cell = cellAt(state.board, position);
                if (ownerOf(cell) === null) {
                  return null;
                }
                return <Piece key={`${row},${col}`} cell={cell} position={position} look={pieceLook(position)} />;
              }),
            )}
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
