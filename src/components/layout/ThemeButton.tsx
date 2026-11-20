import type { Theme } from "@/hooks/useTheme";
import styles from "./ThemeButton.module.css";

type ThemeButtonProps = {
  theme: Theme;
  onToggle: () => void;
};

// The light and dark button, as the design shows: a moon and "Dark" in light mode, a sun and "Light" in dark mode.
// Its name says what it does, "Switch to dark mode", so it also tells which mode is on (spec section 6.4.1, item 2).
// The name contains the word on the button, so a person who says "click Dark" reaches it.
export function ThemeButton({ theme, onToggle }: ThemeButtonProps) {
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button type="button" aria-label={`Switch to ${next} mode`} className={styles.button} onClick={onToggle}>
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

// The icons are drawn with the same paths as the design (docs/design/site.html), so change both together.
function MoonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}
