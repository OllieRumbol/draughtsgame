import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import { describe, expect, it, vi } from "vitest";
import { Board } from "@/components/board/Board";
import { type Board as BoardCells, CELL } from "@/game/board";
import { type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };

function gameOn(board: BoardCells): GameState {
  const game = newGame(twoPlayers);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
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

    expect(slides()).toEqual([
      {
        keyframes: [
          { left: "25%", top: "62.5%" },
          { left: "37.5%", top: "50%" },
        ],
        options: { duration: 200, easing: "cubic-bezier(.4,0,.2,1)" },
      },
    ]);
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

  it("keeps the person's piece lifted while it slides, and puts it down when it lands, as the design shows", async () => {
    let land: () => void = () => {};
    vi.mocked(Element.prototype.animate).mockImplementation(
      (keyframes) =>
        ({
          finished:
            "left" in (keyframes as Keyframe[])[0]
              ? new Promise<void>((resolve) => (land = resolve))
              : Promise.resolve(),
          cancel() {},
        }) as unknown as Animation,
    );
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
