import type { Theme } from "@/hooks/useTheme";
import styles from "./ThemeSwitch.module.css";

type ThemeSwitchProps = {
  theme: Theme;
  onToggle: () => void;
};

// Spec section 6.4.1, item 2: the switch has an accessible name, "Dark mode", and its state says which mode is on.
export function ThemeSwitch({ theme, onToggle }: ThemeSwitchProps) {
  return (
    <button type="button" role="switch" aria-checked={theme === "dark"} className={styles.switch} onClick={onToggle}>
      Dark mode
      <span className={styles.track} aria-hidden="true" />
    </button>
  );
}
