import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import { CELL } from "@/game/board";
import { type GameState, newGame } from "@/game/game-state";
import { toSavedGame } from "@/game/saved-game";
import { boardWith } from "@/game/test-boards";
import { SAVED_GAME_KEY } from "@/services/storage";
import { renderApp } from "@/test-app";
import { API_BASE_URL, server } from "@/test-server";

const TIPS_URL = `${API_BASE_URL}/GetPotentialMoves`;

// On the starting board, player 1 can finish a move on row 5, columns 2, 4, 6 and 8 (squares (4,1) to (4,7)).
const startTips = {
  successful: true,
  potentialMoves: [1, 3, 5, 7].map((width) => ({ height: 4, width })),
};

afterEach(() => {
  window.localStorage.clear();
});

async function startTwoPlayerGame() {
  const user = userEvent.setup();
  renderApp("#/");
  await user.click(await screen.findByRole("button", { name: "Start game" }));
  return user;
}

function showTips(): HTMLElement {
  return screen.getByRole("button", { name: /^(Show tips|Loading tips…)$/ });
}

// Plan section 7.2, test 22: Show tips loads, marks squares, hides on a turn change, shows a note on failure, and is
// not available during a chain (spec section 6.1.4).
describe("Show tips", () => {
  it("shows that it is loading, then rings each square the player can finish a move on", async () => {
    let answer: () => void = () => {};
    server.use(
      http.post(
        TIPS_URL,
        () => new Promise<Response>((resolve) => (answer = () => resolve(HttpResponse.json(startTips)))),
      ),
    );
    const user = await startTwoPlayerGame();

    await user.click(showTips());
    expect(showTips()).toHaveTextContent("Loading tips…");
    expect(showTips()).toHaveAttribute("aria-pressed", "true");
    expect(showTips()).toHaveAttribute("aria-busy", "true");
    answer();

    expect(await screen.findByRole("gridcell", { name: "Row 5, column 2, empty, tip" })).toBeInTheDocument();
    expect(screen.getAllByTestId("tip")).toHaveLength(4);
    expect(showTips()).toHaveTextContent("Show tips");
    expect(showTips()).toHaveAttribute("aria-pressed", "true");
  });

  it("shows tips and targets together, looking different (spec section 6.6, item 12)", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json(startTips)));
    const user = await startTwoPlayerGame();
    await user.click(showTips());
    await screen.findAllByTestId("tip");

    await user.click(screen.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }));

    const square = screen.getByRole("gridcell", { name: "Row 5, column 4, empty, target, tip" });
    expect(within(square).getByTestId("tip")).toBeInTheDocument();
    expect(within(square).getByTestId("target")).toBeInTheDocument();
  });

  it("removes the tips when the turn ends", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json(startTips)));
    const user = await startTwoPlayerGame();
    await user.click(showTips());
    await screen.findAllByTestId("tip");

    await user.click(screen.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }));
    await user.click(screen.getByRole("gridcell", { name: "Row 5, column 4, empty, target, tip" }));

    expect(screen.queryAllByTestId("tip")).toHaveLength(0);
    expect(showTips()).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the note when tips cannot be loaded, says it, and the game goes on (spec section 6.1.4, item 4)", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json({}, { status: 500 })));
    const user = await startTwoPlayerGame();

    await user.click(showTips());

    // The note under the controls, and the same words in the live region for a screen reader.
    const said = await within(screen.getByRole("status")).findByText("Tips aren't available right now.");
    const shown = screen.getAllByText("Tips aren't available right now.").filter((note) => note !== said);
    expect(shown).toHaveLength(1);
    expect(shown[0]).toBeVisible();
    expect(showTips()).toHaveAttribute("aria-pressed", "false");
    await user.click(screen.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }));
    await user.click(screen.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }));
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
  });

  it("is not available during a chain (spec section 6.1.4, item 6)", async () => {
    const start = newGame({ opponent: "twoPlayers", level: "easy", firstPlayer: 1 });
    const board = boardWith(
      [6, 1, CELL.player1Man],
      [5, 2, CELL.player2Man],
      [3, 4, CELL.player2Man],
      [0, 7, CELL.player2Man],
    );
    const game: GameState = { ...start, board, turnStart: { ...start.turnStart, board } };
    window.localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(toSavedGame(game)));
    let requests = 0;
    server.use(
      http.post(TIPS_URL, () => {
        requests += 1;
        return HttpResponse.json(startTips);
      }),
    );
    const user = userEvent.setup();
    renderApp("#/");
    await user.click(await screen.findByRole("gridcell", { name: "Row 7, column 2, player 1's man" }));
    await user.click(screen.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }));

    expect(showTips()).toHaveAttribute("aria-disabled", "true");
    await user.click(showTips());
    expect(requests).toBe(0);
  });

  it("is gone once the game is over", async () => {
    const user = await startTwoPlayerGame();

    await user.click(screen.getByRole("button", { name: "Give up" }));

    expect(screen.queryByRole("button", { name: "Show tips" })).toBeNull();
  });
});
