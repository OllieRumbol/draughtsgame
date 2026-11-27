import { type Page, expect, test } from "@playwright/test";
import { startTwoPlayerGame } from "./play.ts";

// Plan section 3.6, "Page size": on a window 1,000 px or wider, the Play page's board fills the window's height, less
// the header and the page's margins, up to 840 px, and nothing scrolls. The header keeps the same edges as the game.
// Narrower windows keep the design's columns. The owner chose this on 2026-11-25.
const LARGE_WINDOWS = [
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

// Narrower windows, with the board's frame width before the change, so the board is never smaller than it was.
const NARROW_WINDOWS = [
  { width: 641, height: 900, setupBefore: 341, gameBefore: 306 },
  { width: 800, height: 1280, setupBefore: 434, gameBefore: 404 },
];

// The board's frame, the header, and the content's edges, measured on the page.
function measure(page: Page) {
  return page.evaluate(() => {
    const frame = document.querySelector('[data-testid="board-frame"]')?.getBoundingClientRect();
    const header = document.querySelector("header")?.getBoundingClientRect();
    // The content is the Play page's grid. Its columns fill it from edge to edge when the header and the game line up.
    const grid = document.querySelector('[data-page="play"] > div');
    const box = grid?.getBoundingClientRect();
    const style = grid ? getComputedStyle(grid) : null;
    const columns = (style?.gridTemplateColumns ?? "").split(" ").map(parseFloat);
    const gap = parseFloat(style?.columnGap ?? "0");
    const columnsWidth = columns.reduce((sum, width) => sum + width, 0) + gap * (columns.length - 1);
    const root = document.documentElement;
    return {
      frameWidth: Math.round(frame?.width ?? 0),
      frameHeight: Math.round(frame?.height ?? 0),
      frameBottom: Math.round(frame?.bottom ?? 0),
      headerLeft: Math.round(header?.left ?? 0),
      headerRight: Math.round(header?.right ?? 0),
      contentLeft: Math.round(box?.left ?? 0),
      contentRight: Math.round((box?.left ?? 0) + columnsWidth),
      scrollsDown: root.scrollHeight > window.innerHeight,
      scrollsSideways: root.scrollWidth > window.innerWidth,
    };
  });
}

// Window sizes are set here, so the phone projects add nothing.
test.skip(({ isMobile }) => isMobile, "desktop window sizes only");

for (const size of LARGE_WINDOWS) {
  test(`at ${size.width} × ${size.height}, the board fills the window's height, lined up with the header`, async ({
    page,
  }) => {
    await page.setViewportSize(size);

    await page.goto("./#/");
    await expect(page.getByRole("button", { name: "Start game" })).toBeVisible();
    const setup = await measure(page);
    await startTwoPlayerGame(page);
    const game = await measure(page);

    for (const screen of [setup, game]) {
      expect(screen.scrollsDown).toBe(false);
      expect(screen.scrollsSideways).toBe(false);
      expect(screen.frameBottom).toBeLessThanOrEqual(size.height);
      // The frame takes the window's height less about 130 px for the header and the margins, or its 840 px limit.
      expect(screen.frameHeight).toBeGreaterThanOrEqual(Math.min(size.height - 150, 840));
      expect(Math.abs(screen.contentLeft - screen.headerLeft)).toBeLessThanOrEqual(1);
      expect(Math.abs(screen.contentRight - screen.headerRight)).toBeLessThanOrEqual(1);
    }
  });
}

for (const size of NARROW_WINDOWS) {
  test(`at ${size.width} × ${size.height}, the board is no smaller than in the design's columns`, async ({ page }) => {
    await page.setViewportSize(size);

    await page.goto("./#/");
    await expect(page.getByRole("button", { name: "Start game" })).toBeVisible();
    const setup = await measure(page);
    await startTwoPlayerGame(page);
    const game = await measure(page);

    expect(setup.frameWidth).toBeGreaterThanOrEqual(size.setupBefore - 2);
    expect(game.frameWidth).toBeGreaterThanOrEqual(size.gameBefore - 2);
    expect(game.scrollsSideways).toBe(false);
  });
}

// Plan section 7.2, test 35: no page scrolls sideways at 320 px, at 2560 px, or at 200% zoom on a 1280 px window
// (spec section 6.4.1, item 3, and section 6.6, item 14). A 1280 by 900 window at 200% zoom lays the page out in
// 640 by 450 CSS pixels, at 2 device pixels to each, so the test sets that window. WCAG's reflow rule uses the same
// equivalence: 1280 CSS pixels at 400% zoom is 320 CSS pixels.
const SCROLL_WINDOWS = [
  { name: "320 px wide", viewport: { width: 320, height: 800 }, deviceScaleFactor: 1 },
  { name: "2560 px wide", viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1 },
  { name: "1280 px wide at 200% zoom", viewport: { width: 640, height: 450 }, deviceScaleFactor: 2 },
];

// A two-player game late on, with 11 men captured by each player, so the captured stacks are at their largest.
// It is saved before the page loads (plan section 3.4).
async function saveLateGame(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const rows = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col): number => ((row + col) % 2 === 1 ? 5 : 0)),
    );
    rows[6][1] = 1;
    rows[1][6] = 2;
    const snapshot = { board: rows, toMove: 1, capturedBy: { 1: 11, 2: 11 } };
    const game = {
      settings: { opponent: "twoPlayers", level: "easy", firstPlayer: 1 },
      ...snapshot,
      turnStart: snapshot,
      history: [],
      lastComputerMove: null,
      requestCount: 0,
      phase: { kind: "turn", selected: null, chain: null },
    };
    window.localStorage.setItem("draughts.game.v1", JSON.stringify(game));
  });
}

// Every page, and the Play page's setup, a game, and a result. Each opens on its main heading.
const PAGES = [
  { name: "Game setup", open: (page: Page) => page.goto("./#/").then(() => undefined), heading: "New game" },
  {
    name: "A game with 11 men captured by each player",
    open: async (page: Page) => {
      await saveLateGame(page);
      await page.goto("./#/");
      await expect(page.getByText("Player 1 took 11", { exact: true })).toBeVisible();
      await expect(page.getByText("Player 2 took 11", { exact: true })).toBeVisible();
    },
    heading: "Play",
  },
  {
    name: "A game over",
    open: async (page: Page) => {
      await startTwoPlayerGame(page);
      await page.getByRole("button", { name: "Give up" }).click();
    },
    heading: "Play",
  },
  {
    name: "How to play",
    open: (page: Page) => page.goto("./#/howtoplay").then(() => undefined),
    heading: "How to play",
  },
  { name: "About", open: (page: Page) => page.goto("./#/about").then(() => undefined), heading: "Ernest Rumbol" },
  {
    name: "Page not found",
    open: (page: Page) => page.goto("./#/old-page").then(() => undefined),
    heading: "Page not found",
  },
];

for (const windowSize of SCROLL_WINDOWS) {
  test.describe(`at ${windowSize.name}`, () => {
    test.use({ viewport: windowSize.viewport, deviceScaleFactor: windowSize.deviceScaleFactor });

    for (const shown of PAGES) {
      test(`${shown.name} does not scroll sideways`, async ({ page }) => {
        await shown.open(page);
        await expect(page.getByRole("heading", { level: 1, name: shown.heading })).toBeVisible();

        const widths = await page.evaluate(() => ({
          content: document.documentElement.scrollWidth,
          window: document.documentElement.clientWidth,
        }));

        expect(widths.content).toBeLessThanOrEqual(widths.window);
      });
    }
  });
}

// Spec section 6.4.2, item 4: at 320 px wide, each square is at least 24 by 24 CSS pixels (WCAG 2.2, success
// criterion 2.5.8).
test("at 320 px wide, each square of the board is at least 24 by 24 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await startTwoPlayerGame(page);

  const sizes = await page
    .getByRole("gridcell")
    .evaluateAll((squares) => squares.map((square) => square.getBoundingClientRect()));

  expect(sizes).toHaveLength(64);
  for (const size of sizes) {
    expect(size.width).toBeGreaterThanOrEqual(24);
    expect(size.height).toBeGreaterThanOrEqual(24);
  }
});
