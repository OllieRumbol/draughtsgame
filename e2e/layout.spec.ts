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
