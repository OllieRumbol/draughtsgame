import { HttpResponse, delay, http } from "msw";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STARTING_BOARD } from "@/game/board";
import { getNextMove, getTips } from "@/services/api";
import { API_BASE_URL, server } from "@/test-server";

const NEXT_MOVE_URL = `${API_BASE_URL}/GetNextMove`;
const TIPS_URL = `${API_BASE_URL}/GetPotentialMoves`;

// Fake timers cannot move AbortSignal.timeout on, so the tests pass a short limit instead (plan section 7.1).
const SHORT_LIMIT_MS = 50;

type Resolver = Parameters<typeof http.post>[1];

function answerNextMove(resolver: Resolver): void {
  server.use(http.post(NEXT_MOVE_URL, resolver));
}

function answerTips(resolver: Resolver): void {
  server.use(http.post(TIPS_URL, resolver));
}

function anySignal(): AbortSignal {
  return new AbortController().signal;
}

// A response that never comes, so only the time limit or an abort can end the request.
async function neverAnswer(): Promise<Response> {
  await delay("infinite");
  return HttpResponse.json({});
}

// The responses in spec sections 5.1 and 5.2.
const nextMoveBody = {
  nextMove: { currentHeight: 2, currentWidth: 3, nextHeight: 3, nextWidth: 2, takes: [] },
  successful: true,
  errorMessage: null,
};
const tipsBody = {
  potentialMoves: [
    { height: 4, width: 1 },
    { height: 4, width: 3 },
  ],
  successful: true,
  errorMessage: null,
};

// Plan section 7.1: proves, before the other cases, that a short time limit works with MSW in this test environment.
describe("the time limit", () => {
  it("ends a request that gets no answer, as a timeout", async () => {
    answerNextMove(neverAnswer);
    const started = Date.now();

    const result = await getNextMove(STARTING_BOARD, "easy", anySignal(), SHORT_LIMIT_MS);

    expect(result).toEqual({ ok: false, failure: { kind: "timeout" } });
    expect(Date.now() - started).toBeLessThan(5_000);
  });
});

// Plan section 7.2, test 17: each answer from GetNextMove gives the right result, and the service never throws.
describe("getNextMove", () => {
  it("returns the move, with height as the row and width as the column (spec section 5.1)", async () => {
    answerNextMove(() => HttpResponse.json(nextMoveBody));

    const result = await getNextMove(STARTING_BOARD, "hard", anySignal());

    expect(result).toEqual({ ok: true, value: { from: { row: 2, col: 3 }, to: { row: 3, col: 2 }, takes: [] } });
  });

  it("returns the captured squares in the order the API gives them", async () => {
    answerNextMove(() =>
      HttpResponse.json({
        nextMove: {
          currentHeight: 5,
          currentWidth: 2,
          nextHeight: 1,
          nextWidth: 2,
          takes: [
            { height: 2, width: 3 },
            { height: 4, width: 3 },
          ],
        },
        successful: true,
        errorMessage: null,
      }),
    );

    const result = await getNextMove(STARTING_BOARD, "hard", anySignal());

    expect(result).toEqual({
      ok: true,
      value: {
        from: { row: 5, col: 2 },
        to: { row: 1, col: 2 },
        takes: [
          { row: 2, col: 3 },
          { row: 4, col: 3 },
        ],
      },
    });
  });

  it("gives 'http' for a 400 with the API's JSON, and does not pass on its errorMessage (spec section 6.1.9, item 4)", async () => {
    answerNextMove(() =>
      HttpResponse.json(
        { nextMove: null, successful: false, errorMessage: "Player 2 has no legal moves." },
        { status: 400 },
      ),
    );

    const result = await getNextMove(STARTING_BOARD, "hard", anySignal());

    expect(result).toEqual({ ok: false, failure: { kind: "http", status: 400 } });
  });

  it("gives 'http' for a 500", async () => {
    answerNextMove(() =>
      HttpResponse.json({ nextMove: null, successful: false, errorMessage: "Unexpected fault" }, { status: 500 }),
    );

    expect(await getNextMove(STARTING_BOARD, "hard", anySignal())).toEqual({
      ok: false,
      failure: { kind: "http", status: 500 },
    });
  });

  it("gives 'http' for a 403 HTML page, as when the API app is stopped (spec section 5.1)", async () => {
    answerNextMove(() => HttpResponse.html("<html><body>Site Disabled</body></html>", { status: 403 }));

    expect(await getNextMove(STARTING_BOARD, "hard", anySignal())).toEqual({
      ok: false,
      failure: { kind: "http", status: 403 },
    });
  });

  it("gives 'unsuccessful' for a 200 with successful: false", async () => {
    answerNextMove(() => HttpResponse.json({ nextMove: null, successful: false, errorMessage: "No move" }));

    expect(await getNextMove(STARTING_BOARD, "hard", anySignal())).toEqual({
      ok: false,
      failure: { kind: "unsuccessful" },
    });
  });

  it.each([
    ["a body that is not JSON", () => HttpResponse.text("not json")],
    ["a JSON list", () => HttpResponse.json([])],
    ["no 'successful'", () => HttpResponse.json({ nextMove: nextMoveBody.nextMove })],
    ["successful: true with no move", () => HttpResponse.json({ nextMove: null, successful: true })],
    [
      "a square off the board",
      () => HttpResponse.json({ ...nextMoveBody, nextMove: { ...nextMoveBody.nextMove, nextHeight: 8 } }),
    ],
    [
      "a row that is text",
      () => HttpResponse.json({ ...nextMoveBody, nextMove: { ...nextMoveBody.nextMove, currentHeight: "2" } }),
    ],
    [
      "'takes' that is not a list",
      () => HttpResponse.json({ ...nextMoveBody, nextMove: { ...nextMoveBody.nextMove, takes: null } }),
    ],
    [
      "a captured square with no width",
      () => HttpResponse.json({ ...nextMoveBody, nextMove: { ...nextMoveBody.nextMove, takes: [{ height: 3 }] } }),
    ],
  ])("gives 'badBody' for %s", async (_name, resolver) => {
    answerNextMove(resolver);

    expect(await getNextMove(STARTING_BOARD, "hard", anySignal())).toEqual({
      ok: false,
      failure: { kind: "badBody" },
    });
  });

  it("gives 'network' when the request cannot be made", async () => {
    answerNextMove(() => HttpResponse.error());

    expect(await getNextMove(STARTING_BOARD, "hard", anySignal())).toEqual({
      ok: false,
      failure: { kind: "network" },
    });
  });

  it("gives 'network' when the caller aborts, so a cancelled request is never a timeout (plan section 4)", async () => {
    answerNextMove(neverAnswer);
    const caller = new AbortController();

    const pending = getNextMove(STARTING_BOARD, "hard", caller.signal);
    caller.abort();

    expect(await pending).toEqual({ ok: false, failure: { kind: "network" } });
  });

  it("gives 'network' when the caller has aborted before the call", async () => {
    answerNextMove(() => HttpResponse.json(nextMoveBody));

    const result = await getNextMove(STARTING_BOARD, "hard", AbortSignal.abort());

    expect(result).toEqual({ ok: false, failure: { kind: "network" } });
  });
});

// Plan section 7.2, test 17, for GetPotentialMoves.
describe("getTips", () => {
  it("returns the squares, with height as the row and width as the column (spec section 5.2)", async () => {
    answerTips(() => HttpResponse.json(tipsBody));

    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({
      ok: true,
      value: [
        { row: 4, col: 1 },
        { row: 4, col: 3 },
      ],
    });
  });

  it("returns an empty list when the player has no legal move", async () => {
    answerTips(() => HttpResponse.json({ potentialMoves: [], successful: true, errorMessage: null }));

    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({ ok: true, value: [] });
  });

  it("gives 'http', 'unsuccessful', 'badBody', 'network' and 'timeout' as getNextMove does", async () => {
    answerTips(() => HttpResponse.json({ successful: false }, { status: 500 }));
    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({
      ok: false,
      failure: { kind: "http", status: 500 },
    });

    answerTips(() => HttpResponse.json({ potentialMoves: null, successful: false }));
    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({ ok: false, failure: { kind: "unsuccessful" } });

    answerTips(() => HttpResponse.json({ potentialMoves: [{ height: 4, width: -1 }], successful: true }));
    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({ ok: false, failure: { kind: "badBody" } });

    answerTips(() => HttpResponse.json({ successful: true }));
    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({ ok: false, failure: { kind: "badBody" } });

    answerTips(() => HttpResponse.error());
    expect(await getTips(STARTING_BOARD, 1, anySignal())).toEqual({ ok: false, failure: { kind: "network" } });

    answerTips(neverAnswer);
    expect(await getTips(STARTING_BOARD, 1, anySignal(), SHORT_LIMIT_MS)).toEqual({
      ok: false,
      failure: { kind: "timeout" },
    });
  });
});

// Plan section 7.2, test 18: the request bodies (spec section 3, goal 7, and sections 5.1, 5.2 and 6.1.5, item 1).
describe("the requests", () => {
  type SentRequest = { method: string; contentType: string | null; body: unknown };

  function recordRequests(url: string, response: () => Response): SentRequest[] {
    const sent: SentRequest[] = [];
    server.use(
      http.post(url, async ({ request }) => {
        sent.push({
          method: request.method,
          contentType: request.headers.get("Content-Type"),
          body: await request.json(),
        });
        return response();
      }),
    );
    return sent;
  }

  it("asks for the computer's move with Difficulty and Board only, and the board holds only the values 0 to 5", async () => {
    const sent = recordRequests(NEXT_MOVE_URL, () => HttpResponse.json(nextMoveBody));

    await getNextMove(STARTING_BOARD, "normal", anySignal());

    expect(sent).toEqual([
      { method: "POST", contentType: "application/json", body: { Difficulty: "normal", Board: STARTING_BOARD } },
    ]);
    const board = (sent[0].body as { Board: number[][] }).Board;
    expect(board.flat().every((cell) => cell >= 0 && cell <= 5)).toBe(true);
  });

  it("sends each level by the API's name (spec section 2.4)", async () => {
    const sent = recordRequests(NEXT_MOVE_URL, () => HttpResponse.json(nextMoveBody));

    for (const level of ["easy", "normal", "hard"] as const) {
      await getNextMove(STARTING_BOARD, level, anySignal());
    }

    expect(sent.map((request) => (request.body as { Difficulty: string }).Difficulty)).toEqual([
      "easy",
      "normal",
      "hard",
    ]);
  });

  it("asks for tips with Board and TipFor only", async () => {
    const sent = recordRequests(TIPS_URL, () => HttpResponse.json(tipsBody));

    await getTips(STARTING_BOARD, 2, anySignal());

    expect(sent).toEqual([
      { method: "POST", contentType: "application/json", body: { Board: STARTING_BOARD, TipFor: 2 } },
    ]);
  });
});

// Plan section 2: a missing address fails at once, not in the middle of a game.
describe("the API address", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("makes the module throw when it loads with an empty VITE_API_BASE_URL", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.resetModules();

    await expect(import("@/services/api")).rejects.toThrow("VITE_API_BASE_URL is empty");
  });
});
