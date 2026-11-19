// The two API calls (spec section 5, plan section 3.3.4). The service never throws:
// every failure comes back as a typed result, so the game can show it and carry on (spec section 6.1.9).
import { type Board, type Player, type Position, BOARD_SIZE } from "@/game/board";

export type Level = "easy" | "normal" | "hard";

export type ApiFailure =
  | { kind: "network" }
  | { kind: "timeout" }
  | { kind: "http"; status: number }
  | { kind: "badBody" }
  | { kind: "unsuccessful" }; // successful: false in the body

export type ApiResult<T> = { ok: true; value: T } | { ok: false; failure: ApiFailure };

export type ApiMove = { from: Position; to: Position; takes: Position[] };

// Read once, when the module loads (plan section 2). A missing setting fails the tests and the first page load,
// not a game in progress.
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "";
if (API_BASE_URL.trim() === "") {
  throw new Error("VITE_API_BASE_URL is empty. Set it in the .env file for this mode (plan section 2).");
}

// Spec section 6.1.9, item 5. A constant, because it changes only with the spec.
const TIME_LIMIT_MS = 15_000;

// Spec section 5.1. The request sends Difficulty and Board only (spec section 3, goal 7).
export async function getNextMove(
  board: Board,
  level: Level,
  signal: AbortSignal,
  timeLimitMs = TIME_LIMIT_MS,
): Promise<ApiResult<ApiMove>> {
  const response = await postJson("GetNextMove", { Difficulty: level, Board: board }, signal, timeLimitMs);
  if (!response.ok) {
    return response;
  }

  const body = response.value;
  if (!isNextMoveBody(body)) {
    return failed({ kind: "badBody" });
  }
  if (!body.successful) {
    return failed({ kind: "unsuccessful" });
  }

  const move = body.nextMove;
  return {
    ok: true,
    value: {
      from: { row: move.currentHeight, col: move.currentWidth },
      to: { row: move.nextHeight, col: move.nextWidth },
      takes: move.takes.map(toPosition),
    },
  };
}

// Spec section 5.2.
export async function getTips(
  board: Board,
  player: Player,
  signal: AbortSignal,
  timeLimitMs = TIME_LIMIT_MS,
): Promise<ApiResult<Position[]>> {
  const response = await postJson("GetPotentialMoves", { Board: board, TipFor: player }, signal, timeLimitMs);
  if (!response.ok) {
    return response;
  }

  const body = response.value;
  if (!isTipsBody(body)) {
    return failed({ kind: "badBody" });
  }
  if (!body.successful) {
    return failed({ kind: "unsuccessful" });
  }

  return { ok: true, value: body.potentialMoves.map(toPosition) };
}

// Sends the request and reads the JSON body. The checks run in the order that plan section 4 sets:
// the request itself (network or timeout), then the status (http), then the body (badBody).
async function postJson(
  endpoint: string,
  requestBody: object,
  signal: AbortSignal,
  timeLimitMs: number,
): Promise<ApiResult<unknown>> {
  const timeLimit = AbortSignal.timeout(timeLimitMs);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.any([signal, timeLimit]),
    });
  } catch {
    // No network, a response the browser blocked for CORS, the time limit, or the caller's abort.
    // The caller ignores the result after its own abort (plan section 4), so that counts as "network".
    return failed(timeLimit.aborted ? { kind: "timeout" } : { kind: "network" });
  }

  // The body of an error is not read, so the API's errorMessage is never shown (spec section 6.1.9, item 4).
  if (!response.ok) {
    return failed({ kind: "http", status: response.status });
  }

  try {
    return { ok: true, value: await response.json() };
  } catch {
    // The body is not JSON, or the time limit or the caller stopped it while it was being read.
    if (timeLimit.aborted) {
      return failed({ kind: "timeout" });
    }
    return failed(signal.aborted ? { kind: "network" } : { kind: "badBody" });
  }
}

function failed(failure: ApiFailure): { ok: false; failure: ApiFailure } {
  return { ok: false, failure };
}

// The API's square: height is the row, and width is the column (spec section 5.1).
type ApiSquare = { height: number; width: number };

type NextMoveBody =
  | { successful: false }
  | {
      successful: true;
      nextMove: {
        currentHeight: number;
        currentWidth: number;
        nextHeight: number;
        nextWidth: number;
        takes: ApiSquare[];
      };
    };

type TipsBody = { successful: false } | { successful: true; potentialMoves: ApiSquare[] };

// A body with successful: false needs nothing else, because it is a failure whatever it holds.
function isNextMoveBody(body: unknown): body is NextMoveBody {
  if (!isObject(body) || typeof body.successful !== "boolean") {
    return false;
  }
  if (!body.successful) {
    return true;
  }

  const move = body.nextMove;
  return (
    isObject(move) &&
    isSquareIndex(move.currentHeight) &&
    isSquareIndex(move.currentWidth) &&
    isSquareIndex(move.nextHeight) &&
    isSquareIndex(move.nextWidth) &&
    Array.isArray(move.takes) &&
    move.takes.every(isApiSquare)
  );
}

function isTipsBody(body: unknown): body is TipsBody {
  if (!isObject(body) || typeof body.successful !== "boolean") {
    return false;
  }
  if (!body.successful) {
    return true;
  }
  return Array.isArray(body.potentialMoves) && body.potentialMoves.every(isApiSquare);
}

function isApiSquare(value: unknown): value is ApiSquare {
  return isObject(value) && isSquareIndex(value.height) && isSquareIndex(value.width);
}

// A row or column on the board.
function isSquareIndex(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value < BOARD_SIZE;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toPosition(square: ApiSquare): Position {
  return { row: square.height, col: square.width };
}
