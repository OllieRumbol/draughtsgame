import { expect, test } from "@playwright/test";

// The built site opens and runs in every browser project, under its Content Security Policy.
// A blocked script, style or font is reported as a console error, so this test fails on it.
test("the Play page opens with no errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("./");

  // With no saved game, the Play page opens on game setup.
  await expect(page.getByRole("heading", { level: 1, name: "New game" })).toBeVisible();
  // Wait until nothing else is loading, so a font or style blocked after the heading appears is caught too.
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
