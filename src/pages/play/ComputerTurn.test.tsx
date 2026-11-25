import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { type Board, type Position, CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { toSavedGame } from "@/game/saved-game";
import { at, boardWith } from "@/game/test-boards";
import { SAVED_GAME_KEY } from "@/services/storage";
import { renderApp } from "@/test-app";
import { API_BASE_URL, server } from "@/test-server";

const { player1Man: M1, player2Man: M2 } = CELL;
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };
const NEXT_MOVE_URL = `${API_BASE_URL}/GetNextMove`;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

// The API's answer for a move, in its own shape (spec section 5.1).
function apiMove(from: Position, to: Position, takes: Position[] = []) {
  return {
    successful: true,
    nextMove: {
      currentHeight: from.row,
      currentWidth: from.col,
      nextHeight: to.row,
      nextWidth: to.col,
      takes: takes.map((square) => ({ height: square.row, width: square.col })),
    },
  };
}

function answerWith(body: object, status = 200): void {
  server.use(http.post(NEXT_MOVE_URL, () => HttpResponse.json(body, { status })));
}

// A saved computer game on this board, where the person has just moved (7,0) to (6,1), so the computer's move is
// asked for when the Play page opens (spec section 6.1.8, item 3).
function saveWaitingForTheComputer(board: Board): GameState {
  const start = newGame(againstComputer);
  const game: GameState = { ...start, board, turnStart: { ...start.turnStart, board } };
  const actions: Action[] = [
    { type: "select", at: at(7, 0) },
    { type: "chooseTarget", at: at(6, 1) },
  ];
  const waiting = actions.reduce(gameReducer, game);
  window.localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(toSavedGame(waiting)));
  return waiting;
}

function square(name: string): HTMLElement {
  return screen.getByRole("gridcell", { name });
}

function said(): string {
  return screen.getByRole("status").textContent ?? "";
}

// Plan section 7.2, test 39: in a game the computer starts, the request is sent only after the board is on screen
// (spec section 6.1.5, item 8, and section 4.1, item 8).
describe("a game the computer starts", () => {
  it("asks for the computer's move only once the board is on screen", async () => {
    // Whether the board is on the page at the moment the request is sent. The mock API's handler runs later, after
    // React has drawn, so the check is made in fetch itself.
    const boardShownAtRequest: boolean[] = [];
    const realFetch = globalThis.fetch;
    vi.spyOn(globalThis, "fetch").mockImplementation((input, init) => {
      boardShownAtRequest.push(document.querySelector('[role="grid"]') !== null);
      return realFetch(input, init);
    });
    answerWith(apiMove(at(2, 1), at(3, 0)));
    const user = userEvent.setup();
    renderApp("#/");

    const opponent = await screen.findByRole("group", { name: "Opponent" });
    await user.click(within(opponent).getByRole("radio", { name: "The computer" }));
    const first = screen.getByRole("group", { name: "Who moves first" });
    await user.click(within(first).getByRole("radio", { name: "The computer" }));
    await user.click(screen.getByRole("button", { name: "Start game" }));

    // The move waits for the computer's thinking time (plan section 3.6).
    expect(await screen.findByText("Your turn", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(boardShownAtRequest).toEqual([true]);
  });
});

// Plan section 7.2, test 23: the computer's move is shown one jump at a time, with each captured piece removed at its
// own jump, then the last-move mark (spec section 6.1.5, items 4, 6, 7 and 9).
describe("showing the computer's move", () => {
  it("shows a two-jump chain one jump at a time, with the pause, then marks the move (example 15)", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    saveWaitingForTheComputer(boardWith([0, 1, M2], [1, 2, M1], [3, 4, M1], [7, 0, M1]));
    answerWith(apiMove(at(0, 1), at(4, 5), [at(1, 2), at(3, 4)]));
    renderApp("#/");
    expect(screen.getByText("The computer is thinking…")).toBeInTheDocument();

    // The answer arrives at once, but the move waits for the person's slide (200 ms) and the thinking time (700 ms).
    await act(() => vi.advanceTimersByTimeAsync(899));
    expect(screen.getByText("The computer is thinking…")).toBeInTheDocument();
    expect(square("Row 1, column 2, the computer's man")).toBeInTheDocument();

    // Then the first jump is shown: (0,1) to (2,3), taking (1,2).
    await act(() => vi.advanceTimersByTimeAsync(1));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(square("Row 3, column 4, the computer's man")).toBeInTheDocument();
    expect(screen.getByText("The computer is moving")).toBeInTheDocument();
    expect(square("Row 2, column 3, empty")).toBeInTheDocument();
    expect(square("Row 4, column 5, your man")).toBeInTheDocument();
    expect(screen.queryAllByTestId("last-move")).toHaveLength(0);

    // The second jump comes after the slide (380 ms) and the pause (180 ms): (2,3) to (4,5), taking (3,4).
    await act(() => vi.advanceTimersByTimeAsync(559));
    expect(square("Row 4, column 5, your man")).toBeInTheDocument();
    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(square("Row 5, column 6, the computer's man")).toBeInTheDocument();
    expect(square("Row 4, column 5, empty")).toBeInTheDocument();

    // The turn passes once the last jump has slid, and the start and end squares are marked.
    await act(() => vi.advanceTimersByTimeAsync(380));
    expect(screen.getByText("Your turn")).toBeInTheDocument();
    expect(screen.getByText("The computer took 2")).toBeInTheDocument();
    expect(within(square("Row 1, column 2, empty")).getByTestId("last-move")).toBeInTheDocument();
    expect(within(square("Row 5, column 6, the computer's man")).getByTestId("last-move")).toBeInTheDocument();
    expect(said()).toBe("The computer jumped row 1, column 2 to row 5, column 6, taking 2 pieces. Your turn.");
  });

  it("crowns a computer man that reaches the far row (spec section 6.1.5, item 6)", async () => {
    saveWaitingForTheComputer(boardWith([6, 3, M2], [7, 0, M1], [5, 6, M1]));
    answerWith(apiMove(at(6, 3), at(7, 4)));
    renderApp("#/");

    // The turn passes once the slide (380 ms) and the crowning (600 ms) have been shown.
    expect(await screen.findByText("Your turn", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(square("Row 8, column 5, the computer's king")).toBeInTheDocument();
  });
});

// Plan section 7.2, test 24: a failure shows the message and Try again, and Try again succeeds (spec section 6.1.9,
// and examples 24 and 25).
describe("when the computer's move fails", () => {
  it("shows the message and Try again, says it, and Try again shows the move", async () => {
    saveWaitingForTheComputer(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
    answerWith({ nextMove: null, successful: false, errorMessage: "Unexpected fault" }, 500);
    const user = userEvent.setup();
    renderApp("#/");

    expect(await screen.findByText("The computer couldn't move")).toBeInTheDocument();
    expect(screen.getByText("Check your connection and try again.")).toBeInTheDocument();
    expect(screen.queryByText(/Unexpected fault/)).toBeNull();
    expect(said()).toBe("The computer couldn't move. Check your connection and try again.");
    expect(square("Row 7, column 2, your man")).toBeInTheDocument();

    answerWith(apiMove(at(2, 1), at(3, 0)));
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Your turn", {}, { timeout: 3000 })).toBeInTheDocument();
    expect(square("Row 4, column 1, the computer's man")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("treats a move that is not legal as a failure (example 18)", async () => {
    saveWaitingForTheComputer(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
    answerWith(apiMove(at(4, 4), at(5, 5)));
    renderApp("#/");

    expect(await screen.findByText("The computer couldn't move")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("keeps Undo, which removes the person's move, as the computer has not replied (spec section 6.1.7, item 4)", async () => {
    saveWaitingForTheComputer(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
    answerWith({}, 503);
    const user = userEvent.setup();
    renderApp("#/");
    await screen.findByText("The computer couldn't move");

    expect(screen.getByRole("button", { name: "Undo" })).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Undo" }));

    expect(square("Row 8, column 1, your man")).toBeInTheDocument();
    expect(screen.getByText("Your turn")).toBeInTheDocument();
  });
});

// Spec section 6.1.6, item 4, section 6.1.7, item 4 (example 20), and section 6.6, item 5.
describe("while the computer is thinking", () => {
  it("does not offer Undo, and Give up cancels the request, so the computer wins", async () => {
    const signals: AbortSignal[] = [];
    server.use(
      http.post(NEXT_MOVE_URL, ({ request }) => {
        signals.push(request.signal);
        return new Promise<Response>(() => {});
      }),
    );
    saveWaitingForTheComputer(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
    const user = userEvent.setup();
    renderApp("#/");
    await vi.waitFor(() => expect(signals).toHaveLength(1));

    expect(screen.getByRole("button", { name: "Undo" })).toHaveAttribute("aria-disabled", "true");
    await user.click(screen.getByRole("button", { name: "Give up" }));

    expect(screen.getByText("The computer wins")).toBeInTheDocument();
    expect(screen.getByText("You gave up.")).toBeInTheDocument();
    expect(signals[0].aborted).toBe(true);
  });

  it("cancels the request on New game", async () => {
    const signals: AbortSignal[] = [];
    server.use(
      http.post(NEXT_MOVE_URL, ({ request }) => {
        signals.push(request.signal);
        return new Promise<Response>(() => {});
      }),
    );
    saveWaitingForTheComputer(boardWith([2, 1, M2], [7, 0, M1], [5, 6, M1]));
    const user = userEvent.setup();
    renderApp("#/");
    await vi.waitFor(() => expect(signals).toHaveLength(1));

    await user.click(screen.getByRole("button", { name: "New game" }));

    expect(screen.getByRole("heading", { level: 1, name: "New game" })).toBeInTheDocument();
    expect(signals[0].aborted).toBe(true);
  });
});
