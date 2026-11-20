// The saved game (spec section 6.1.8, plan section 3.4). Plain functions: useSavedGame reads and writes storage.
import { type Board, type Cell, type Player, type Position, BOARD_SIZE, CELL, isOnBoard } from "./board";
import type { GameState, Phase, Result, Settings, Snapshot } from "./game-state";

// The form of the game that is saved (plan section 3.4). A selection, a chain in progress and a computer move
// part-way shown are not saved, so a refresh goes back to the last save point.
export function toSavedGame(state: GameState): GameState {
  const phase = state.phase;

  // A selection is not saved, and a chain in progress goes back to the start of its turn.
  if (phase.kind === "turn") {
    const { board, toMove, capturedBy } = state.turnStart;
    return { ...state, board, toMove, capturedBy, phase: { kind: "turn", selected: null, chain: null } };
  }

  // A computer move part-way shown is saved as the request for it, on the board from before it,
  // so a refresh asks the API again (spec section 6.1.8, item 3).
  if (phase.kind === "computerMoving") {
    const { board, capturedBy } = state.turnStart;
    return { ...state, board, capturedBy, phase: { kind: "computerThinking", requestId: state.requestCount } };
  }

  return state;
}

// The game from the saved text, or null when anything in it fails a check (spec section 6.1.8, item 5).
export function parseSavedGame(text: string): GameState | null {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return null;
  }
  return isSavedGame(value) ? value : null;
}

function isSavedGame(value: unknown): value is GameState {
  if (!isObject(value)) {
    return false;
  }

  const { settings, board, toMove, capturedBy, turnStart, history, lastComputerMove, requestCount, phase } = value;
  return (
    isSettings(settings) &&
    isBoard(board) &&
    isPlayer(toMove) &&
    isCaptureCounts(capturedBy) &&
    isSnapshot(turnStart) &&
    Array.isArray(history) &&
    history.every(isSnapshot) &&
    isLastComputerMove(lastComputerMove) &&
    isWholeNumber(requestCount) &&
    isSavedPhase(phase) &&
    phaseFitsTurn(phase, settings, toMove, requestCount)
  );
}

// The phase must fit whose turn it is. Otherwise a loaded game could wait for a move that never comes,
// for example a person's turn for the computer.
function phaseFitsTurn(phase: SavedPhase, settings: Settings, toMove: Player, requestCount: number): boolean {
  const isComputersTurn = settings.opponent === "computer" && toMove === 2;

  if (phase.kind === "turn") {
    return !isComputersTurn;
  }
  if (phase.kind === "computerThinking" || phase.kind === "computerFailed") {
    return isComputersTurn && phase.requestId >= 1 && phase.requestId <= requestCount;
  }
  return true;
}

// The phases that toSavedGame can give.
type SavedPhase = Extract<Phase, { kind: "turn" | "computerThinking" | "computerFailed" | "over" }>;

function isSavedPhase(value: unknown): value is SavedPhase {
  if (!isObject(value)) {
    return false;
  }

  switch (value.kind) {
    case "turn":
      return value.selected === null && value.chain === null;
    case "computerThinking":
    case "computerFailed":
      return isWholeNumber(value.requestId);
    case "over":
      return isResult(value.result);
    default:
      return false;
  }
}

function isResult(value: unknown): value is Result {
  return (
    isObject(value) &&
    isPlayer(value.winner) &&
    (value.reason === "noPieces" || value.reason === "noMoves" || value.reason === "gaveUp")
  );
}

function isSettings(value: unknown): value is Settings {
  return (
    isObject(value) &&
    (value.opponent === "twoPlayers" || value.opponent === "computer") &&
    (value.level === "easy" || value.level === "normal" || value.level === "hard") &&
    isPlayer(value.firstPlayer)
  );
}

function isSnapshot(value: unknown): value is Snapshot {
  return isObject(value) && isBoard(value.board) && isPlayer(value.toMove) && isCaptureCounts(value.capturedBy);
}

// 8 rows of 8 cells, each with a value from 0 to 5 (plan section 3.4).
function isBoard(value: unknown): value is Board {
  return (
    Array.isArray(value) &&
    value.length === BOARD_SIZE &&
    value.every((row) => Array.isArray(row) && row.length === BOARD_SIZE && row.every(isCell))
  );
}

function isCell(value: unknown): value is Cell {
  return isWholeNumber(value) && value >= CELL.light && value <= CELL.empty;
}

function isCaptureCounts(value: unknown): value is Record<Player, number> {
  return isObject(value) && isWholeNumber(value[1]) && isWholeNumber(value[2]);
}

function isLastComputerMove(value: unknown): value is GameState["lastComputerMove"] {
  return value === null || (isObject(value) && isPosition(value.from) && isPosition(value.to));
}

function isPosition(value: unknown): value is Position {
  return isObject(value) && isWholeNumber(value.row) && isWholeNumber(value.col) && isOnBoard(value as Position);
}

function isPlayer(value: unknown): value is Player {
  return value === 1 || value === 2;
}

function isWholeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
