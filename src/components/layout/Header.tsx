import { Link, NavLink } from "react-router";
import type { Theme } from "@/hooks/useTheme";
import styles from "./Header.module.css";
import { ThemeSwitch } from "./ThemeSwitch";

// Every page links to the other two (spec section 6.1.10, item 1, and section 6.4.1, item 4).
const pages = [
  { to: "/", label: "Play" },
  { to: "/howtoplay", label: "How to play" },
  { to: "/about", label: "About" },
];

type HeaderProps = {
  theme: Theme;
  onToggleTheme: () => void;
};

// The wordmark, the page links and the light and dark switch, as the design shows. NavLink marks the current page
// with aria-current="page".
export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.wordmark}>
        Draughts
      </Link>
      <nav className={styles.nav} aria-label="Main">
        {pages.map((page) => (
          <NavLink key={page.to} to={page.to} end className={styles.link}>
            {page.label}
          </NavLink>
        ))}
        <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
      </nav>
    </header>
  );
}
