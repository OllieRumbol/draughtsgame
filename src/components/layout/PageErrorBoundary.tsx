import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router";
import { SAVED_GAME_KEY, removeItem } from "@/services/storage";
import buttons from "@/styles/buttons.module.css";

type PageErrorBoundaryProps = {
  children: ReactNode;
};

// Plan section 4: an unexpected error while a page draws shows "Something went wrong" with "New game".
// The header and the other pages keep working. React Router keeps the same boundary when the page changes,
// so the boundary resets whenever the address changes.
export function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  const { pathname } = useLocation();

  return (
    <ErrorBoundary FallbackComponent={PageError} resetKeys={[pathname]}>
      {children}
    </ErrorBoundary>
  );
}

// "New game" clears the saved game, in case the save caused the error, and opens Play with game setup.
function PageError({ resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();

  function startNewGame(): void {
    removeItem(SAVED_GAME_KEY);
    resetErrorBoundary();
    navigate("/");
  }

  return (
    <>
      <title>Something went wrong – Draughts</title>
      <h1>Something went wrong</h1>
      <button type="button" className={buttons.primary} onClick={startNewGame}>
        New game
      </button>
    </>
  );
}
