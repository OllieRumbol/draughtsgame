import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isValidElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageErrorBoundary } from "@/components/layout/PageErrorBoundary";
import { routes } from "@/routes";
import { renderApp } from "@/test-app";

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Plan section 7.2, test 28: the routes, including the old addresses (spec section 6.1.10).
describe("the routes", () => {
  it.each([
    ["#/", "Play"],
    ["#/howtoplay", "How to play"],
    ["#/about", "About"],
  ])("%s opens %s, and marks it as the current page", async (hash, name) => {
    renderApp(hash);

    expect(await screen.findByRole("heading", { level: 1, name })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(within(nav).getByRole("link", { name })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getAllByRole("link", { current: "page" })).toHaveLength(1);
  });

  it("shows 'page not found' with a link to Play for an unknown address (item 3)", async () => {
    renderApp("#/old-page");

    expect(await screen.findByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Play" })).toHaveAttribute("href", "#/");
  });

  it("links every page to the other two, and moves between them (item 1, and spec section 6.4.1, item 4)", async () => {
    const user = userEvent.setup();
    renderApp("#/");
    const nav = await screen.findByRole("navigation", { name: "Main" });

    expect(within(nav).getByRole("link", { name: "Play" })).toHaveAttribute("href", "#/");
    expect(within(nav).getByRole("link", { name: "How to play" })).toHaveAttribute("href", "#/howtoplay");
    expect(within(nav).getByRole("link", { name: "About" })).toHaveAttribute("href", "#/about");

    await user.click(within(nav).getByRole("link", { name: "About" }));
    expect(await screen.findByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Draughts" }));
    expect(await screen.findByRole("heading", { level: 1, name: "Play" })).toBeInTheDocument();
  });

  it("wraps every page in its own error boundary, so the header stays when a page fails (plan section 4)", () => {
    const pages = routes[0].children ?? [];

    expect(pages).toHaveLength(4);
    for (const page of pages) {
      expect(isValidElement(page.element) && page.element.type === PageErrorBoundary).toBe(true);
    }
  });

  it("gives each page one main heading and its own title", async () => {
    renderApp("#/howtoplay");

    expect(await screen.findAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(document.title).toBe("How to play – Draughts");
  });
});
