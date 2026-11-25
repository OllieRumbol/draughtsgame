import { type Board as BoardCells, BOARD_SIZE, cellAt, isDarkSquare, ownerOf } from "@/game/board";
import styles from "./Board.module.css";
import squareStyles from "./BoardSquare.module.css";
import { CrownIcon } from "./CrownIcon";
import { Piece } from "./Piece";
import { NORMAL_TIMINGS } from "./timings";

type BoardPictureProps = {
  board: BoardCells;
  label: string; // the text alternative, which says what the picture shows
};

const INDEXES = Array.from({ length: BOARD_SIZE }, (_, index) => index);

// A still picture of a board, in the same frame, wood and pieces as the board that is played, as the design shows
// beside game setup. It cannot be played, so a screen reader reads it as one picture with its label.
export function BoardPicture({ board, label }: BoardPictureProps) {
  const pieces = INDEXES.flatMap((row) =>
    INDEXES.map((col) => ({ row, col })).filter((position) => ownerOf(cellAt(board, position)) !== null),
  );

  return (
    <div className={styles.frame} role="img" aria-label={label} data-testid="board-frame">
      <div className={styles.inlay}>
        <div className={styles.board}>
          <div className={styles.grid}>
            {INDEXES.map((row) => (
              <div key={row} className={styles.row}>
                {INDEXES.map((col) => (
                  <span
                    key={col}
                    className={`${squareStyles.square} ${isDarkSquare({ row, col }) ? squareStyles.dark : squareStyles.light} ${squareStyles.still}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className={styles.pieces}>
            {pieces.map((position) => (
              <Piece
                key={`${position.row}-${position.col}`}
                id={position.row * BOARD_SIZE + position.col}
                cell={cellAt(board, position)}
                crowning={false}
                position={position}
                look="resting"
                leaving={false}
                slide={0}
                timings={NORMAL_TIMINGS}
                onLanded={ignore}
                onCrowned={ignore}
                onFaded={ignore}
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

// A still picture has no motion, so nothing calls these.
function ignore(): void {}
