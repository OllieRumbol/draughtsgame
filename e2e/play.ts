import { type Page, expect } from "@playwright/test";

// Opens the Play page with no saved game and starts a two-player game with the defaults (spec section 6.1.1).
export async function startTwoPlayerGame(page: Page): Promise<void> {
  await page.goto("./#/");
  await page.getByRole("button", { name: "Start game" }).click();
  await expect(page.getByRole("grid", { name: "Draughts board" })).toBeVisible();
  // Start game moves the focus to the board in an effect just after drawing. Wait for it, so a test that moves the
  // focus itself is not overtaken by it.
  await expect(page.getByRole("gridcell", { name: "Row 6, column 1, player 1's man" })).toBeFocused();
}

// The API's answer for a move, in its own shape (spec section 5.1). Squares are [row, column].
export function apiMove(from: [number, number], to: [number, number], takes: [number, number][] = []) {
  return {
    successful: true,
    nextMove: {
      currentHeight: from[0],
      currentWidth: from[1],
      nextHeight: to[0],
      nextWidth: to[1],
      takes: takes.map(([height, width]) => ({ height, width })),
    },
  };
}

// Answers every request for the computer's move with this body. The built site asks the live address, so the route
// matches the endpoint's name.
export async function answerNextMove(page: Page, body: object): Promise<void> {
  await page.route("**/GetNextMove", (route) => route.fulfill({ json: body }));
}

// Opens the Play page with no saved game and starts a computer game on Easy, with the chosen first player.
export async function startComputerGame(page: Page, first: "You" | "The computer"): Promise<void> {
  await page.goto("./#/");
  await page.getByRole("group", { name: "Opponent" }).getByRole("radio", { name: "The computer" }).check();
  await page.getByRole("group", { name: "Who moves first" }).getByRole("radio", { name: first }).check();
  await page.getByRole("button", { name: "Start game" }).click();
  await expect(page.getByRole("grid", { name: "Draughts board" })).toBeVisible();
}

// Opens a saved two-player game where player 1's man on row 7, column 2 can jump twice (spec section 6.1.3). It is
// written on the About page, because game setup removes a saved game that it does not use.
export async function openSavedChainGame(page: Page): Promise<void> {
  await page.goto("./#/about");
  await page.evaluate(() => {
    const rows = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col): number => ((row + col) % 2 === 1 ? 5 : 0)),
    );
    rows[6][1] = 1;
    rows[5][2] = 2;
    rows[3][4] = 2;
    rows[0][7] = 2;
    const snapshot = { board: rows, toMove: 1, capturedBy: { 1: 0, 2: 0 } };
    const game = {
      settings: { opponent: "twoPlayers", level: "easy", firstPlayer: 1 },
      ...snapshot,
      turnStart: snapshot,
      history: [],
      lastComputerMove: null,
      requestCount: 0,
      phase: { kind: "turn", selected: null, chain: null },
    };
    localStorage.setItem("draughts.game.v1", JSON.stringify(game));
  });
  await page.goto("./#/");
  await expect(page.getByRole("grid", { name: "Draughts board" })).toBeVisible();
}

// Opens that saved game and makes the first jump, so player 1 is in a chain.
export async function openChainGame(page: Page): Promise<void> {
  await openSavedChainGame(page);
  await page.getByRole("gridcell", { name: "Row 7, column 2, player 1's man" }).click();
  await page.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }).click();
  await expect(page.getByRole("button", { name: "End turn" })).toBeVisible();
}
