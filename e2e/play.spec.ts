import { type Page, expect, test } from "@playwright/test";
import { startTwoPlayerGame } from "./play.ts";

function square(page: Page, name: string) {
  return page.getByRole("gridcell", { name, exact: true });
}

async function move(page: Page, from: string, to: string): Promise<void> {
  await square(page, from).click();
  await square(page, to).click();
  // The next click is ignored until the piece has landed (plan section 3.6).
  await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));
}

// Every request the page makes goes to the site itself: a two-player game needs no network (spec section 6.1.5 is
// only for the computer).
function watchRequests(page: Page): string[] {
  const elsewhere: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://localhost:4173/")) {
      elsewhere.push(request.url());
    }
  });
  return elsewhere;
}

// Plan section 7.2, test 30: a two-player game from setup to a win, with no network (spec sections 6.1.1 to 6.1.7).
test("plays a two-player game from setup to the result, with a capture, Undo and Give up, and no network", async ({
  page,
}) => {
  const elsewhere = watchRequests(page);
  await page.goto("./#/");
  await expect(page.getByRole("heading", { level: 1, name: "New game" })).toBeVisible();
  await page.getByRole("radio", { name: "Player 2" }).check();
  await page.getByRole("button", { name: "Start game" }).click();
  const status = page.getByText(/turn$|wins$/);

  // Player 2 moves first, as chosen.
  await expect(status).toHaveText("Player 2's turn");
  await move(page, "Row 3, column 2, player 2's man", "Row 4, column 1, empty, target");
  await expect(status).toHaveText("Player 1's turn");
  await move(page, "Row 6, column 3, player 1's man", "Row 5, column 2, empty, target");
  await move(page, "Row 3, column 4, player 2's man", "Row 4, column 3, empty, target");

  // Player 1 jumps the man on row 4, column 3, and the captured count goes up.
  await move(page, "Row 5, column 2, player 1's man", "Row 3, column 4, empty, target");
  await expect(page.getByText("Player 1 took 1", { exact: true })).toBeVisible();

  // Undo takes back the jump (spec section 6.1.7, item 1).
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByText("Player 1 took 0", { exact: true })).toBeVisible();
  await expect(square(page, "Row 5, column 2, player 1's man")).toBeVisible();
  await expect(status).toHaveText("Player 1's turn");

  // Player 1 gives up, so Player 2 wins. Only Undo, not available, and New game are left (spec section 6.1.6).
  await page.getByRole("button", { name: "Give up" }).click();
  await expect(status).toHaveText("Player 2 wins");
  await expect(page.getByText("Player 1 gave up.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("button", { name: "Give up" })).toHaveCount(0);

  // New game goes back to setup (spec section 6.1.8, item 4).
  await page.getByRole("button", { name: "New game" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "New game" })).toBeFocused();
  expect(elsewhere).toEqual([]);
});

// A game that a capture wins: Player 1 takes Player 2's last man (spec section 6.3).
test("shows the result when a player takes the other player's last man", async ({ page }) => {
  // The save is written on the About page: game setup removes any saved game it finds unreadable or absent, so
  // writing it while setup is open could race with that.
  await page.goto("./#/about");
  // A saved game, one move from the end: Player 1's man on row 6, column 3, Player 2's last man on row 5, column 4.
  await page.evaluate(() => {
    const empty = [0, 5, 0, 5, 0, 5, 0, 5];
    const board = Array.from({ length: 8 }, (_, row) => (row % 2 === 0 ? empty : [5, 0, 5, 0, 5, 0, 5, 0]));
    const rows = board.map((row) => [...row]);
    rows[5][2] = 1;
    rows[4][3] = 2;
    const settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
    const snapshot = { board: rows, toMove: 1, capturedBy: { 1: 11, 2: 11 } };
    const game = {
      settings,
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

  await move(page, "Row 6, column 3, player 1's man", "Row 4, column 5, empty, target");

  await expect(page.getByText("Player 1 wins", { exact: true })).toBeVisible();
  await expect(page.getByText("Player 2 has no pieces left.", { exact: true })).toBeVisible();
  await expect(page.getByText("Player 1 took 12", { exact: true })).toBeVisible();
});

// Plan section 7.2, test 32: the game is kept across a visit to How to play and back, and across a refresh
// (spec section 6.1.8, items 1, 2 and 7).
test("keeps the game across a visit to another page, and across a refresh", async ({ page }) => {
  await startTwoPlayerGame(page);
  await move(page, "Row 6, column 3, player 1's man", "Row 5, column 4, empty, target");

  await page.getByRole("link", { name: "How to play" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "How to play" })).toBeVisible();
  await page.getByRole("link", { name: "Play", exact: true }).click();

  await expect(square(page, "Row 5, column 4, player 1's man")).toBeVisible();
  await expect(page.getByText("Player 2's turn", { exact: true })).toBeVisible();

  await page.reload();
  await expect(square(page, "Row 5, column 4, player 1's man")).toBeVisible();
  await expect(page.getByText("Player 2's turn", { exact: true })).toBeVisible();
});
