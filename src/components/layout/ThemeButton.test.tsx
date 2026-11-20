import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { THEME_KEY } from "@/services/storage";
import { renderApp } from "@/test-app";

// A stand-in for the device's light or dark setting, which can change while the page is open.
function deviceIs(dark: boolean): { switchTo: (dark: boolean) => void } {
  let matches = dark;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return matches;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }));

  return {
    switchTo(next: boolean) {
      matches = next;
      act(() => listeners.forEach((listener) => listener()));
    },
  };
}

// The button for the mode that is on. Its name offers the other mode, and its word shows that mode too.
async function findButtonInMode(mode: "light" | "dark"): Promise<HTMLElement> {
  const offered = mode === "dark" ? "light" : "dark";
  const button = await screen.findByRole("button", { name: `Switch to ${offered} mode` });
  expect(button).toHaveTextContent(mode === "dark" ? "Light" : "Dark");
  return button;
}

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

// Plan section 7.2, test 27: the light and dark button, its name and the mode it shows, and that the choice is
// remembered (spec section 6.4.1, item 2, and section 6.6, item 13).
describe("the light and dark button", () => {
  it("starts in the device's mode on the first visit: a sun and 'Light' on a dark device", async () => {
    deviceIs(true);
    renderApp();

    await findButtonInMode("dark");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("shows a moon and 'Dark' on a light device", async () => {
    deviceIs(false);
    renderApp();

    await findButtonInMode("light");
  });

  it("switches the mode, says which mode is on, and remembers the choice", async () => {
    const user = userEvent.setup();
    deviceIs(false);
    renderApp();

    await user.click(await findButtonInMode("light"));

    await findButtonInMode("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");

    await user.click(await findButtonInMode("dark"));

    await findButtonInMode("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("keeps the choice after a refresh and on every page, and no longer uses the device's setting", async () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    deviceIs(false);

    renderApp("#/about");

    await findButtonInMode("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("follows the device when it changes, until the player uses the button (spec section 6.6, item 13)", async () => {
    const user = userEvent.setup();
    const device = deviceIs(false);
    renderApp();

    device.switchTo(true);
    await findButtonInMode("dark");

    await user.click(await findButtonInMode("dark"));
    device.switchTo(true);
    device.switchTo(false);
    device.switchTo(true);

    await findButtonInMode("light");
  });

  it("uses the device's mode when the stored value is not 'light' or 'dark'", async () => {
    window.localStorage.setItem(THEME_KEY, "blue");
    deviceIs(true);

    renderApp();

    await findButtonInMode("dark");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("draws a moon in light mode and a sun in dark mode, hidden from screen readers", async () => {
    const user = userEvent.setup();
    deviceIs(false);
    renderApp();

    const moon = (await findButtonInMode("light")).querySelector("svg");
    await user.click(await findButtonInMode("light"));
    const sun = (await findButtonInMode("dark")).querySelector("svg");

    expect(moon).toHaveAttribute("aria-hidden", "true");
    expect(sun).toHaveAttribute("aria-hidden", "true");
    expect(moon?.innerHTML).not.toBe(sun?.innerHTML);
    expect(sun?.querySelector("circle")).not.toBeNull();
  });
});
