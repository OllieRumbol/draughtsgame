import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { apiMove, startComputerGame } from "./play.ts";

// Plan section 7.2, test 34: axe on each page and game state, in light and dark mode, at 320 px and 1280 px
// (spec section 6.5, item 1). The tags include WCAG 2.2, so the target size rule runs (plan section 7.1).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const WIDTHS = [320, 1280];
const MODES = ["light", "dark"] as const;

// Each state is an address, the main heading that shows it is ready, and for a game, what is done in it. Later
// tasks add their states here: How to play (T17) and About (T18).
type State = {
  name: string;
  address: string;
  heading: string;
  setup?: "computer";
  game?: "pieceSelected" | "inChain" | "over" | "tipsShown" | "tipsLoading";
  computer?: "thinking" | "moving" | "failed";
};

const states: State[] = [
  { name: "Game setup", address: "./#/", heading: "New game" },
  { name: "Game setup, against the computer", address: "./#/", heading: "New game", setup: "computer" },
  { name: "A two-player game, a piece selected", address: "./#/", heading: "Play", game: "pieceSelected" },
  { name: "A two-player game, in a chain", address: "./#/", heading: "Play", game: "inChain" },
  { name: "A two-player game, over", address: "./#/", heading: "Play", game: "over" },
  { name: "A two-player game, tips shown with a piece selected", address: "./#/", heading: "Play", game: "tipsShown" },
  { name: "A two-player game, tips loading", address: "./#/", heading: "Play", game: "tipsLoading" },
  { name: "The computer thinking", address: "./#/", heading: "Play", computer: "thinking" },
  { name: "The computer moving", address: "./#/", heading: "Play", computer: "moving" },
  { name: "The computer's move failed", address: "./#/", heading: "Play", computer: "failed" },
  { name: "How to play", address: "./#/howtoplay", heading: "How to play" },
  { name: "About", address: "./#/about", heading: "Ernest Rumbol" },
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

// A game the computer starts, held in one of its states (spec section 6.3). The mocked API never answers for
// "thinking", answers with an error for "failed", and answers with a move for "moving", while the page's clock is
// stopped, so the move waits at its first step.
async function openComputerState(page: Page, state: "thinking" | "moving" | "failed"): Promise<void> {
  if (state === "moving") {
    await page.clock.install();
    // Stop the clock a minute from now: a fixed date would be in the past once that day has gone.
    await page.clock.pauseAt(new Date(Date.now() + 60_000));
  }
  let answered = false;
  await page.route("**/GetNextMove", async (route) => {
    if (state === "moving") {
      await route.fulfill({ json: apiMove([2, 1], [3, 0]) });
      answered = true;
    }
    if (state === "failed") {
      await route.fulfill({ status: 500, json: {} });
    }
  });
  await startComputerGame(page, "The computer");
  if (state === "moving") {
    // The move waits 900 ms of the page's time: the person's slide and the computer's thinking time (plan 3.6).
    await expect.poll(() => answered).toBe(true);
    await page.clock.runFor(900);
  }
  const titles = {
    thinking: "The computer is thinking…",
    moving: "The computer is moving",
    failed: "The computer couldn't move",
  };
  await expect(page.getByText(titles[state], { exact: true })).toBeVisible();
}

// axe runs on the page's timers. While the page's clock is stopped to hold the computer's move, the clock moves on
// 1 ms at a time until axe has finished. The move takes 380 ms of the page's time, so it is still being shown.
async function analyzeOnStoppedClock(page: Page, axe: AxeBuilder): Promise<Awaited<ReturnType<AxeBuilder["analyze"]>>> {
  let finished = false;
  const analysis = axe.analyze().finally(() => {
    finished = true;
  });
  let elapsed = 0;
  while (!finished && elapsed < 300) {
    await page.clock.runFor(1);
    elapsed += 1;
  }
  if (!finished) {
    throw new Error("axe did not finish within 300 ms of the page's time, so the computer's move would have ended.");
  }
  const results = await analysis;
  await expect(page.getByText("The computer is moving", { exact: true })).toBeVisible();
  return results;
}

async function openState(page: Page, state: State): Promise<void> {
  if (state.computer !== undefined) {
    await openComputerState(page, state.computer);
    return;
  }
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
  if (state.game === "tipsShown") {
    // Row 5's dark squares, which player 1 can finish a move on from the starting board (spec section 5.2).
    const potentialMoves = [1, 3, 5, 7].map((width) => ({ height: 4, width }));
    await page.route("**/GetPotentialMoves", (route) => route.fulfill({ json: { successful: true, potentialMoves } }));
    await page.getByRole("button", { name: "Show tips" }).click();
    await expect(page.getByRole("gridcell", { name: "Row 5, column 2, empty, tip" })).toBeVisible();
    await page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }).click();
  }
  if (state.game === "tipsLoading") {
    // The mocked API never answers, so the tips stay loading (spec section 6.3, "Tips loading").
    await page.route("**/GetPotentialMoves", () => {});
    await page.getByRole("button", { name: "Show tips" }).click();
    await expect(page.getByRole("button", { name: "Loading tips…" })).toBeVisible();
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

        const axe = new AxeBuilder({ page }).withTags(WCAG_TAGS);
        const results = state.computer === "moving" ? await analyzeOnStoppedClock(page, axe) : await axe.analyze();

        expect(results.violations).toEqual([]);
      });
    }
  }
}
