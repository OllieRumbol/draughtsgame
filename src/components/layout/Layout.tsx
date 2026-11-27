import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "./Header";
import styles from "./Layout.module.css";

// The frame of every page: the header, then the page itself. The header stays when a page fails,
// because each page has its own error boundary (plan section 4).
export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  // Each new page opens at the top. Without this, a link near the bottom of How to play opened About below Ernest's
  // story. It runs before the page is painted, so the old position never shows. React Router's ScrollRestoration
  // would also do this, but it keeps the scroll positions in sessionStorage, which spec section 6.5, item 6 does not
  // allow.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.layout}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
