import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import { describe, expect, it, vi } from "vitest";
import { Board } from "@/components/board/Board";
import { type Board as BoardCells, type Move, CELL } from "@/game/board";
import { type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function gameOn(board: BoardCells, settings: Settings = twoPlayers): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
}

// The computer's move received, on a board where the person has just moved (7,0) to (6,1).
function computerMoving(board: BoardCells, move: Move): GameState {
  let state = gameOn(board, againstComputer);
  state = gameReducer(state, { type: "select", at: at(7, 0) });
  state = gameReducer(state, { type: "chooseTarget", at: at(6, 1) });
  return gameReducer(state, { type: "computerMoveReceived", requestId: 1, move });
}

// An Element.animate stand-in whose held animations end only when the test calls the function it gives back.
function holdAnimations(hold: (keyframes: Keyframe[]) => boolean): () => void {
  const waiting: (() => void)[] = [];
  vi.mocked(Element.prototype.animate).mockImplementation(
    (keyframes) =>
      ({
        finished: hold(keyframes as Keyframe[])
          ? new Promise<void>((resolve) => waiting.push(resolve))
          : Promise.resolve(),
        cancel() {},
      }) as unknown as Animation,
  );
  return () => waiting.forEach((resolve) => resolve());
}

function PlayableBoard({ start }: { start: GameState }) {
  const [state, dispatch] = useReducer(gameReducer, start);
  return <Board state={state} dispatch={dispatch} tips={[]} />;
}

type Call = { keyframes: Keyframe[]; options: KeyframeAnimationOptions };

// The animations the board started, from the Element.animate stand-in in test-setup.ts.
function animations(): Call[] {
  return vi.mocked(Element.prototype.animate).mock.calls.map(([keyframes, options]) => ({
    keyframes: keyframes as Keyframe[],
    options: options as KeyframeAnimationOptions,
  }));
}

function slides(): Call[] {
  return animations().filter((call) => "left" in call.keyframes[0]);
}

function captureFades(): Call[] {
  return animations().filter((call) => "opacity" in call.keyframes[0] && call.keyframes[1]?.scale === "0.5");
}

function crownRises(): Call[] {
  return animations().filter((call) => call.keyframes[1]?.translate === "0 -6px");
}

function square(name: string): HTMLElement {
  return screen.getByRole("gridcell", { name });
}

// The device asks for reduced motion (plan section 3.6, "Reduced motion").
function reduceMotion(): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    addEventListener() {},
    removeEventListener() {},
  }));
}

// Plan section 3.6, "Motion": the slide, the capture fade and the crowning.
describe("the board's motion", () => {
  it("slides a moved piece from its old square to its new one, in 200 ms", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));

    // It slides above the other pieces (zIndex 5), as in the design.
    expect(slides()).toEqual([
      {
        keyframes: [
          { left: "25%", top: "62.5%", zIndex: 5 },
          { left: "37.5%", top: "50%", zIndex: 5 },
        ],
        options: { duration: 200, easing: "cubic-bezier(.4,0,.2,1)" },
      },
    ]);
  });

  it("slides the computer's jump in 380 ms, and fades the taken piece from 190 ms for 228 ms", () => {
    const board = boardWith([0, 1, M2], [1, 2, M1], [7, 0, M1]);
    const jump: Move = { from: at(0, 1), to: at(2, 3), captured: [at(1, 2)], path: [at(2, 3)] };
    const received = computerMoving(board, jump);
    const { rerender } = render(<Board state={received} dispatch={() => {}} tips={[]} />);

    rerender(<Board state={gameReducer(received, { type: "computerStepShown" })} dispatch={() => {}} tips={[]} />);

    expect(slides().map((call) => call.options)).toEqual([{ duration: 380, easing: "cubic-bezier(.4,0,.2,1)" }]);
    expect(captureFades().map((call) => call.options)).toEqual([{ delay: 190, duration: 228, fill: "forwards" }]);
  });

  it("crowns the computer's man that reaches the far row, when its slide ends", async () => {
    const board = boardWith([6, 3, M2], [7, 0, M1]);
    const move: Move = { from: at(6, 3), to: at(7, 4), captured: [], path: [at(7, 4)] };
    const received = computerMoving(board, move);
    const { rerender } = render(<Board state={received} dispatch={() => {}} tips={[]} />);

    rerender(<Board state={gameReducer(received, { type: "computerStepShown" })} dispatch={() => {}} tips={[]} />);

    await waitFor(() => expect(crownRises()).toHaveLength(1));
  });

  it("grows a jumping piece halfway, and fades and shrinks the taken piece halfway through the jump", async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={gameOn(boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1]))} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 4, column 5, empty, target"));

    expect(animations().some((call) => call.keyframes[1]?.scale === "1.16")).toBe(true);
    expect(captureFades().map((call) => call.options)).toEqual([{ delay: 100, duration: 120, fill: "forwards" }]);
    // The fade has finished at once in the stand-in, so the board has removed the taken man.
    await waitFor(() => expect(container.querySelectorAll("[data-piece]")).toHaveLength(2));
  });

  it("crowns a man that reaches the far row, when its slide ends", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([1, 2, M1], [5, 6, M2]))} />);

    await user.click(square("Row 2, column 3, player 1's man"));
    await user.click(square("Row 1, column 2, empty, target"));

    await waitFor(() => expect(crownRises()).toHaveLength(1));
    expect(crownRises()[0].options).toMatchObject({ duration: 180 });
  });

  it("draws the crowned piece as a man until the crown appears at the top of its rise", async () => {
    const finishRise = holdAnimations((keyframes) => keyframes[1]?.translate === "0 -6px");
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={gameOn(boardWith([1, 2, M1], [5, 6, M2]))} />);

    await user.click(square("Row 2, column 3, player 1's man"));
    await user.click(square("Row 1, column 2, empty, target"));
    await waitFor(() => expect(crownRises()).toHaveLength(1));

    expect(container.querySelector('[data-piece="king"]')).toBeNull();
    finishRise();
    await waitFor(() => expect(container.querySelector('[data-piece="king"]')).not.toBeNull());
  });

  it("ignores a click while the person's piece slides, so the next jump starts where it lands", async () => {
    const land = holdAnimations((keyframes) => "left" in keyframes[0]);
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([7, 0, M1], [6, 1, M2], [4, 3, M2], [0, 7, M2]))} />);

    await user.click(square("Row 8, column 1, player 1's man"));
    await user.click(square("Row 6, column 3, empty, target"));
    await user.click(square("Row 4, column 5, empty, target"));

    expect(square("Row 4, column 5, empty, target")).toBeInTheDocument();
    await act(async () => land());
    await user.click(square("Row 4, column 5, empty, target"));
    expect(square("Row 4, column 5, player 1's man")).toBeInTheDocument();
  });

  it("keeps the person's piece lifted while it slides, and puts it down when it lands, as the design shows", async () => {
    const land = holdAnimations((keyframes) => "left" in keyframes[0]);
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={newGame(twoPlayers)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));

    expect(container.querySelectorAll('[data-look="lifted"]')).toHaveLength(1);
    land();
    await waitFor(() => expect(container.querySelectorAll('[data-look="lifted"]')).toHaveLength(0));
  });

  it("redraws the board at once, with no slide, after Undo (spec section 6.1.7, item 5)", () => {
    const moved = gameReducer(gameReducer(newGame(twoPlayers), { type: "select", at: { row: 5, col: 2 } }), {
      type: "chooseTarget",
      at: { row: 4, col: 3 },
    });
    const { rerender } = render(<Board state={moved} dispatch={() => {}} tips={[]} />);
    vi.mocked(Element.prototype.animate).mockClear();

    rerender(<Board state={gameReducer(moved, { type: "undo" })} dispatch={() => {}} tips={[]} />);

    expect(animations()).toEqual([]);
    expect(square("Row 6, column 3, player 1's man")).toBeInTheDocument();
  });

  it("times the lift, the step-back and the target dots from timings.ts", () => {
    const { container } = render(<PlayableBoard start={newGame(twoPlayers)} />);
    const frame = container.firstElementChild as HTMLElement;

    expect(frame.style.getPropertyValue("--lift-ms")).toBe("180ms");
    expect(frame.style.getPropertyValue("--step-back-ms")).toBe("220ms");
    expect(frame.style.getPropertyValue("--target-fade-ms")).toBe("180ms");
  });
});

// Plan section 3.6: "When the device asks for reduced motion, slides, lifts and the crowning are instant. Fades stay,
// shortened to 100 ms."
describe("the board's motion with reduced motion", () => {
  it("makes the lift instant and shortens the fades to 100 ms", () => {
    reduceMotion();
    const { container } = render(<PlayableBoard start={newGame(twoPlayers)} />);
    const frame = container.firstElementChild as HTMLElement;

    expect(frame.style.getPropertyValue("--lift-ms")).toBe("0ms");
    expect(frame.style.getPropertyValue("--step-back-ms")).toBe("100ms");
    expect(frame.style.getPropertyValue("--target-fade-ms")).toBe("100ms");
  });

  it("moves a piece at once, with no slide, and puts it down at once", async () => {
    reduceMotion();
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={newGame(twoPlayers)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));

    expect(slides()).toEqual([]);
    expect(container.querySelectorAll('[data-look="lifted"]')).toHaveLength(0);
    expect(square("Row 5, column 4, player 1's man")).toBeInTheDocument();
  });

  it("still fades a taken piece, at once and for 100 ms", async () => {
    reduceMotion();
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1]))} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 4, column 5, empty, target"));

    expect(captureFades().map((call) => call.options)).toEqual([{ delay: 0, duration: 100, fill: "forwards" }]);
  });

  it("crowns a man at once, with no crowning animation", async () => {
    reduceMotion();
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={gameOn(boardWith([1, 2, M1], [5, 6, M2]))} />);

    await user.click(square("Row 2, column 3, player 1's man"));
    await user.click(square("Row 1, column 2, empty, target"));

    expect(container.querySelector('[data-piece="king"]')).not.toBeNull();
    expect(crownRises()).toEqual([]);
  });
});
