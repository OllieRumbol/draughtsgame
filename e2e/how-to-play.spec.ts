import { type Locator, expect, test } from "@playwright/test";

// Where a picture's first piece is drawn, in pixels from the picture's top left corner.
async function firstPieceAt(picture: Locator): Promise<{ x: number; y: number }> {
  return picture.evaluate((element) => {
    const piece = element.querySelector("[data-piece]")?.parentElement;
    if (!piece) {
      throw new Error("The picture has no pieces.");
    }
    const frame = element.getBoundingClientRect();
    const box = piece.getBoundingClientRect();
    return { x: Math.round(box.left - frame.left), y: Math.round(box.top - frame.top) };
  });
}

// Spec section 6.1.11, item 3, and plan section 3.6: "Show me" plays the move with the board's motion in a real
// browser, then the picture returns to its still state with its marks.
test("Show me slides the man over the man it takes, then returns to the still picture", async ({ page }) => {
  await page.goto("./#/howtoplay");
  const rule = page.getByRole("button", { name: "Show me: Taking" }).locator("..");
  const picture = rule.getByRole("img");
  const marks = picture.locator("[data-marks]");
  const before = await firstPieceAt(picture);
  await expect(picture.getByTestId("taken")).toHaveCount(1);
  await expect(marks).toHaveAttribute("data-marks", "shown");

  await page.getByRole("button", { name: "Show me: Taking" }).click();

  // The marks fade out while it plays, and the man moves up and to the right.
  await expect(marks).toHaveAttribute("data-marks", "hidden");
  await expect.poll(async () => (await firstPieceAt(picture)).y).toBeLessThan(before.y);
  const after = await firstPieceAt(picture);
  expect(after.x).toBeGreaterThan(before.x);

  // About a second after the move, the still picture is back.
  await expect(marks).toHaveAttribute("data-marks", "shown", { timeout: 4000 });
  expect(await firstPieceAt(picture)).toEqual(before);
});

test("a contents link moves to its part of the page", async ({ page }) => {
  await page.goto("./#/howtoplay");

  await page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name: "Using the game" }).click();

  const heading = page.getByRole("heading", { level: 2, name: "Using the game" });
  await expect(heading).toBeFocused();
  await expect(heading).toBeInViewport();
  await expect(page).toHaveURL(/#\/howtoplay$/);
});
