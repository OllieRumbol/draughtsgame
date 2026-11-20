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

async function findSwitch(): Promise<HTMLElement> {
  return screen.findByRole("switch", { name: "Dark mode" });
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

// Plan section 7.2, test 27: the theme switch, its name and state, and that it is remembered
// (spec section 6.4.1, item 2, and section 6.6, item 13).
describe("the light and dark switch", () => {
  it("has the name 'Dark mode', and starts in the device's mode on the first visit", async () => {
    deviceIs(true);
    renderApp();

    expect(await findSwitch()).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });

  it("is off when the device is in light mode", async () => {
    deviceIs(false);
    renderApp();

    expect(await findSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("switches the mode, says which mode is on, and remembers the choice", async () => {
    const user = userEvent.setup();
    deviceIs(false);
    renderApp();

    await user.click(await findSwitch());

    expect(await findSwitch()).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("dark");

    await user.click(await findSwitch());

    expect(await findSwitch()).toHaveAttribute("aria-checked", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
    expect(window.localStorage.getItem(THEME_KEY)).toBe("light");
  });

  it("keeps the choice after a refresh and on every page, and no longer uses the device's setting", async () => {
    window.localStorage.setItem(THEME_KEY, "dark");
    deviceIs(false);

    renderApp("#/about");

    expect(await findSwitch()).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("follows the device when it changes, until the player uses the switch (spec section 6.6, item 13)", async () => {
    const user = userEvent.setup();
    const device = deviceIs(false);
    renderApp();

    device.switchTo(true);
    expect(await findSwitch()).toHaveAttribute("aria-checked", "true");

    await user.click(await findSwitch());
    device.switchTo(true);
    device.switchTo(false);
    device.switchTo(true);

    expect(await findSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("uses the device's mode when the stored value is not 'light' or 'dark'", async () => {
    window.localStorage.setItem(THEME_KEY, "blue");
    deviceIs(true);

    renderApp();

    expect(await findSwitch()).toHaveAttribute("aria-checked", "true");
    expect(document.documentElement).not.toHaveAttribute("data-theme");
  });
});
