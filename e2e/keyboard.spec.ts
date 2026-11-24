import { type Page, expect, test } from "@playwright/test";

// The accessible name of the focused element.
function focusedName(page: Page): Promise<string | null> {
  return page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? null);
}

// Spec section 6.4.3, items 1 to 3, and plan section 3.3.6, in a real browser: Tab reaches the board, the arrow
// keys move the focus, and Enter and Space reach a square as the browser's own button press. A light square
// ignores them.
test("plays a move with the keyboard alone, and the live region says it", async ({ page }) => {
  await page.goto("./#/");

  // Tab moves through the page's controls and then into the board.
  let name: string | null = null;
  for (let press = 0; press < 20 && name?.startsWith("Row") !== true; press++) {
    await page.keyboard.press("Tab");
    name = await focusedName(page);
  }
  expect(name).toBe("Row 6, column 1, player 1's man");

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
  await page.goto("./#/");
  await page.getByRole("gridcell", { name: "Row 6, column 1, player 1's man" }).focus();

  await page.keyboard.press("Enter");
  await page.keyboard.press("Escape");

  await expect(page.getByRole("status")).toHaveText("Put down.");
  expect(await focusedName(page)).toBe("Row 6, column 1, player 1's man");
});

// An arrow key at the edge of the board moves nothing: not the focus, and not the page.
test("the arrow keys do not scroll the page", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto("./#/");
  await page.getByRole("gridcell", { name: "Row 1, column 2, player 2's man" }).focus();
  // The page is scrolled part-way, so an arrow key could scroll it either way.
  const scrolled = await page.evaluate(() => {
    window.scrollTo(0, 100);
    return window.scrollY;
  });
  expect(scrolled).toBe(100);

  await page.keyboard.press("ArrowUp");

  expect(await focusedName(page)).toBe("Row 1, column 2, player 2's man");
  expect(await page.evaluate(() => window.scrollY)).toBe(100);
});
