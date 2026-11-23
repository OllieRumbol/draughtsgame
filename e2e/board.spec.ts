import { expect, test } from "@playwright/test";

// Plan section 7.2, test 36: clicking a piece and a square leaves no text selection and no caret
// (spec section 6.4.2, item 7, and section 4.1, item 6).
test("clicking and double-clicking on the board selects no text and shows no caret", async ({ page }) => {
  await page.goto("./#/");
  const piece = page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" });

  await piece.click();
  await page.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }).click();
  await page.getByRole("gridcell", { name: "Row 7, column 2, player 1's man" }).dblclick();

  const result = await page.evaluate(() => {
    const square = document.querySelector('[role="gridcell"]');
    if (!square) {
      throw new Error("The board has no squares.");
    }
    const style = getComputedStyle(square);
    return {
      selectedText: window.getSelection()?.toString() ?? "",
      userSelect: style.userSelect || style.getPropertyValue("-webkit-user-select"),
      caretColor: style.caretColor,
    };
  });

  expect(result.selectedText).toBe("");
  expect(result.userSelect).toBe("none");
  expect(result.caretColor).toBe("rgba(0, 0, 0, 0)");
});

// Plan section 3.6, "Selected piece", as the owner chose on 2026-11-23 (risk 11): the player's other pieces
// shrink to 86% and fade to 70%, for both players. The other player's pieces stay as they are.
test("steps the player's other pieces back by shrinking and fading them, for both players", async ({ page }) => {
  await page.goto("./#/");
  // The look once the lift and the step-back transitions (T12) have finished.
  const looks = () =>
    page.evaluate(async () => {
      await Promise.all(document.getAnimations().map((animation) => animation.finished));
      return [...document.querySelectorAll("[data-look]")].reduce<
        Record<string, { opacity: string; transform: string }>
      >((found, piece) => {
        const style = getComputedStyle(piece);
        found[piece.getAttribute("data-look") ?? ""] = { opacity: style.opacity, transform: style.transform };
        return found;
      }, {});
    });

  await page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }).click();
  const player1 = await looks();
  await page.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }).click();
  await page.getByRole("gridcell", { name: "Row 3, column 6, player 2's man" }).click();
  const player2 = await looks();

  for (const found of [player1, player2]) {
    expect(found.steppedBack).toEqual({ opacity: "0.7", transform: "matrix(0.86, 0, 0, 0.86, 0, 0)" });
    expect(found.resting).toEqual({ opacity: "1", transform: "none" });
  }
});

// Plan section 3.6, "Keyboard focus": the two-tone ring sits outside the other marks, and the focused square's own
// wood never covers its piece (a design review found the piece hidden on 2026-11-23).
test("draws the focus ring above the pieces, and keeps the focused square's piece in view", async ({ page }) => {
  await page.goto("./#/");
  const square = page.getByRole("gridcell", { name: "Row 6, column 1, player 1's man" });

  // Focus after a key press, as keyboard play will, so the square matches :focus-visible.
  await page.keyboard.press("Shift");
  await square.focus();

  const focus = await square.evaluate((element) => {
    const ring = getComputedStyle(element, "::after");
    return {
      focusVisible: element.matches(":focus-visible"),
      squareLayer: getComputedStyle(element).zIndex,
      ringLayer: ring.zIndex,
      ring: ring.boxShadow,
    };
  });

  expect(focus.focusVisible).toBe(true);
  expect(focus.squareLayer).toBe("auto");
  expect(focus.ringLayer).toBe("5");
  expect(focus.ring).toContain("inset");
});

// Plan section 3.6, "Motion": selecting lifts the piece (180 ms), steps the others back (the design's 220 ms fade)
// and fades the target dots in (180 ms). The board times these CSS transitions from timings.ts.
test("times the lift, the step-back and the target dots as the plan sets out", async ({ page }) => {
  await page.goto("./#/");

  await page.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }).click();
  const running = await page.evaluate(() =>
    document.getAnimations().map((animation) => {
      const name =
        animation instanceof CSSTransition
          ? `transition ${animation.transitionProperty}`
          : animation instanceof CSSAnimation
            ? `animation ${animation.animationName}`
            : "script";
      return `${name} ${animation.effect?.getTiming().duration}`;
    }),
  );

  expect(running).toContain("transition transform 180");
  expect(running).toContain("transition opacity 220");
  expect(running.some((entry) => /^animation .*target-in.* 180$/.test(entry))).toBe(true);
});
