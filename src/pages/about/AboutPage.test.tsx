import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderApp } from "@/test-app";

async function openPage(): Promise<HTMLElement> {
  renderApp("#/about");
  await screen.findByRole("heading", { level: 1, name: "Ernest Rumbol" });
  return screen.getByRole("main");
}

// True when `first` comes before `second` on the page.
function comesBefore(first: Element, second: Element): boolean {
  return (first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
}

// Plan section 7.2, test 29, and spec section 6.1.11, items 5 to 7.
describe("the About page", () => {
  it("has its five parts in order: the name, the photo, the tribute, the family board, then how it's built", async () => {
    const main = await openPage();

    const name = within(main).getByRole("heading", { level: 1 });
    const photo = within(main).getByRole("img", { name: "Placeholder for a photo of Ernest" });
    const tribute = within(main).getByText(/^This game was made in loving memory/);
    const board = within(main).getByRole("img", { name: "Placeholder for a photo of the family draughts board" });
    const built = within(main).getByRole("heading", { level: 2, name: "How it's built" });

    expect(name).toHaveTextContent(/^Ernest Rumbol$/);
    expect(comesBefore(name, photo)).toBe(true);
    expect(comesBefore(photo, tribute)).toBe(true);
    expect(comesBefore(tribute, board)).toBe(true);
    expect(comesBefore(board, built)).toBe(true);
    expect(
      within(main)
        .getAllByRole("heading")
        .map((heading) => heading.textContent),
    ).toEqual(["Ernest Rumbol", "How it's built"]);
  });

  it("shows the tribute from About.js in three paragraphs, with 'passed away' and the owner's accepted edits", async () => {
    const main = await openPage();

    const paragraphs = within(main)
      .getAllByRole("paragraph")
      .map((paragraph) => paragraph.textContent)
      .slice(0, 3);
    expect(paragraphs).toEqual([
      "This game was made in loving memory of my grandad, Ernest Rumbol, who sadly passed away in December of 2020. My grandad taught me this game many years ago. Over the years we played thousands of games together.",
      "As I got older and understood the game better, I won more games. However, Grandad still loved playing, even when he wiped the board clean because he lost the game after the first move. We played with many different rule sets. His favourite was forcing players to take a piece when they could, but I thought the game was more tactical if you didn't.",
      "I hope that people have as much fun playing this game as we did. May my grandad rest in peace.",
    ]);
    expect(main.textContent).not.toMatch(/past away/);
  });

  it("shows a visible placeholder for each photo and for the photo's caption until the owner supplies them", async () => {
    const main = await openPage();

    expect(within(main).getAllByText("Placeholder until the owner supplies it")).toHaveLength(2);
    expect(within(main).getByText(/^Caption to come, in the owner's words/)).toBeInTheDocument();
    expect(within(main).getByText("The board we played on")).toBeInTheDocument();
  });

  it("links to the web app's repository and the API's repository under How it's built", async () => {
    const main = await openPage();

    expect(within(main).getByRole("link", { name: "the web app" })).toHaveAttribute(
      "href",
      "https://github.com/OllieRumbol/draughtsgame",
    );
    expect(within(main).getByRole("link", { name: "the API" })).toHaveAttribute(
      "href",
      "https://github.com/OllieRumbol/DraughtsGameFunction",
    );
  });

  it("has no project plan cards and no old list of tools (item 6)", async () => {
    const main = await openPage();

    expect(within(main).queryByRole("list")).not.toBeInTheDocument();
    expect(main.textContent).not.toMatch(/Project Plan|Epic|Technical information|React bootstrap|React router/i);
    expect(within(main).getAllByRole("link")).toHaveLength(2);
  });
});
