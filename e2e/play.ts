import { type Page, expect } from "@playwright/test";

// Opens the Play page with no saved game and starts a two-player game with the defaults (spec section 6.1.1).
export async function startTwoPlayerGame(page: Page): Promise<void> {
  await page.goto("./#/");
  await page.getByRole("button", { name: "Start game" }).click();
  await expect(page.getByRole("grid", { name: "Draughts board" })).toBeVisible();
}
