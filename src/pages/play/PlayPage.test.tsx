import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { type Board, CELL } from "@/game/board";
import { type GameState, type Settings, newGame } from "@/game/game-state";
import { toSavedGame } from "@/game/saved-game";
import { boardWith } from "@/game/test-boards";
import { SAVED_GAME_KEY } from "@/services/storage";
import { renderApp } from "@/test-app";

const { player1Man: M1, player2Man: M2 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };

afterEach(() => {
  window.localStorage.clear();
});

function save(game: GameState): void {
  window.localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(toSavedGame(game)));
}

function gameOn(board: Board, settings: Settings = twoPlayers): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
}

function square(name: string): HTMLElement {
  return screen.getByRole("gridcell", { name });
}

function button(name: string): HTMLElement {
  return screen.getByRole("button", { name });
}

async function openPlay(): Promise<void> {
  renderApp("#/");
  await screen.findByRole("heading", { level: 1 });
}

// Plan section 7.2, test 21: setup defaults, the level only for the computer, and Start game (spec section 6.1.1).
describe("game setup", () => {
  it("starts with the old web app's defaults: two players, player 1 first, and no level", async () => {
    await openPlay();

    expect(screen.getByRole("heading", { level: 1, name: "New game" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Two players" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Player 1" })).toBeChecked();
    expect(screen.queryByRole("group", { name: "Level" })).toBeNull();
    expect(screen.getByText("Player 1 has the light men.")).toBeInTheDocument();
  });

  it("has the welcome line, with a link to About (spec section 6.1.1, item 3)", async () => {
    await openPlay();

    expect(screen.getByText(/^Draughts with our family's house rules/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Why this game exists" })).toHaveAttribute("href", "#/about");
  });

  it("shows the level, Easy first, only when the opponent is the computer, and names the players for it", async () => {
    const user = userEvent.setup();
    await openPlay();

    await user.click(screen.getByRole("radio", { name: "The computer" }));
    const level = screen.getByRole("group", { name: "Level" });
    expect(
      within(level)
        .getAllByRole("radio")
        .map((radio) => radio.getAttribute("value")),
    ).toEqual(["easy", "normal", "hard"]);
    expect(within(level).getByRole("radio", { name: "Easy" })).toBeChecked();
    expect(within(level).getByRole("radio", { name: "Normal" })).toBeInTheDocument();
    expect(within(level).getByRole("radio", { name: "Hard" })).toBeInTheDocument();
    const first = screen.getByRole("group", { name: "Who moves first" });
    expect(within(first).getByRole("radio", { name: "You" })).toBeChecked();
    expect(within(first).getByRole("radio", { name: "The computer" })).toBeInTheDocument();
    expect(screen.getByText("You have the light men.")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Two players" }));
    expect(screen.queryByRole("group", { name: "Level" })).toBeNull();
  });

  it("starts the game on the starting board, with the chosen first player to move (spec section 6.1.1, item 4)", async () => {
    const user = userEvent.setup();
    await openPlay();

    await user.click(screen.getByRole("radio", { name: "Player 2" }));
    await user.click(button("Start game"));

    expect(screen.getByRole("heading", { level: 1, name: "Play" })).toBeInTheDocument();
    expect(screen.getByText("Two players")).toBeInTheDocument();
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
    expect(screen.getByText("Player 2 moves first.")).toBeInTheDocument();
    expect(screen.getAllByRole("gridcell", { name: /player 2's man/ })).toHaveLength(12);
    expect(screen.getAllByRole("gridcell", { name: /player 1's man/ })).toHaveLength(12);
  });

  it("moves the focus to the board and says that the game has started", async () => {
    const user = userEvent.setup();
    await openPlay();

    await user.click(button("Start game"));

    expect(square("Row 6, column 1, player 1's man")).toHaveFocus();
    expect(await within(screen.getByRole("status")).findByText("Game started. Player 1 moves first.")).toBeVisible();
  });

  it("keeps the default level in a two-player game, whatever was chosen for the computer", async () => {
    const user = userEvent.setup();
    await openPlay();

    await user.click(screen.getByRole("radio", { name: "The computer" }));
    await user.click(screen.getByRole("radio", { name: "Hard" }));
    await user.click(screen.getByRole("radio", { name: "Two players" }));
    await user.click(button("Start game"));

    const saved = JSON.parse(window.localStorage.getItem(SAVED_GAME_KEY) ?? "{}") as { settings: Settings };
    expect(saved.settings).toEqual(twoPlayers);
  });

  it("shows the mode and the level, and names the players, in a computer game", async () => {
    const user = userEvent.setup();
    await openPlay();

    await user.click(screen.getByRole("radio", { name: "The computer" }));
    await user.click(screen.getByRole("radio", { name: "Hard" }));
    await user.click(button("Start game"));

    expect(screen.getByText("Against the computer · Hard")).toBeInTheDocument();
    expect(screen.getByText("Your turn")).toBeInTheDocument();
    expect(screen.getByText("The computer took 0")).toBeInTheDocument();
    expect(screen.getByText("You took 0")).toBeInTheDocument();
  });
});

// Spec section 6.4.2, item 2, and sections 6.1.6 and 6.1.7: the status and the controls.
describe("the game screen", () => {
  it("offers Undo only once there is something to undo, and Undo takes the turn back", async () => {
    const user = userEvent.setup();
    await openPlay();
    await user.click(button("Start game"));
    expect(button("Undo")).toHaveAttribute("aria-disabled", "true");

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
    expect(button("Undo")).toHaveAttribute("aria-disabled", "false");

    await user.click(button("Undo"));

    expect(square("Row 6, column 3, player 1's man")).toBeInTheDocument();
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it("shows End turn during a chain, and it passes the turn (spec section 6.1.3)", async () => {
    const user = userEvent.setup();
    save(gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [0, 7, M2])));
    await openPlay();
    expect(screen.queryByRole("button", { name: "End turn" })).toBeNull();

    await user.click(square("Row 7, column 2, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));
    expect(screen.getByText("Jump again or end your turn")).toBeInTheDocument();
    await user.click(button("End turn"));

    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
    // End turn goes away, so the focus moves back to the board, on the square the player last used.
    expect(square("Row 5, column 4, player 1's man")).toHaveFocus();
    expect(screen.getByText("Player 1 took 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "End turn" })).toBeNull();
  });

  it("shows the result after Give up, with only Undo, not available, and New game left (spec section 6.1.6)", async () => {
    const user = userEvent.setup();
    await openPlay();
    await user.click(button("Start game"));

    await user.click(button("Give up"));

    expect(screen.getByText("Player 2 wins")).toBeInTheDocument();
    // Give up goes away, so the focus moves to New game, the main action of the result.
    expect(button("New game")).toHaveFocus();
    expect(screen.getByText("Player 1 gave up.")).toBeInTheDocument();
    expect(button("Undo")).toHaveAttribute("aria-disabled", "true");
    expect(screen.queryByRole("button", { name: "Give up" })).toBeNull();
    expect(button("New game")).toBeInTheDocument();
  });

  it("shows the result and its reason when a move wins, and Undo continues the game (spec section 6.1.7, item 7)", async () => {
    const user = userEvent.setup();
    save(gameOn(boardWith([6, 1, M2], [7, 0, M1], [7, 2, M1], [5, 6, M1])));
    await openPlay();

    await user.click(square("Row 6, column 7, player 1's man"));
    await user.click(square("Row 5, column 8, empty, target"));
    expect(screen.getByText("Player 1 wins")).toBeInTheDocument();
    expect(screen.getByText("Player 2 can't move.")).toBeInTheDocument();

    await user.click(button("Undo"));
    expect(screen.getByText("Player 1's turn")).toBeInTheDocument();
  });

  it("goes back to setup with New game, clears the saved game, and moves the focus to the setup heading", async () => {
    const user = userEvent.setup();
    await openPlay();
    await user.click(button("Start game"));
    expect(window.localStorage.getItem(SAVED_GAME_KEY)).not.toBeNull();

    await user.click(button("New game"));

    expect(screen.getByRole("heading", { level: 1, name: "New game" })).toHaveFocus();
    expect(window.localStorage.getItem(SAVED_GAME_KEY)).toBeNull();
  });
});

// Spec section 6.1.8, items 1, 2 and 7: the game is saved, and opening the page shows it as it was.
describe("the saved game", () => {
  it("opens the saved game as it was, without moving the focus or saying the game has started", async () => {
    save(gameOn(boardWith([5, 2, M1], [2, 1, M2]), { ...twoPlayers, firstPlayer: 2 }));

    await openPlay();

    expect(screen.getByRole("heading", { level: 1, name: "Play" })).toBeInTheDocument();
    expect(square("Row 6, column 3, player 1's man")).toBeInTheDocument();
    expect(document.body).toHaveFocus();
    // The opening words wait 100 ms after the board shows (LiveRegion), so wait longer before checking for silence.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("saves each finished turn, so the game comes back after the page is left and opened again", async () => {
    const user = userEvent.setup();
    const { unmount } = renderApp("#/");
    await user.click(await screen.findByRole("button", { name: "Start game" }));
    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));
    unmount();

    await openPlay();

    expect(square("Row 5, column 4, player 1's man")).toBeInTheDocument();
    expect(screen.getByText("Player 2's turn")).toBeInTheDocument();
  });
});
