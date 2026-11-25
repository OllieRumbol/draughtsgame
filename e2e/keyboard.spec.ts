import { type Page, expect, test } from "@playwright/test";
import { startTwoPlayerGame } from "./play.ts";

// The accessible name of the focused element.
function focusedName(page: Page): Promise<string | null> {
  return page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? null);
}

// Spec section 6.4.3, items 1 to 3, and plan section 3.3.6, in a real browser: Tab reaches the board, the arrow
// keys move the focus, and Enter and Space reach a square as the browser's own button press. A light square
// ignores them.
test("plays a move with the keyboard alone, and the live region says it", async ({ page }) => {
  await page.goto("./#/");

  // Tab moves through the page's controls to Start game. Starting the game moves the focus into the board.
  let name: string | null = null;
  for (let press = 0; press < 30 && name !== "Start game"; press++) {
    await page.keyboard.press("Tab");
    name = await page.evaluate(() => document.activeElement?.textContent ?? null);
  }
  expect(name).toBe("Start game");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Game started. Player 1 moves first.");
  expect(await focusedName(page)).toBe("Row 6, column 1, player 1's man");

  // Tab leaves the board for the controls, and Shift+Tab comes back to the same square.
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.textContent)).toBe("Show tips");
  await page.keyboard.press("Shift+Tab");
  expect(await focusedName(page)).toBe("Row 6, column 1, player 1's man");

  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  expect(await focusedName(page)).toBe("Row 6, column 3, player 1's man, selected");
  await expect(page.getByRole("status")).toHaveText("Selected row 6, column 3. 2 targets.");

  // Enter and Space on a light square leave the selection as it is.
  await page.keyboard.press("ArrowRight");
  expect(await focusedName(page)).toBe("Row 6, column 4, light square");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man, selected" })).toBeVisible();

  await page.keyboard.press("ArrowUp");
  expect(await focusedName(page)).toBe("Row 5, column 4, empty, target");
  await page.keyboard.press("Space");

  await expect(page.getByRole("status")).toHaveText("Player 1 moved to row 5, column 4. Player 2's turn.");
  expect(await focusedName(page)).toBe("Row 5, column 4, player 1's man");
});

test("puts the piece down with Escape", async ({ page }) => {
  await startTwoPlayerGame(page);
  await page.getByRole("gridcell", { name: "Row 6, column 1, player 1's man" }).focus();

  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");

  await expect(page.getByRole("status")).toHaveText("Put down.");
  expect(await focusedName(page)).toBe("Row 6, column 1, player 1's man");
});

// An arrow key at the edge of the board moves nothing: not the focus, and not the page.
test("the arrow keys do not scroll the page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 300 });
  await startTwoPlayerGame(page);
  await page.getByRole("gridcell", { name: "Row 1, column 2, player 2's man" }).focus();
  // The page is scrolled halfway down its room to scroll, so an arrow key could scroll it either way. The board
  // shrinks with a short window (plan section 3.6, "Page size"), so the room depends on the layout.
  const scrolled = await page.evaluate(() => {
    const room = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, Math.floor(room / 2));
    return window.scrollY;
  });
  expect(scrolled).toBeGreaterThanOrEqual(20);

  await page.keyboard.press("ArrowUp");
  // A browser scrolls smoothly after an arrow key, over a few hundred milliseconds, so wait before checking.
  await page.waitForTimeout(400);

  expect(await focusedName(page)).toBe("Row 1, column 2, player 2's man");
  expect(await page.evaluate(() => window.scrollY)).toBe(scrolled);
});
