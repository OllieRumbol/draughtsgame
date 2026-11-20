import { expect, test, type Page } from "@playwright/test";

// The light and dark modes in a real browser (spec section 6.4.1, item 2, and section 6.6, item 13).
// The page colours come from tokens.css: --page is #F6EFE3 in light mode and #1C1814 in dark mode.
const LIGHT_PAGE = "rgb(246, 239, 227)";
const DARK_PAGE = "rgb(28, 24, 20)";

// The light and dark button. Its name offers the other mode: "Switch to dark mode" while light mode is on.
function themeButton(page: Page, modeOn: "light" | "dark") {
  return page.getByRole("button", { name: `Switch to ${modeOn === "dark" ? "light" : "dark"} mode` });
}

test("follows the device's setting while the page is open, until the player uses the light and dark button", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./#/");
  await expect(themeButton(page, "light")).toHaveText("Dark");
  await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_PAGE);

  await page.emulateMedia({ colorScheme: "dark" });

  await expect(themeButton(page, "dark")).toHaveText("Light");
  await expect(page.locator("body")).toHaveCSS("background-color", DARK_PAGE);

  await themeButton(page, "dark").click();
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });

  await expect(themeButton(page, "light")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_PAGE);
});

test("shows the player's saved choice from the first paint, not the device's mode first", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => window.localStorage.setItem("draughts.theme", "light"));
  await page.goto("./#/about", { waitUntil: "commit" });

  // The first page colour once the styles apply. Before that, the body has no background. The test polls with
  // page.evaluate, because the site's Content Security Policy blocks the eval that a string in waitForFunction uses.
  let firstColour = "";
  for (let attempt = 0; attempt < 500 && ["", "rgba(0, 0, 0, 0)"].includes(firstColour); attempt++) {
    firstColour = await page.evaluate(() => (document.body ? getComputedStyle(document.body).backgroundColor : ""));
  }

  expect(firstColour).toBe(LIGHT_PAGE);
});

test("keeps the player's choice after a refresh and on another page", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./#/");

  await themeButton(page, "light").click();
  await expect(page.locator("body")).toHaveCSS("background-color", DARK_PAGE);

  await page.reload();
  await page.getByRole("link", { name: "About" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
  await expect(themeButton(page, "dark")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("background-color", DARK_PAGE);
});
