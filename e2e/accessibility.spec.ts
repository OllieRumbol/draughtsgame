import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Plan section 7.2, test 34: axe on each page and game state, in light and dark mode, at 320 px and 1280 px
// (spec section 6.5, item 1). The tags include WCAG 2.2, so the target size rule runs (plan section 7.1).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const WIDTHS = [320, 1280];
const MODES = ["light", "dark"] as const;

// Each state is an address, and the main heading that shows it is ready. Later tasks add their states here:
// game setup and a game (T14), the computer's turn (T15), How to play (T17) and About (T18).
const states = [
  { address: "./#/", heading: "Play" },
  { address: "./#/howtoplay", heading: "How to play" },
  { address: "./#/about", heading: "About" },
  { address: "./#/old-page", heading: "Page not found" },
];

async function openState(page: Page, address: string, heading: string): Promise<void> {
  await page.goto(address);
  await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
}

// axe gives the same result in every browser project, so it runs once, in desktop Chromium.
test.skip(({ browserName, isMobile }) => browserName !== "chromium" || isMobile, "axe runs in desktop Chromium only");

for (const state of states) {
  for (const mode of MODES) {
    for (const width of WIDTHS) {
      test(`${state.heading}, ${mode} mode, ${width} px wide, has no accessibility faults`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: mode });
        await page.setViewportSize({ width, height: 900 });
        await openState(page, state.address, state.heading);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

        expect(results.violations).toEqual([]);
      });
    }
  }
}
