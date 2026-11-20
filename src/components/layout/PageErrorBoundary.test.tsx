import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Layout } from "@/components/layout/Layout";
import { PageErrorBoundary } from "@/components/layout/PageErrorBoundary";
import { SAVED_GAME_KEY } from "@/services/storage";

let pageFails = true;

function PageThatFails() {
  if (pageFails) {
    throw new Error("A fault while drawing the page");
  }
  return <h1>Game setup</h1>;
}

function renderFailingPage() {
  const router = createMemoryRouter(
    [
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: (
              <PageErrorBoundary>
                <PageThatFails />
              </PageErrorBoundary>
            ),
          },
          {
            path: "about",
            element: (
              <PageErrorBoundary>
                <h1>About</h1>
              </PageErrorBoundary>
            ),
          },
        ],
      },
    ],
    { initialEntries: ["/"] },
  );
  return render(<RouterProvider router={router} />);
}

beforeEach(() => {
  pageFails = true;
  // React reports the caught error on the console. The test expects it.
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

// Plan section 4: an unexpected error while a page draws.
describe("the page error boundary", () => {
  it("shows 'Something went wrong' with New game, and the header and the other pages keep working", async () => {
    const user = userEvent.setup();
    renderFailingPage();

    expect(await screen.findByRole("heading", { level: 1, name: "Something went wrong" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New game" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "About" }));
    expect(await screen.findByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Something went wrong" })).not.toBeInTheDocument();
  });

  it("draws a page again when the player comes back to it", async () => {
    const user = userEvent.setup();
    renderFailingPage();
    await screen.findByRole("heading", { level: 1, name: "Something went wrong" });

    await user.click(screen.getByRole("link", { name: "About" }));
    pageFails = false;
    await user.click(screen.getByRole("link", { name: "Play" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Game setup" })).toBeInTheDocument();
  });

  it("New game clears the saved game and draws the page again", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(SAVED_GAME_KEY, "a save that broke the page");
    renderFailingPage();

    const newGame = await screen.findByRole("button", { name: "New game" });
    pageFails = false;
    await user.click(newGame);

    expect(window.localStorage.getItem(SAVED_GAME_KEY)).toBeNull();
    expect(await screen.findByRole("heading", { level: 1, name: "Game setup" })).toBeInTheDocument();
  });
});
