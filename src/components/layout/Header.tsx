import { Link, NavLink } from "react-router";
import { CrownIcon } from "@/components/board/CrownIcon";
import type { Theme } from "@/hooks/useTheme";
import styles from "./Header.module.css";
import { ThemeButton } from "./ThemeButton";

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

// The wordmark, the page links and the light and dark button, as the design shows. The wordmark's brass crown is the
// one beside "For Ernest" on the board's frame (plan section 3.6, "Wordmark"). It is hidden from screen readers, so the
// link's name stays "Draughts". NavLink marks the current page with aria-current="page".
export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.wordmark}>
        <span className={styles.crown}>
          <CrownIcon size={25} />
        </span>
        Draughts
      </Link>
      <nav className={styles.nav} aria-label="Main">
        {pages.map((page) => (
          <NavLink key={page.to} to={page.to} className={styles.link}>
            {page.label}
          </NavLink>
        ))}
        <ThemeButton theme={theme} onToggle={onToggleTheme} />
      </nav>
    </header>
  );
}
