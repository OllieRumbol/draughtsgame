import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Plan section 7.2, test 34: axe on each page and game state, in light and dark mode, at 320 px and 1280 px
// (spec section 6.5, item 1). The tags include WCAG 2.2, so the target size rule runs (plan section 7.1).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const WIDTHS = [320, 1280];
const MODES = ["light", "dark"] as const;

// Each state is an address, the main heading that shows it is ready, and for a game, what is done in it. Later
// tasks add their states here: the computer's turn (T15), tips (T16), How to play (T17) and About (T18).
type State = {
  name: string;
  address: string;
  heading: string;
  setup?: "computer";
  game?: "pieceSelected" | "inChain" | "over";
};

const states: State[] = [
  { name: "Game setup", address: "./#/", heading: "New game" },
  { name: "Game setup, against the computer", address: "./#/", heading: "New game", setup: "computer" },
  { name: "A two-player game, a piece selected", address: "./#/", heading: "Play", game: "pieceSelected" },
  { name: "A two-player game, in a chain", address: "./#/", heading: "Play", game: "inChain" },
  { name: "A two-player game, over", address: "./#/", heading: "Play", game: "over" },
  { name: "How to play", address: "./#/howtoplay", heading: "How to play" },
  { name: "About", address: "./#/about", heading: "About" },
  { name: "Page not found", address: "./#/old-page", heading: "Page not found" },
];

// A saved two-player game where player 1's man on row 7, column 2 can jump twice (spec section 6.1.3). It is written
// on the About page, because game setup removes a saved game that it does not use.
async function openChainGame(page: Page): Promise<void> {
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
  await page.getByRole("gridcell", { name: "Row 7, column 2, player 1's man" }).click();
  await page.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }).click();
  await expect(page.getByRole("button", { name: "End turn" })).toBeVisible();
}

async function openState(page: Page, state: State): Promise<void> {
  if (state.game === "inChain") {
    await openChainGame(page);
    return;
  }
  await page.goto(state.address);
  if (state.setup === "computer") {
    await page.getByRole("radio", { name: "The computer" }).check();
  }
  if (state.game !== undefined) {
    await page.getByRole("button", { name: "Start game" }).click();
  }
  if (state.game === "pieceSelected") {
    await page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }).click();
  }
  if (state.game === "over") {
    await page.getByRole("button", { name: "Give up" }).click();
  }
  await expect(page.getByRole("heading", { level: 1, name: state.heading })).toBeVisible();
}

// axe gives the same result in every browser project, so it runs once, in desktop Chromium.
test.skip(({ browserName, isMobile }) => browserName !== "chromium" || isMobile, "axe runs in desktop Chromium only");

for (const state of states) {
  for (const mode of MODES) {
    for (const width of WIDTHS) {
      test(`${state.name}, ${mode} mode, ${width} px wide, has no accessibility faults`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: mode });
        await page.setViewportSize({ width, height: 900 });
        await openState(page, state);

        const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

        expect(results.violations).toEqual([]);
      });
    }
  }
}
