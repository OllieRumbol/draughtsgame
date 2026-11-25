import { type Page, expect, test } from "@playwright/test";
import { answerNextMove, apiMove, startComputerGame } from "./play.ts";

function square(page: Page, name: string) {
  return page.getByRole("gridcell", { name, exact: true });
}

// The saved game's history length and phase, as the page last wrote them. The page saves in an effect just after it
// draws, so a test that refreshes waits for the save first (plan section 3.4).
function savedGame(page: Page): Promise<{ turns: number; phase: string } | null> {
  return page.evaluate(() => {
    const text = localStorage.getItem("draughts.game.v1");
    if (text === null) {
      return null;
    }
    const game = JSON.parse(text) as { history: unknown[]; phase: { kind: string } };
    return { turns: game.history.length, phase: game.phase.kind };
  });
}

async function move(page: Page, from: string, to: string): Promise<void> {
  await square(page, from).click();
  await square(page, to).click();
}

// Plan section 7.2, test 31: a computer game with the mocked API (spec section 6.1.8, and example 23).
test.describe("a computer game across a refresh", () => {
  test("keeps the board, the turn, the level, the captured counts and Undo after a refresh (example 23)", async ({
    page,
  }) => {
    // The computer's two replies: (2,1) to (3,2), which the person then jumps, and (2,5) to (3,4).
    const replies = [apiMove([2, 1], [3, 2]), apiMove([2, 5], [3, 4])];
    await page.route("**/GetNextMove", (route) => route.fulfill({ json: replies.shift() }));
    await startComputerGame(page, "You");
    await move(page, "Row 6, column 3, your man", "Row 5, column 4, empty, target");
    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();
    await move(page, "Row 5, column 4, your man", "Row 3, column 2, empty, target");
    await expect(square(page, "Row 4, column 5, the computer's man")).toBeVisible();
    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();
    await expect.poll(() => savedGame(page)).toEqual({ turns: 4, phase: "turn" });

    await page.reload();

    await expect(square(page, "Row 3, column 2, your man")).toBeVisible();
    await expect(square(page, "Row 4, column 5, the computer's man")).toBeVisible();
    await expect(page.getByText("You took 1", { exact: true })).toBeVisible();
    await expect(page.getByText("The computer took 0", { exact: true })).toBeVisible();
    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();
    await expect(page.getByText("Against the computer · Easy")).toBeVisible();
    await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute("aria-disabled", "false");
  });

  test("keeps the undone game after a refresh, so the undone turns do not come back", async ({ page }) => {
    await answerNextMove(page, apiMove([2, 1], [3, 0]));
    await startComputerGame(page, "You");
    await move(page, "Row 6, column 3, your man", "Row 5, column 4, empty, target");
    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Undo" }).click();
    await expect.poll(() => savedGame(page)).toEqual({ turns: 0, phase: "turn" });
    await page.reload();

    await expect(square(page, "Row 6, column 3, your man")).toBeVisible();
    await expect(square(page, "Row 3, column 2, the computer's man")).toBeVisible();
    await expect(page.getByRole("button", { name: "Undo" })).toHaveAttribute("aria-disabled", "true");
  });

  test("asks again after a refresh before the computer's first move, in a game it starts (spec 6.1.8, item 3)", async ({
    page,
  }) => {
    let requests = 0;
    await page.route("**/GetNextMove", async (route) => {
      requests += 1;
      // The first request is never answered, as if the page were refreshed while the computer thinks.
      if (requests > 1) {
        await route.fulfill({ json: apiMove([2, 1], [3, 0]) });
      }
    });
    await startComputerGame(page, "The computer");
    await expect(page.getByText("The computer is thinking…")).toBeVisible();
    // The request is sent from an effect, just after "thinking" shows, so wait until it has gone out.
    await expect.poll(() => requests).toBe(1);

    await page.reload();

    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();
    await expect(square(page, "Row 4, column 1, the computer's man")).toBeVisible();
    expect(requests).toBe(2);
  });

  test("New game clears the saved game, so a refresh shows game setup", async ({ page }) => {
    await answerNextMove(page, apiMove([2, 1], [3, 0]));
    await startComputerGame(page, "You");
    await move(page, "Row 6, column 3, your man", "Row 5, column 4, empty, target");
    await expect(page.getByText("Your turn", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "New game" }).click();
    await expect.poll(() => savedGame(page)).toBeNull();
    await page.reload();

    await expect(page.getByRole("heading", { level: 1, name: "New game" })).toBeVisible();
  });
});

// Plan section 7.2, test 33: the person takes the computer's last piece, and no API call is made (example 26).
test("the person wins by taking the computer's last piece, with no API call", async ({ page }) => {
  let requests = 0;
  await page.route("**/GetNextMove", async (route) => {
    requests += 1;
    await route.abort();
  });
  // A saved game, written on the About page because game setup removes a saved game it does not use.
  await page.goto("./#/about");
  await page.evaluate(() => {
    const rows = Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 8 }, (_, col): number => ((row + col) % 2 === 1 ? 5 : 0)),
    );
    rows[5][2] = 1;
    rows[4][3] = 2;
    const snapshot = { board: rows, toMove: 1, capturedBy: { 1: 11, 2: 11 } };
    const game = {
      settings: { opponent: "computer", level: "normal", firstPlayer: 1 },
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

  await move(page, "Row 6, column 3, your man", "Row 4, column 5, empty, target");

  await expect(page.getByText("You win", { exact: true })).toBeVisible();
  await expect(page.getByText("The computer has no pieces left.", { exact: true })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(requests).toBe(0);
});
