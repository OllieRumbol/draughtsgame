import { Outlet, ScrollRestoration } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "./Header";
import styles from "./Layout.module.css";

// The frame of every page: the header, then the page itself. The header stays when a page fails,
// because each page has its own error boundary (plan section 4).
// ScrollRestoration opens each new page at the top, and Back returns to where the reader was. Without it, a link near
// the bottom of How to play opened About below Ernest's story.
export function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
