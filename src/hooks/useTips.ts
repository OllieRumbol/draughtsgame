// Show tips (spec section 6.1.4, and plan sections 3.3.4 and 4). On the person's turn, the player asks the API for
// the squares they can finish a move on, and the board rings them.
// The tips belong to one board and one player to move. When either changes, because a move was made, the turn ended,
// or Undo, the tips are gone, and a request that has not been answered is aborted, so a late answer is never shown
// (spec section 6.1.4, item 3, and section 6.6, item 15).
import { useEffect, useState } from "react";
import type { Position } from "@/game/board";
import type { GameState } from "@/game/game-state";
import { getTips } from "@/services/api";

export type TipsStatus = "off" | "loading" | "shown" | "failed";

export type Tips = {
  status: TipsStatus;
  squares: Position[]; // the squares to ring, while the status is "shown"
  available: boolean; // false outside the person's turn, and during a chain (spec section 6.1.4, item 6)
  toggle: () => void; // shows the tips, or hides them
};

type Request = { position: string; status: Exclude<TipsStatus, "off">; squares: Position[] };

export function useTips(game: GameState): Tips {
  const [request, setRequest] = useState<Request | null>(null);
  const { board, toMove: player, phase } = game;
  const available = phase.kind === "turn" && phase.chain === null;

  // The board and the player to move, as one text. Tips for any other position do not apply.
  const position = `${player}:${board.flat().join("")}`;
  const current = request !== null && request.position === position && available ? request : null;
  const loadingFor = current?.status === "loading" ? position : null;

  useEffect(() => {
    if (loadingFor === null) {
      return;
    }

    const controller = new AbortController();

    async function ask(): Promise<void> {
      const result = await getTips(board, player, controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setRequest((now) => {
        if (now === null || now.position !== loadingFor) {
          return now;
        }
        return result.ok
          ? { position: loadingFor, status: "shown", squares: result.value }
          : { position: loadingFor, status: "failed", squares: [] };
      });
    }

    void ask();
    return () => controller.abort();
  }, [loadingFor, board, player]);

  function toggle(): void {
    if (!available) {
      return;
    }
    const showing = current !== null && current.status !== "failed";
    setRequest(showing ? null : { position, status: "loading", squares: [] });
  }

  return {
    status: current?.status ?? "off",
    squares: current?.status === "shown" ? current.squares : [],
    available,
    toggle,
  };
}
