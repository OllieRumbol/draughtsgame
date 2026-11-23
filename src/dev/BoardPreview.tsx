// Dev only: the board in every state that plan section 3.6 draws, for the design check, the design review and the
// owner's look. Each board can be played, so a selection or a jump can be tried. Not part of the built site.
import { useReducer, useState } from "react";
import { Board } from "@/components/board/Board";
import { CapturedStack } from "@/components/board/CapturedStack";
import { ThemeButton } from "@/components/layout/ThemeButton";
import { type Board as BoardCells, type Move, type Position, samePosition } from "@/game/board";
import { type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { findPath } from "@/game/path";
import { legalMoves } from "@/game/rules";
import { at, boardWith } from "@/game/test-boards";
import { useComputerMoveSteps } from "@/hooks/useComputerMoveSteps";
import { useTheme } from "@/hooks/useTheme";
import styles from "./BoardPreview.module.css";

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

// The design's "Game in progress" position: kings for both players, after the computer moved (2,3) to (3,2).
const IN_PROGRESS: BoardCells = [
  [0, 2, 0, 2, 0, 5, 0, 2],
  [2, 0, 5, 0, 2, 0, 5, 0],
  [0, 5, 0, 5, 0, 5, 0, 4],
  [5, 0, 2, 0, 5, 0, 1, 0],
  [0, 1, 0, 5, 0, 1, 0, 5],
  [1, 0, 5, 0, 3, 0, 1, 0],
  [0, 5, 0, 1, 0, 5, 0, 1],
  [1, 0, 5, 0, 1, 0, 5, 0],
];

// A game on the given board, at the start of player 1's turn.
function gameOn(board: BoardCells, settings: Settings, extra: Partial<GameState> = {}): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board }, ...extra };
}

// The squares any of player 1's moves end on, as the API's tips list them (spec section 5.2).
function tipsFor(board: BoardCells): Position[] {
  const ends: Position[] = [];
  for (const move of legalMoves(board, 1)) {
    if (!ends.some((end) => samePosition(end, move.to))) {
      ends.push(move.to);
    }
  }
  return ends;
}

const examples = [
  {
    title: "A man selected: lifted, with its targets, and the player's other men stepped back",
    state: gameReducer(newGame(twoPlayers), { type: "select", at: { row: 5, col: 2 } }),
    tips: [],
  },
  {
    title: "A game in progress: kings, the computer's last move and the tips",
    state: gameOn(IN_PROGRESS, againstComputer, {
      lastComputerMove: { from: { row: 2, col: 3 }, to: { row: 3, col: 2 } },
      capturedBy: { 1: 5, 2: 2 },
    }),
    tips: tipsFor(IN_PROGRESS),
  },
  {
    title: "Tips and a selection together: a tip ring and a target dot look different",
    state: gameReducer(gameOn(IN_PROGRESS, againstComputer), { type: "select", at: { row: 5, col: 4 } }),
    tips: tipsFor(IN_PROGRESS),
  },
  {
    title: "A chain after the first jump: the man stays lifted, and its next jump is the target",
    state: [{ type: "select", at: at(6, 1) } as const, { type: "chooseTarget", at: at(4, 3) } as const].reduce(
      gameReducer,
      gameOn(boardWith([6, 1, 1], [5, 2, 2], [3, 4, 2], [7, 6, 1], [0, 7, 2]), twoPlayers),
    ),
    tips: [],
  },
];

// A computer game where the person has just moved (7,0) to (6,1), so the computer is thinking.
function computerToMove(board: BoardCells): GameState {
  return [{ type: "select", at: at(7, 0) } as const, { type: "chooseTarget", at: at(6, 1) } as const].reduce(
    gameReducer,
    gameOn(board, againstComputer),
  );
}

function computerMove(start: GameState, from: Position, to: Position, takes: Position[]): Move {
  const move = findPath(start.board, 2, from, to, takes);
  if (move === null) {
    throw new Error("The preview board has no such move for the computer.");
  }
  return move;
}

const chainStart = computerToMove(boardWith([0, 1, 2], [1, 2, 1], [3, 4, 1], [7, 0, 1]));
const crownStart = computerToMove(boardWith([5, 2, 2], [6, 3, 1], [7, 0, 1], [0, 7, 1]));

const computerExamples = [
  {
    title: "The computer's chain, one jump at a time, with the pause between (spec example 15)",
    start: chainStart,
    move: computerMove(chainStart, at(0, 1), at(4, 5), [at(1, 2), at(3, 4)]),
  },
  {
    title: "The computer jumps to the far row and is crowned",
    start: crownStart,
    move: computerMove(crownStart, at(5, 2), at(7, 4), [at(6, 3)]),
  },
];

const personExamples = [
  {
    title: "Your move: select a man and choose a dot. Jumping the man at row 2 crowns yours (spec example 12)",
    state: gameOn(boardWith([2, 3, 1], [1, 2, 2], [5, 6, 2], [7, 0, 1]), twoPlayers),
    tips: [],
  },
];

export function BoardPreview() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <h1>Board preview (dev only)</h1>
        <ThemeButton theme={theme} onToggle={toggleTheme} />
      </div>
      <p>Click the boards to try a selection or a move. Use the browser's width for the phone layout.</p>
      {examples.map((example) => (
        <Example key={example.title} {...example} />
      ))}
      <h2>Motion</h2>
      <p>
        Use your browser's developer tools to slow animations down, and the device's reduced-motion setting to check it.
      </p>
      {personExamples.map((example) => (
        <Example key={example.title} {...example} />
      ))}
      {computerExamples.map((example) => (
        <ComputerExample key={example.title} {...example} />
      ))}
      <section>
        <h2>Captured men: 2, 7 and 12</h2>
        <div className={styles.stacks}>
          {[2, 7, 12].map((count) => (
            <div key={count} className={styles.stackPair}>
              <CapturedStack count={count} menOf={1} label="Player 2 took" />
              <CapturedStack count={count} menOf={2} label="Player 1 took" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

type ExampleProps = {
  title: string;
  state: GameState;
  tips: Position[];
};

function Example({ title, state, tips }: ExampleProps) {
  const [game, dispatch] = useReducer(gameReducer, state);

  return (
    <section>
      <h2>{title}</h2>
      <div className={styles.board}>
        <Board state={game} dispatch={dispatch} tips={tips} />
      </div>
    </section>
  );
}

type ComputerExampleProps = {
  title: string;
  start: GameState;
  move: Move;
};

// The computer's move, shown as T15 will show it: the answer arrives, then useComputerMoveSteps shows each jump.
function ComputerExample({ title, start, move }: ComputerExampleProps) {
  const [run, setRun] = useState(0);

  return (
    <section>
      <h2>{title}</h2>
      <ComputerBoard key={run} start={start} move={move} onAgain={() => setRun((count) => count + 1)} />
    </section>
  );
}

type ComputerBoardProps = {
  start: GameState;
  move: Move;
  onAgain: () => void;
};

function ComputerBoard({ start, move, onAgain }: ComputerBoardProps) {
  const [game, dispatch] = useReducer(gameReducer, start);
  useComputerMoveSteps(game, dispatch);
  const thinking = game.phase.kind === "computerThinking";

  return (
    <>
      <p className={styles.buttons}>
        <button
          type="button"
          disabled={!thinking}
          onClick={() => dispatch({ type: "computerMoveReceived", requestId: game.requestCount, move })}
        >
          Show the computer's move
        </button>
        <button type="button" onClick={onAgain}>
          Again
        </button>
      </p>
      <div className={styles.board}>
        <Board state={game} dispatch={dispatch} tips={[]} />
      </div>
    </>
  );
}
