import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router";
import { SAVED_GAME_KEY, removeItem } from "@/services/storage";
import buttons from "@/styles/buttons.module.css";

type PageErrorBoundaryProps = {
  children: ReactNode;
};

// Plan section 4: an unexpected error while a page draws shows "Something went wrong" with "New game".
// The boundary is around each page, so the header and the other pages keep working.
export function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>;
}

// "New game" clears the saved game, in case the save caused the error, and opens Play with game setup.
function PageError({ resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();

  function startNewGame(): void {
    removeItem(SAVED_GAME_KEY);
    navigate("/");
    resetErrorBoundary();
  }

  return (
    <>
      <title>Something went wrong – Draughts</title>
      <h1>Something went wrong</h1>
      <p>This page couldn't be shown. New game clears the saved game and starts again.</p>
      <button type="button" className={buttons.primary} onClick={startNewGame}>
        New game
      </button>
    </>
  );
}
