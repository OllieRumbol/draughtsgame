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
