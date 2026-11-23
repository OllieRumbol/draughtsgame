import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CapturedStack } from "@/components/board/CapturedStack";

// Plan section 3.6: one upright stack on desktop, and towers of up to four on a phone. CSS shows one of the two.
describe("the captured men", () => {
  function towers(container: HTMLElement, layout: "upright" | "towers"): number[] {
    const group = container.querySelectorAll('[aria-hidden="true"]')[layout === "upright" ? 0 : 1];
    return [...group.querySelectorAll('[data-testid="tower"]')].map((tower) => tower.childElementCount);
  }

  it("says how many men the player took", () => {
    render(<CapturedStack count={7} menOf={2} label="Player 1 took" />);

    expect(screen.getByText("Player 1 took 7")).toBeInTheDocument();
  });

  it("stacks every man in one upright stack for desktop", () => {
    const { container } = render(<CapturedStack count={7} menOf={2} label="Player 1 took" />);

    expect(towers(container, "upright")).toEqual([7]);
  });

  it("splits the men into towers of up to four for a phone", () => {
    const { container } = render(<CapturedStack count={9} menOf={1} label="Player 2 took" />);

    expect(towers(container, "towers")).toEqual([4, 4, 1]);
  });

  it("shows no men when none are taken", () => {
    const { container } = render(<CapturedStack count={0} menOf={1} label="Player 2 took" />);

    expect(towers(container, "towers")).toEqual([]);
    expect(screen.getByText("Player 2 took 0")).toBeInTheDocument();
  });
});
