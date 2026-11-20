import { Outlet } from "react-router";
import { useTheme } from "@/hooks/useTheme";
import { Header } from "./Header";
import styles from "./Layout.module.css";

// The frame of every page: the header, then the page itself. The header stays when a page fails,
// because each page has its own error boundary (plan section 4).
export function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.layout}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
