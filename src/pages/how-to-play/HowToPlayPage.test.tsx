import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderApp } from "@/test-app";

beforeEach(() => {
  // jsdom does not lay out the page, so it has no scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
});

async function openPage(): Promise<HTMLElement> {
  renderApp("#/howtoplay");
  await screen.findByRole("heading", { level: 1, name: "How to play" });
  return screen.getByRole("main");
}

// Spec section 6.1.11, items 1 and 3, and spec section 6.4.4.
describe("the How to play page", () => {
  it("has its parts in order: the goal, the rules, our house rules, then using the game", async () => {
    const main = await openPage();

    const headings = within(main)
      .getAllByRole("heading")
      .map((heading) => `${heading.tagName} ${heading.textContent}`);
    expect(headings).toEqual([
      "H1 How to play",
      "H2 The rules",
      "H3 Moving",
      "H3 Taking",
      "H3 Jumping again",
      "H3 Kings",
      "H3 Winning",
      "H2 Our house rules",
      "H2 Using the game",
      "H3 Mouse or touch",
      "H3 Keyboard",
    ]);
    // The goal comes before the rules.
    const goal = within(main).getByText(/^Take all of your opponent's pieces/);
    const rules = within(main).getByRole("heading", { level: 2, name: "The rules" });
    expect(goal.compareDocumentPosition(rules) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("links to its three parts at the top, and to a game at the end", async () => {
    const main = await openPage();

    const contents = within(main).getByRole("navigation", { name: "On this page" });
    expect(
      within(contents)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["The rules", "Our house rules", "Using the game"]);

    const links = within(main).getAllByRole("link");
    expect(links.at(-1)).toHaveAccessibleName("Start a game");
    expect(links.at(-1)).toHaveAttribute("href", "#/");
  });

  it("moves to a part from its contents link, and takes the focus there", async () => {
    const user = userEvent.setup();
    const main = await openPage();

    await user.click(within(main).getByRole("link", { name: "Our house rules" }));

    const heading = within(main).getByRole("heading", { level: 2, name: "Our house rules" });
    expect(heading).toHaveFocus();
    expect(heading.scrollIntoView).toHaveBeenCalled();
    // The page stays on How to play: the contents links do not change the address.
    expect(window.location.hash).toBe("#/howtoplay");
  });

  it("gives each rule a board picture with a text alternative, and Show me for each but the end of the game", async () => {
    const main = await openPage();

    const pictures = within(main).getAllByRole("img");
    expect(pictures).toHaveLength(5);
    for (const picture of pictures) {
      expect(picture.getAttribute("aria-label")?.length).toBeGreaterThan(20);
    }
    expect(
      within(main)
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-label")),
    ).toEqual(["Show me: Moving", "Show me: Taking", "Show me: Jumping again", "Show me: Kings"]);
  });

  it("says how our house rules differ from standard English draughts, and links to About", async () => {
    const main = await openPage();

    const table = within(main).getByRole("table");
    const rows = within(table)
      .getAllByRole("row")
      .slice(1)
      .map((row) => within(row).getByRole("rowheader").textContent);
    expect(rows).toEqual(["Taking", "Jumping again", "Men and kings", "First move"]);
    expect(within(main).getByRole("link", { name: "Read about Ernest" })).toHaveAttribute("href", "#/about");
  });

  it("uses the game's words, not the old ones (spec section 6.1.11, item 1)", async () => {
    const main = await openPage();

    expect(main.textContent).not.toMatch(/\b(single|singles|PC|Medium)\b/);
    expect(main.textContent).toMatch(/\bmen\b/);
    expect(main.textContent).toMatch(/\bking\b/);
  });
});
