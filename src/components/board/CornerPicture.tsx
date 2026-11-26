import { type CSSProperties, useId } from "react";
import { type Cell, type Position, isDarkSquare, samePosition } from "@/game/board";
import styles from "./Board.module.css";
import squareStyles from "./BoardSquare.module.css";
import { Piece } from "./Piece";
import pictureStyles from "./CornerPicture.module.css";
import { type Timings, NORMAL_TIMINGS } from "./timings";

// A piece on a corner picture. The id stays the same while the piece moves, so it slides (T12).
export type PicturePiece = {
  id: number;
  cell: Cell;
  position: Position;
  leaving: boolean; // taken: it fades and shrinks
  crowning: boolean; // a man that has become a king: drawn as a man until its crowning shows the crown
};

// An arrow from a piece to where it can go. A blocked arrow is dashed and ends in a bar, as the design shows.
export type PictureArrow = { from: Position; to: Position; blocked: boolean };

// The marks fade out while "Show me" plays the move, as in the design.
export type PictureMarks = {
  targets: Position[]; // a cream dot, as a target on the board
  taken: Position[]; // a dashed cream ring round a man that is taken
  arrows: PictureArrow[];
};

type CornerPictureProps = {
  squares: number; // the squares on each side: a corner of the board, such as 4 by 4
  pieces: PicturePiece[];
  marks?: PictureMarks;
  marksShown?: boolean;
  label: string; // the text alternative, which says what the picture shows (spec section 6.4.4)
  timings?: Timings;
  onCrowned?: (id: number) => void;
};

const NO_MARKS: PictureMarks = { targets: [], taken: [], arrows: [] };

// A small picture of a corner of the board, in the same frame, wood and pieces as the board that is played, as the
// design shows on How to play and on "page not found". Its pieces move with the board's own motion (plan section 3.6,
// "Show me"). It cannot be played, so a screen reader reads it as one picture with its label.
export function CornerPicture(props: CornerPictureProps) {
  const { squares, pieces, label } = props;
  const { marks = NO_MARKS, marksShown = true, timings = NORMAL_TIMINGS, onCrowned = ignore } = props;
  const indexes = Array.from({ length: squares }, (_, index) => index);
  const layout = { "--squares": squares, "--target-fade-ms": `${timings.targetFade}ms` } as CSSProperties;

  const markClass = marksShown ? pictureStyles.mark : `${pictureStyles.mark} ${pictureStyles.hidden}`;

  function isTarget(position: Position): boolean {
    return marks.targets.some((target) => samePosition(target, position));
  }

  return (
    <div className={`${styles.frame} ${pictureStyles.frame}`} style={layout} role="img" aria-label={label}>
      <div className={`${styles.inlay} ${pictureStyles.inlay}`}>
        <div className={styles.board} data-marks={marksShown ? "shown" : "hidden"}>
          <div className={pictureStyles.grid}>
            {indexes.flatMap((row) =>
              indexes.map((col) => (
                <span
                  key={`${row}-${col}`}
                  className={`${squareStyles.square} ${isDarkSquare({ row, col }) ? squareStyles.dark : squareStyles.light} ${squareStyles.still}`}
                >
                  {isTarget({ row, col }) && (
                    <span className={markClass}>
                      <span className={squareStyles.target} data-testid="target" />
                    </span>
                  )}
                </span>
              )),
            )}
          </div>
          <div className={styles.pieces}>
            {pieces.map((piece) => (
              <Piece
                key={piece.id}
                id={piece.id}
                cell={piece.cell}
                crowning={piece.crowning}
                position={piece.position}
                look="resting"
                leaving={piece.leaving}
                slide={timings.computerSlide}
                timings={timings}
                squares={squares}
                onLanded={ignore}
                onCrowned={onCrowned}
                onFaded={ignore}
              />
            ))}
          </div>
          <MarksLayer squares={squares} marks={marks} className={markClass} />
        </div>
      </div>
    </div>
  );
}

// The taken rings and the arrows, drawn in square units: the centre of square (row, col) is (col + 0.5, row + 0.5).
// Each line has a dark line under it, so the cream shows on maple as well as on walnut, as in the design.
function MarksLayer({ squares, marks, className }: { squares: number; marks: PictureMarks; className: string }) {
  const id = useId();
  const head = `${id}-head`;
  const bar = `${id}-bar`;

  return (
    <svg className={`${pictureStyles.marks} ${className}`} viewBox={`0 0 ${squares} ${squares}`} aria-hidden="true">
      <defs>
        <marker id={head} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0L10 5L0 10z" className={pictureStyles.headShape} />
        </marker>
        <marker id={bar} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M5 0V10" className={pictureStyles.barShape} />
        </marker>
      </defs>
      {marks.taken.map(({ row, col }) => (
        <g key={`taken-${row}-${col}`} data-testid="taken">
          <circle cx={col + 0.5} cy={row + 0.5} r="0.46" className={pictureStyles.takenUnder} />
          <circle cx={col + 0.5} cy={row + 0.5} r="0.46" className={pictureStyles.takenRing} />
        </g>
      ))}
      {marks.arrows.map((arrow) => {
        const line = arrowLine(arrow);
        return (
          <g
            key={`arrow-${arrow.from.row}-${arrow.from.col}-${arrow.to.row}-${arrow.to.col}`}
            data-testid={arrow.blocked ? "blocked-arrow" : "arrow"}
          >
            <line {...line} className={pictureStyles.arrowUnder} />
            <line
              {...line}
              className={arrow.blocked ? `${pictureStyles.arrow} ${pictureStyles.blocked}` : pictureStyles.arrow}
              markerEnd={`url(#${arrow.blocked ? bar : head})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

// The arrow starts at the piece's edge and stops short of the square it points to, as in the design. A blocked arrow
// stops further short, so its bar sits before that square.
function arrowLine({ from, to, blocked }: PictureArrow): { x1: number; y1: number; x2: number; y2: number } {
  const across = to.col - from.col;
  const down = to.row - from.row;
  const length = Math.hypot(across, down);
  const start = 0.42 / length;
  const end = (length - (blocked ? 0.55 : 0.32)) / length;
  return {
    x1: from.col + 0.5 + across * start,
    y1: from.row + 0.5 + down * start,
    x2: from.col + 0.5 + across * end,
    y2: from.row + 0.5 + down * end,
  };
}

// The pictures lift no piece, so none is put down. A still picture crowns no man.
function ignore(): void {}
