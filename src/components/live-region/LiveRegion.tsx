import { useState } from "react";
import type { Position } from "@/game/board";
import type { GameState } from "@/game/game-state";
import { announcement } from "./announcement";

type LiveRegionProps = {
  state: GameState;
  chosen: Position | null; // the square the player last chose, for "Put down." (announcement.ts)
};

// The one polite live region (plan section 3.3.6). It is not shown on screen. It says what changed in the game
// each time the state changes. The previous state is kept so the change can be worked out during this render, as
// React's guide on adjusting state to new props shows.
export function LiveRegion({ state, chosen }: LiveRegionProps) {
  const [heard, setHeard] = useState({ state, message: "", count: 0 });
  let current = heard;
  if (heard.state !== state) {
    const message = announcement(heard.state, state, chosen);
    current = message === null ? { ...heard, state } : { state, message, count: heard.count + 1 };
    setHeard(current);
  }

  // Each message is a new paragraph, so a screen reader reads it even when it is the same as the one before,
  // such as "Put down." twice.
  return (
    <div role="status" className="visually-hidden">
      {current.message !== "" && <p key={current.count}>{current.message}</p>}
    </div>
  );
}
