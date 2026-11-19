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
  otherPlayer,
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
  | { kind: "computerMoving"; move: Move; step: number } // step: the number of jumps already shown
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
const PERSON: Player = 1;
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
    case "undo":
      return undo(state);
    case "giveUp":
      return giveUp(state);
    case "computerMoveReceived":
      return receiveComputerMove(state, action.requestId, action.move);
    case "computerMoveFailed":
      return failComputerMove(state, action.requestId);
    case "computerStepShown":
      return showComputerStep(state);
    case "retry":
      return retry(state);
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
  // The person's move or jump removes the mark on the computer's last move (spec section 6.1.5, item 9).
  const afterStep: GameState = { ...state, board, capturedBy, lastComputerMove: null };

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
  const next = otherPlayer(state.toMove);
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

// Spec section 6.1.7. Undo is not available while the computer is thinking or showing its move (item 4),
// or after a player gives up (item 7). During a chain, there is always something to undo: the jumps so far.
export function canUndo(state: GameState): boolean {
  const phase = state.phase;
  if (phase.kind === "computerThinking" || phase.kind === "computerMoving") {
    return false;
  }
  if (phase.kind === "over" && phase.result.reason === "gaveUp") {
    return false;
  }
  if (phase.kind === "turn" && phase.chain !== null) {
    return true;
  }
  return undoPoint(state) >= 0;
}

function undo(state: GameState): GameState {
  if (!canUndo(state)) {
    return state;
  }

  // During a chain, Undo returns to the start of the current turn (item 3).
  if (state.phase.kind === "turn" && state.phase.chain !== null) {
    return restore(state, state.turnStart, state.history);
  }

  const index = undoPoint(state);
  return restore(state, state.history[index], state.history.slice(0, index));
}

// The snapshot that Undo goes back to, as an index in `history`, or -1 when there is none.
// In a computer game, it is the start of the person's last turn, so the computer's reply is removed with it
// (item 1). Undo never goes back to the start of the computer's turn, so it never starts a new request.
function undoPoint(state: GameState): number {
  if (state.settings.opponent === "twoPlayers") {
    return state.history.length - 1;
  }
  return state.history.findLastIndex((snapshot) => snapshot.toMove === PERSON);
}

// The board, the turn and the captured counts all come back together (item 5). It is then always a person's turn.
function restore(state: GameState, snapshot: Snapshot, history: Snapshot[]): GameState {
  return {
    ...state,
    board: snapshot.board,
    toMove: snapshot.toMove,
    capturedBy: snapshot.capturedBy,
    turnStart: snapshot,
    history,
    lastComputerMove: null,
    phase: { kind: "turn", selected: null, chain: null },
  };
}

// Spec section 6.1.6, item 4. In a two-player game, the player whose turn it is gives up.
// In a computer game, only the person can give up, at any time, so the computer wins.
function giveUp(state: GameState): GameState {
  if (state.phase.kind === "over") {
    return state;
  }

  const winner = state.settings.opponent === "computer" ? COMPUTER : otherPlayer(state.toMove);
  const result: Result = { winner, reason: "gaveUp" };

  // During the computer's turn, its move is cancelled, and any jumps already shown are taken back:
  // turnStart is the board before the computer's move. On a person's turn, the board stays as it is, even
  // part-way through a chain, because the final board stays on view (spec section 6.1.6, item 2).
  const finalPosition = state.phase.kind === "turn" ? state : state.turnStart;

  return {
    ...state,
    board: finalPosition.board,
    capturedBy: finalPosition.capturedBy,
    phase: { kind: "over", result },
  };
}

// useComputerTurn has already checked the move with findPath (plan section 3.3.4).
function receiveComputerMove(state: GameState, requestId: number, move: Move): GameState {
  if (!isWaitingFor(state, requestId)) {
    return state;
  }
  return { ...state, phase: { kind: "computerMoving", move, step: 0 } };
}

// Spec section 6.1.9, item 1: the board stays as it was, and "Try again" is offered.
function failComputerMove(state: GameState, requestId: number): GameState {
  if (!isWaitingFor(state, requestId)) {
    return state;
  }
  return { ...state, phase: { kind: "computerFailed", requestId } };
}

// An answer counts only while the reducer waits for that request. A late answer to an older request, or one that
// arrives after Undo, Give up or New game, is ignored (spec section 6.6, item 5).
function isWaitingFor(state: GameState, requestId: number): boolean {
  return state.phase.kind === "computerThinking" && state.phase.requestId === requestId;
}

// Shows the next jump of the computer's move, so the board matches the screen (spec section 6.1.5, items 4 to 6).
// Each captured piece is removed at its own jump. A man that lands on the far row becomes a king in applyMove.
function showComputerStep(state: GameState): GameState {
  const phase = state.phase;
  if (phase.kind !== "computerMoving") {
    return state;
  }

  const { move, step } = phase;
  const from = step === 0 ? move.from : move.path[step - 1];
  const to = move.path[step];
  const captured: Position | undefined = move.captured[step];

  const board = applyMove(state.board, { from, to, captured: captured ? [captured] : [], path: [to] });
  const capturedBy = captured ? addCapture(state.capturedBy, state.toMove) : state.capturedBy;
  const shown: GameState = { ...state, board, capturedBy };

  const isLastStep = step + 1 === move.path.length;
  if (!isLastStep) {
    return { ...shown, phase: { kind: "computerMoving", move, step: step + 1 } };
  }

  // The start and end squares stay marked until the person's next move or jump (spec section 6.1.5, item 9).
  return endTurn({ ...shown, lastComputerMove: { from: move.from, to: move.to } });
}

// Spec section 6.1.9, item 2: the same request again. It gets a new id, as every request does.
function retry(state: GameState): GameState {
  if (state.phase.kind !== "computerFailed") {
    return state;
  }
  return askTheComputer(state);
}

function isComputersTurn(settings: Settings, toMove: Player): boolean {
  return settings.opponent === "computer" && toMove === COMPUTER;
}

function addCapture(capturedBy: Record<Player, number>, player: Player): Record<Player, number> {
  return player === 1 ? { 1: capturedBy[1] + 1, 2: capturedBy[2] } : { 1: capturedBy[1], 2: capturedBy[2] + 1 };
}
