import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { apiMove, openChainGame, startComputerGame } from "./play.ts";

// Plan section 7.2, test 34: axe on each page and game state, in light and dark mode, at 320 px and 1280 px
// (spec section 6.5, item 1). The tags include WCAG 2.2, so the target size rule runs (plan section 7.1).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const WIDTHS = [320, 1280];
const MODES = ["light", "dark"] as const;

// Each state is an address, the main heading that shows it is ready, and for a game, what is done in it. Together they
// are every page, and every state and sub-state in spec section 6.3.
type ComputerState = "thinking" | "moving" | "failed" | "yourTurn";

type State = {
  name: string;
  address: string;
  heading: string;
  setup?: "computer";
  game?: "nothingSelected" | "pieceSelected" | "inChain" | "over" | "tipsShown" | "tipsLoading";
  computer?: ComputerState;
};

const states: State[] = [
  { name: "Game setup", address: "./#/", heading: "New game" },
  { name: "Game setup, against the computer", address: "./#/", heading: "New game", setup: "computer" },
  { name: "A two-player game, nothing selected", address: "./#/", heading: "Play", game: "nothingSelected" },
  { name: "A two-player game, a piece selected", address: "./#/", heading: "Play", game: "pieceSelected" },
  { name: "A two-player game, in a chain", address: "./#/", heading: "Play", game: "inChain" },
  { name: "A two-player game, over", address: "./#/", heading: "Play", game: "over" },
  { name: "A two-player game, tips shown with a piece selected", address: "./#/", heading: "Play", game: "tipsShown" },
  { name: "A two-player game, tips loading", address: "./#/", heading: "Play", game: "tipsLoading" },
  { name: "The computer thinking", address: "./#/", heading: "Play", computer: "thinking" },
  { name: "The computer moving", address: "./#/", heading: "Play", computer: "moving" },
  { name: "The computer's move failed", address: "./#/", heading: "Play", computer: "failed" },
  { name: "A computer game, your turn after its move", address: "./#/", heading: "Play", computer: "yourTurn" },
  { name: "How to play", address: "./#/howtoplay", heading: "How to play" },
  { name: "About", address: "./#/about", heading: "Ernest Rumbol" },
  { name: "Page not found", address: "./#/old-page", heading: "Page not found" },
];

// A game the computer starts, held in one of its states (spec section 6.3). The mocked API never answers for
// "thinking", answers with an error for "failed", and answers with a move for "moving", while the page's clock is
// stopped, so the move waits at its first step. For "yourTurn", the move is shown in full, so the person's turn shows
// the level and the computer's last move.
async function openComputerState(page: Page, state: ComputerState): Promise<void> {
  if (state === "moving") {
    await page.clock.install();
    // Stop the clock a minute from now: a fixed date would be in the past once that day has gone.
    await page.clock.pauseAt(new Date(Date.now() + 60_000));
  }
  let answered = false;
  await page.route("**/GetNextMove", async (route) => {
    if (state === "moving" || state === "yourTurn") {
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
    yourTurn: "Your turn",
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

// The contrast ratio of two colours, by the WCAG 2.2 formula. Each colour is "rgb(r, g, b)", as the browser gives it.
function contrastRatio(first: string, second: string): number {
  const luminance = (colour: string): number => {
    const channels = colour.match(/[\d.]+/g)?.map(Number) ?? [];
    // A see-through colour shows the colour under it, so this formula alone would give the wrong ratio.
    if (channels.length !== 3) {
      throw new Error(`Expected an opaque "rgb(r, g, b)" colour, but got "${colour}".`);
    }
    const [red, green, blue] = channels.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// Plan section 9, risk 8: axe does not check the contrast of graphics, so test 34 also measures each man on the page
// against the walnut squares. Each needs 3 to 1 (WCAG 2.2, success criterion 1.4.11). Plan section 3.6 measured 4.94
// for player 1's men and 3.10 for player 2's. The test measures the men's colour, not their fade: the faded men while
// a piece is selected are the exception in spec section 6.5, item 1.
async function menColoursOnWalnut(page: Page): Promise<{ bodies: string[]; walnut: string }> {
  return page.evaluate(() => {
    // A probe element turns each colour into "rgb(r, g, b)". An empty colour stays empty, so the test can fail on it.
    const probe = document.createElement("span");
    document.body.append(probe);
    const toRgb = (colour: string): string => {
      if (colour === "") {
        return "";
      }
      probe.style.color = colour;
      return getComputedStyle(probe).color;
    };
    const bodies = [...document.querySelectorAll("[data-look]")].map((piece) =>
      toRgb(getComputedStyle(piece).getPropertyValue("--body").trim()),
    );
    // The game board's row 1, column 2 is walnut (spec section 2.3). Pages without the game board use the token.
    const walnutSquare = document.querySelector('[role="gridcell"][aria-label^="Row 1, column 2,"]');
    const walnut = walnutSquare
      ? getComputedStyle(walnutSquare).backgroundColor
      : toRgb(getComputedStyle(document.documentElement).getPropertyValue("--walnut").trim());
    probe.remove();
    return { bodies: [...new Set(bodies)], walnut };
  });
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
        const men = await menColoursOnWalnut(page);
        if (state.game !== undefined || state.computer !== undefined) {
          // Both players' men are on the board, so the check cannot pass by measuring nothing.
          expect(men.bodies).toHaveLength(2);
        }
        for (const body of men.bodies) {
          expect(contrastRatio(body, men.walnut)).toBeGreaterThanOrEqual(3);
        }
      });
    }
  }
}
