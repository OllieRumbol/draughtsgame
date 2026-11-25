import { act, renderHook } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at } from "@/game/test-boards";
import { useTips } from "@/hooks/useTips";
import { API_BASE_URL, server } from "@/test-server";

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const TIPS_URL = `${API_BASE_URL}/GetPotentialMoves`;

// The API's answer: the squares (4,1) and (4,3), in its own shape (spec section 5.2).
const tipsBody = {
  successful: true,
  potentialMoves: [
    { height: 4, width: 1 },
    { height: 4, width: 3 },
  ],
};

function play(state: GameState, ...actions: Action[]): GameState {
  return actions.reduce(gameReducer, state);
}

function renderTips(start: GameState) {
  return renderHook(({ game }) => useTips(game), { initialProps: { game: start } });
}

// Plan section 7.2, test 22, and spec section 6.1.4.
describe("useTips", () => {
  it("asks the API for the current player's tips, shows that it is loading, then gives the squares", async () => {
    const asked: unknown[] = [];
    server.use(
      http.post(TIPS_URL, async ({ request }) => {
        asked.push(await request.json());
        return HttpResponse.json(tipsBody);
      }),
    );
    const { result } = renderTips(newGame(twoPlayers));
    expect(result.current.status).toBe("off");

    act(() => result.current.toggle());
    expect(result.current.status).toBe("loading");

    await vi.waitFor(() => expect(result.current.status).toBe("shown"));
    expect(result.current.squares).toEqual([at(4, 1), at(4, 3)]);
    expect(asked).toHaveLength(1);
    expect((asked[0] as { TipFor: number }).TipFor).toBe(1);
  });

  it("hides the tips when the player chooses Show tips again", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json(tipsBody)));
    const { result } = renderTips(newGame(twoPlayers));
    act(() => result.current.toggle());
    await vi.waitFor(() => expect(result.current.status).toBe("shown"));

    act(() => result.current.toggle());

    expect(result.current.status).toBe("off");
    expect(result.current.squares).toEqual([]);
  });

  it("clears the tips when the turn ends and the board changes (spec section 6.1.4, item 3)", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json(tipsBody)));
    const start = newGame(twoPlayers);
    const { result, rerender } = renderTips(start);
    act(() => result.current.toggle());
    await vi.waitFor(() => expect(result.current.status).toBe("shown"));

    rerender({ game: play(start, { type: "select", at: at(5, 2) }, { type: "chooseTarget", at: at(4, 3) }) });

    expect(result.current.status).toBe("off");
    expect(result.current.squares).toEqual([]);
  });

  it("keeps the tips when only a piece is selected, so tips and targets show together (spec section 6.6, item 12)", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json(tipsBody)));
    const start = newGame(twoPlayers);
    const { result, rerender } = renderTips(start);
    act(() => result.current.toggle());
    await vi.waitFor(() => expect(result.current.status).toBe("shown"));

    rerender({ game: play(start, { type: "select", at: at(5, 2) }) });

    expect(result.current.squares).toEqual([at(4, 1), at(4, 3)]);
  });

  it("aborts a request when the board changes, and never shows its late answer (spec section 6.6, item 15)", async () => {
    const signals: AbortSignal[] = [];
    let answer: () => void = () => {};
    server.use(
      http.post(TIPS_URL, ({ request }) => {
        signals.push(request.signal);
        return new Promise<Response>((resolve) => (answer = () => resolve(HttpResponse.json(tipsBody))));
      }),
    );
    const start = newGame(twoPlayers);
    const { result, rerender } = renderTips(start);
    act(() => result.current.toggle());
    await vi.waitFor(() => expect(signals).toHaveLength(1));

    rerender({ game: play(start, { type: "select", at: at(5, 2) }, { type: "chooseTarget", at: at(4, 3) }) });
    await act(async () => answer());

    expect(signals[0].aborted).toBe(true);
    expect(result.current.status).toBe("off");
    expect(result.current.squares).toEqual([]);
  });

  it("reports a failure, and Show tips asks again (spec section 6.1.4, item 4)", async () => {
    server.use(http.post(TIPS_URL, () => HttpResponse.json({}, { status: 500 })));
    const { result } = renderTips(newGame(twoPlayers));

    act(() => result.current.toggle());
    await vi.waitFor(() => expect(result.current.status).toBe("failed"));
    server.use(http.post(TIPS_URL, () => HttpResponse.json(tipsBody)));
    act(() => result.current.toggle());

    expect(result.current.status).toBe("loading");
    await vi.waitFor(() => expect(result.current.status).toBe("shown"));
  });

  it("is not available during a chain, or when it is not a person's turn (spec section 6.1.4, items 1 and 6)", () => {
    const chainBoard = newGame(twoPlayers);
    const inChain: GameState = {
      ...chainBoard,
      phase: { kind: "turn", selected: at(4, 3), chain: { start: at(6, 1), captured: [at(5, 2)] } },
    };
    const thinking: GameState = { ...newGame(twoPlayers), phase: { kind: "computerThinking", requestId: 1 } };

    for (const game of [inChain, thinking]) {
      const { result } = renderTips(game);
      expect(result.current.available).toBe(false);
      act(() => result.current.toggle());
      expect(result.current.status).toBe("off");
    }
  });
});
