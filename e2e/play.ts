import { type Page, expect } from "@playwright/test";

// Opens the Play page with no saved game and starts a two-player game with the defaults (spec section 6.1.1).
export async function startTwoPlayerGame(page: Page): Promise<void> {
  await page.goto("./#/");
  await page.getByRole("button", { name: "Start game" }).click();
  await expect(page.getByRole("grid", { name: "Draughts board" })).toBeVisible();
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
