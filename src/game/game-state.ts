// The whole game in one state: the board, whose turn it is, the undo history and the phase
// (plan section 3.3.3, and section 3.5, decision 3). The reducer is pure: it never changes its input,
// and it never calls the API or storage. Hooks do that.
import {
  type Board,
  type Move,
  type Player,
  type Position,
  STARTING_BOARD,
  cellAt,
  isKing,
  isOnBoard,
  ownerOf,
  samePosition,
} from "./board";
import { type ChainSoFar, type Step, applyMove, nextSteps, outcome } from "./rules";

export type Settings = {
  opponent: "twoPlayers" | "computer";
  level: "easy" | "normal" | "hard"; // the API names (spec section 2.4)
  firstPlayer: Player;
};

export type Phase =
  | { kind: "turn"; selected: Position | null; chain: ChainSoFar | null }
  | { kind: "computerThinking"; requestId: number }
  | { kind: "computerMoving"; move: Move; step: number }
  | { kind: "computerFailed"; requestId: number }
  | { kind: "over"; result: Result };

// Spec section 6.3. "gaveUp" also tells canUndo that Undo is not offered (spec section 6.1.7, item 7).
export type Result = { winner: Player; reason: "noPieces" | "noMoves" | "gaveUp" };

export type Snapshot = { board: Board; toMove: Player; capturedBy: Record<Player, number> };

export type GameState = {
  settings: Settings;
  board: Board;
  toMove: Player;
  capturedBy: Record<Player, number>; // the number of pieces each player has taken
  turnStart: Snapshot; // the start of the current turn, for Undo during a chain
  history: Snapshot[]; // the start of each finished turn, for Undo
  lastComputerMove: { from: Position; to: Position } | null;
  requestCount: number; // the requests for the computer's move so far. The next one gets requestCount + 1.
  phase: Phase;
};

export type Action =
  | { type: "select"; at: Position }
  | { type: "chooseTarget"; at: Position }
  | { type: "endTurn" }
  | { type: "undo" }
  | { type: "giveUp" }
  | { type: "computerMoveReceived"; requestId: number; move: Move }
  | { type: "computerMoveFailed"; requestId: number }
  | { type: "computerStepShown" }
  | { type: "retry" };

// In a computer game, the person is player 1, and the computer is always player 2 (spec section 2.4).
const COMPUTER: Player = 2;

// Spec section 6.1.1, item 4: the starting board, and the chosen first player moves first.
export function newGame(settings: Settings): GameState {
  const toMove = settings.firstPlayer;
  const capturedBy = { 1: 0, 2: 0 };
  const game: GameState = {
    settings,
    board: STARTING_BOARD,
    toMove,
    capturedBy,
    turnStart: { board: STARTING_BOARD, toMove, capturedBy },
    history: [],
    lastComputerMove: null,
    requestCount: 0,
    phase: { kind: "turn", selected: null, chain: null },
  };

  return isComputersTurn(settings, toMove) ? askTheComputer(game) : game;
}

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "select":
      return select(state, action.at);
    case "chooseTarget":
      return chooseTarget(state, action.at);
    case "endTurn":
      return endTurnByChoice(state);
    // T7 adds Undo, Give up and the computer's actions. Until then they change nothing.
    case "undo":
    case "giveUp":
    case "computerMoveReceived":
    case "computerMoveFailed":
    case "computerStepShown":
    case "retry":
      return state;
    default: {
      // Every action is handled above. A new action type that is not makes this a type error.
      const unhandled: never = action;
      return unhandled;
    }
  }
}

// Spec section 6.1.2. Only during a person's turn. During a chain it does nothing (spec section 6.1.3, item 3).
function select(state: GameState, at: Position): GameState {
  const phase = state.phase;
  if (phase.kind !== "turn" || phase.chain !== null) {
    return state;
  }

  // Choosing the selected piece again puts it down (item 7). Choosing another own piece selects it (item 4),
  // even one with no targets (item 6). Any other square clears the selection, with no error (item 5).
  const isSelectedPiece = phase.selected !== null && samePosition(phase.selected, at);
  const isOwnPiece = isOnBoard(at) && ownerOf(cellAt(state.board, at)) === state.toMove;
  const selected = isOwnPiece && !isSelectedPiece ? at : null;

  return { ...state, phase: { ...phase, selected } };
}

function chooseTarget(state: GameState, at: Position): GameState {
  const phase = state.phase;
  if (phase.kind !== "turn") {
    return state;
  }

  const step = phase.selected
    ? nextSteps(state.board, phase.selected, phase.chain).find((target) => samePosition(target.to, at))
    : undefined;

  // A square that is not a target acts as a plain click on it, so it is never an error (spec section 4.1, item 13).
  if (!phase.selected || !step) {
    return select(state, at);
  }

  return playStep(state, phase.selected, step, phase.chain);
}

// One move, or one jump of a chain (spec sections 6.1.2, item 3, and 6.1.3).
function playStep(state: GameState, from: Position, step: Step, chain: ChainSoFar | null): GameState {
  // The captured piece is removed at its own jump. The rules still count it as taken, through
  // chain.captured, until the turn ends (plan section 3.5, decision 13).
  const move: Move = { from, to: step.to, captured: step.captured ? [step.captured] : [], path: [step.to] };
  const board = applyMove(state.board, move);
  const capturedBy = step.captured ? addCapture(state.capturedBy, state.toMove) : state.capturedBy;
  const afterStep: GameState = { ...state, board, capturedBy };

  if (!step.captured) {
    return endTurn(afterStep);
  }

  // A man that becomes a king ends the turn, even when it could jump again (spec section 6.1.3, item 5).
  // So the reducer stops here, before it asks the rules for more steps.
  const becameKing = !isKing(cellAt(state.board, from)) && isKing(cellAt(board, step.to));
  if (becameKing) {
    return endTurn(afterStep);
  }

  const chainSoFar: ChainSoFar = {
    start: chain?.start ?? from,
    captured: [...(chain?.captured ?? []), step.captured],
  };

  // When no further jump is possible, the turn ends by itself (spec section 6.1.3, item 4).
  if (nextSteps(board, step.to, chainSoFar).length === 0) {
    return endTurn(afterStep);
  }

  // Otherwise the piece stays selected, and its next jumps are the targets (spec section 6.1.3, item 1).
  return { ...afterStep, phase: { kind: "turn", selected: step.to, chain: chainSoFar } };
}

// "End turn" during a chain (spec section 6.1.3, item 2). Outside a chain there is nothing to end.
function endTurnByChoice(state: GameState): GameState {
  if (state.phase.kind !== "turn" || state.phase.chain === null) {
    return state;
  }
  return endTurn(state);
}

function endTurn(state: GameState): GameState {
  const next: Player = state.toMove === 1 ? 2 : 1;
  const ended: GameState = {
    ...state,
    toMove: next,
    history: [...state.history, state.turnStart],
    turnStart: { board: state.board, toMove: next, capturedBy: state.capturedBy },
  };

  // The end of the game is checked after every turn, before the next turn starts (spec section 6.1.6, item 1).
  const result = outcome(state.board, next);
  if (result.kind === "win") {
    return { ...ended, phase: { kind: "over", result: { winner: result.winner, reason: result.reason } } };
  }

  if (isComputersTurn(state.settings, next)) {
    return askTheComputer(ended);
  }

  return { ...ended, phase: { kind: "turn", selected: null, chain: null } };
}

// Each request for the computer's move gets the next id, so a late answer to an older request can be ignored
// (spec section 6.6, item 5).
function askTheComputer(state: GameState): GameState {
  const requestId = state.requestCount + 1;
  return { ...state, requestCount: requestId, phase: { kind: "computerThinking", requestId } };
}

function isComputersTurn(settings: Settings, toMove: Player): boolean {
  return settings.opponent === "computer" && toMove === COMPUTER;
}

function addCapture(capturedBy: Record<Player, number>, player: Player): Record<Player, number> {
  return player === 1 ? { 1: capturedBy[1] + 1, 2: capturedBy[2] } : { 1: capturedBy[1], 2: capturedBy[2] + 1 };
}
