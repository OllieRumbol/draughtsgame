import { useEffect, useState } from "react";
import type { Position } from "@/game/board";
import type { GameState } from "@/game/game-state";
import { announcement } from "./announcement";

type LiveRegionProps = {
  state: GameState;
  chosen: Position | null; // the square the player last chose, for "Put down." (announcement.ts)
  opening?: string; // said once the region is on the page, such as "Game started. Player 1 moves first."
  notice?: string; // said when it appears or changes, such as "Tips aren't available right now."
};

// A screen reader may not read text that arrives with the region itself, so the opening words wait a moment.
const OPENING_DELAY_MS = 100;

// The one polite live region (plan section 3.3.6). It is not shown on screen. It says what changed in the game
// each time the state changes. The previous state is kept so the change can be worked out during this render, as
// React's guide on adjusting state to new props shows.
export function LiveRegion({ state, chosen, opening, notice }: LiveRegionProps) {
  const [heard, setHeard] = useState({ state, notice, message: "", count: 0 });
  let current = heard;
  if (heard.state !== state) {
    const message = announcement(heard.state, state, chosen);
    current = message === null ? { ...current, state } : { ...current, state, message, count: current.count + 1 };
  }
  // A notice is said when it appears, or when it changes, but not when it goes away.
  if (current.notice !== notice) {
    current =
      notice === undefined ? { ...current, notice } : { ...current, notice, message: notice, count: current.count + 1 };
  }
  if (current !== heard) {
    setHeard(current);
  }

  // The opening words are said only if nothing else has been said yet.
  useEffect(() => {
    if (opening === undefined) {
      return;
    }
    const timer = setTimeout(() => {
      setHeard((now) => (now.count === 0 ? { ...now, message: opening, count: 1 } : now));
    }, OPENING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [opening]);

  // Each message is a new paragraph, so a screen reader reads it even when it is the same as the one before,
  // such as "Put down." twice.
  return (
    <div role="status" className="visually-hidden">
      {current.message !== "" && <p key={current.count}>{current.message}</p>}
    </div>
  );
}
