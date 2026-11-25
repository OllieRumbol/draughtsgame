import { type Page, expect, test } from "@playwright/test";
import { startTwoPlayerGame } from "./play.ts";

// Plan section 3.6, "Page size": on a large screen, the Play page's board fills the window's height, less the header
// and the page's margins, up to 840 px, and nothing scrolls. The owner chose this on 2026-11-25.
const WINDOWS = [
  { width: 1280, height: 720 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
];

// The board's frame, measured on the page.
function boardFrame(page: Page) {
  return page.evaluate(() => {
    const grid = document.querySelector('[role="grid"], [role="img"]');
    const frame = grid?.closest('[class*="frame"]') ?? grid;
    const box = frame?.getBoundingClientRect();
    const page = document.documentElement;
    return {
      height: Math.round(box?.height ?? 0),
      bottom: Math.round(box?.bottom ?? 0),
      scrollsDown: page.scrollHeight > window.innerHeight,
      scrollsSideways: page.scrollWidth > window.innerWidth,
    };
  });
}

// Window sizes are set here, so the phone projects add nothing.
test.skip(({ isMobile }) => isMobile, "desktop window sizes only");

for (const window of WINDOWS) {
  test(`at ${window.width} × ${window.height}, the board fills the window's height with nothing to scroll`, async ({
    page,
  }) => {
    await page.setViewportSize(window);

    await page.goto("./#/");
    await expect(page.getByRole("button", { name: "Start game" })).toBeVisible();
    const setup = await boardFrame(page);
    await startTwoPlayerGame(page);
    const game = await boardFrame(page);

    for (const frame of [setup, game]) {
      expect(frame.scrollsDown).toBe(false);
      expect(frame.scrollsSideways).toBe(false);
      expect(frame.bottom).toBeLessThanOrEqual(window.height);
      // The frame takes the window's height less about 130 px for the header and the margins, or its 840 px limit.
      expect(frame.height).toBeGreaterThanOrEqual(Math.min(window.height - 150, 840));
    }
  });
}
