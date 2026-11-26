import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RuleExample } from "./RuleExample";
import { JUMPING_AGAIN, KINGS, WINNING } from "./rule-pictures";

// Each piece on the picture, as its kind and the square it stands on, from where its slot is drawn. The pictures
// are 4 or 5 squares wide, so a 5-square picture has a square every 20%.
function pieces(squares: number): string[] {
  const picture = screen.getByRole("img");
  return [...picture.querySelectorAll<HTMLElement>("[data-piece]")].map((piece) => {
    const slot = piece.parentElement as HTMLElement;
    const row = (parseFloat(slot.style.top) * squares) / 100;
    const col = (parseFloat(slot.style.left) * squares) / 100;
    return `${piece.dataset.piece} (${row},${col})`;
  });
}

// Whether the picture shows its marks. They fade out while Show me plays, and in again after it.
function marksShown(): boolean {
  return screen.getByRole("img").querySelector("[data-marks]")?.getAttribute("data-marks") === "shown";
}

function marks(): { targets: number; taken: number; arrows: number } {
  return {
    targets: screen.queryAllByTestId("target").length,
    taken: screen.queryAllByTestId("taken").length,
    arrows: screen.queryAllByTestId("arrow").length + screen.queryAllByTestId("blocked-arrow").length,
  };
}

type Call = { keyframes: Keyframe[]; options: KeyframeAnimationOptions };

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
  return animations().filter((call) => call.keyframes[1]?.scale === "0.5");
}

async function wait(ms: number): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

// The device asks for reduced motion (plan section 3.6, "Reduced motion").
function reduceMotion(): void {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(prefers-reduced-motion: reduce)",
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Spec section 6.1.11, item 3, and plan section 3.6: "Show me" plays the move with the board's own motion, with the
// computer's timings, then returns to the still picture after about 1 s.
describe("Show me", () => {
  it("plays each jump in turn with the computer's slide and capture fade, then returns to the still picture", async () => {
    render(
      <RuleExample title="Jumping again" picture={JUMPING_AGAIN}>
        Text
      </RuleExample>,
    );
    expect(marks()).toEqual({ targets: 2, taken: 2, arrows: 2 });
    expect(marksShown()).toBe(true);
    expect(pieces(5)).toEqual(["man (4,1)", "man (3,2)", "man (1,2)"]);

    fireEvent.click(screen.getByRole("button", { name: "Show me: Jumping again" }));

    // The marks fade out while it plays, as in the design.
    expect(marksShown()).toBe(false);
    await wait(249);
    expect(pieces(5)).toEqual(["man (4,1)", "man (3,2)", "man (1,2)"]);

    // The first jump, after a short pause. The man slides for the computer's 380 ms, and the man it takes fades.
    await wait(1);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);
    expect(slides().map((call) => call.options.duration)).toEqual([380]);
    expect(captureFades()).toHaveLength(1);

    // The second jump follows the slide and the computer's 180 ms pause.
    await wait(559);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);
    await wait(1);
    expect(pieces(5)).toEqual(["man (0,1)", "man (1,2)"]);
    expect(slides()).toHaveLength(2);
    expect(captureFades()).toHaveLength(2);

    // It stays on the last step, then returns at once to the still picture, with its marks.
    await wait(1559);
    expect(pieces(5)).toEqual(["man (0,1)", "man (1,2)"]);
    await wait(1);
    expect(pieces(5)).toEqual(["man (4,1)", "man (3,2)", "man (1,2)"]);
    expect(marksShown()).toBe(true);
    expect(slides()).toHaveLength(2);
  });

  it("crowns the man that reaches the far side with the board's crowning", async () => {
    render(
      <RuleExample title="Kings" picture={KINGS}>
        Text
      </RuleExample>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show me: Kings" }));
    await wait(250);
    // Drawn as a man until the crowning shows the crown.
    expect(pieces(5)).toEqual(["man (0,1)", "king (3,2)"]);

    await wait(200);
    expect(pieces(5)).toEqual(["king (0,1)", "king (3,2)"]);
    expect(animations().some((call) => call.keyframes[1]?.translate === "0 -6px")).toBe(true);
  });

  it("starts again from the still picture when pressed while it plays", async () => {
    render(
      <RuleExample title="Jumping again" picture={JUMPING_AGAIN}>
        Text
      </RuleExample>,
    );
    const showMe = screen.getByRole("button", { name: "Show me: Jumping again" });

    fireEvent.click(showMe);
    await wait(250);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);

    fireEvent.click(showMe);
    expect(pieces(5)).toEqual(["man (4,1)", "man (3,2)", "man (1,2)"]);
    await wait(250);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);
  });

  it("with reduced motion, does not slide or crown, but still shows the jumps one at a time", async () => {
    reduceMotion();
    render(
      <RuleExample title="Jumping again" picture={JUMPING_AGAIN}>
        Text
      </RuleExample>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Show me: Jumping again" }));
    await wait(250);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);
    // The computer's pause stays, so each jump can be seen.
    await wait(179);
    expect(pieces(5)).toEqual(["man (2,3)", "man (3,2)", "man (1,2)"]);
    await wait(1);
    expect(pieces(5)).toEqual(["man (0,1)", "man (1,2)"]);
    expect(slides()).toEqual([]);
    // The fades stay, shortened to 100 ms.
    expect(captureFades().map((call) => call.options.duration)).toEqual([100, 100]);
  });

  it("is not offered for the end of the game, whose picture is still", () => {
    render(
      <RuleExample title="Winning" picture={WINNING} caption="Light to move, and blocked">
        Text
      </RuleExample>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Light to move, and blocked")).toBeInTheDocument();
    expect(screen.getAllByTestId("blocked-arrow")).toHaveLength(1);
  });
});
