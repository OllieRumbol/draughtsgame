// Light or dark mode (spec section 6.4.1, item 2, and section 6.6, item 13).
// The page follows the device's setting until the player uses the switch. From then on, the player's choice is
// kept in this browser, and the device's setting is no longer used.
import { useEffect, useState, useSyncExternalStore } from "react";
import { THEME_KEY, readItem, writeItem } from "@/services/storage";

export type Theme = "light" | "dark";

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [chosen, setChosen] = useState<Theme | null>(readChosenTheme);
  const deviceTheme = useSyncExternalStore(subscribeToDevice, readDeviceTheme, () => "light" as const);
  const theme = chosen ?? deviceTheme;

  // tokens.css follows the device by itself. data-theme on <html> is set only once the player has chosen.
  // public/theme.js sets a saved choice before the first paint. This keeps it up to date after that.
  useEffect(() => {
    if (chosen === null) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.dataset.theme = chosen;
    }
  }, [chosen]);

  function toggleTheme(): void {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setChosen(next);
    writeItem(THEME_KEY, next);
  }

  return { theme, toggleTheme };
}

// Anything other than "light" or "dark" counts as no choice, so the device's setting is used.
function readChosenTheme(): Theme | null {
  const stored = readItem(THEME_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function readDeviceTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

// The device can switch during a game. The page follows it until the player chooses (spec section 6.6, item 13).
function subscribeToDevice(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
