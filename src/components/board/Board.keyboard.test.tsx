import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import { describe, expect, it } from "vitest";
import { Board } from "@/components/board/Board";
import { type Board as BoardCells, type Move, CELL } from "@/game/board";
import { type Action, type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2 } = CELL;
const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function gameOn(board: BoardCells, settings: Settings = twoPlayers): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board } };
}

function PlayableBoard({ start }: { start: GameState }) {
  const [state, dispatch] = useReducer(gameReducer, start);
  return <Board state={state} dispatch={dispatch} tips={[]} />;
}

function focusedName(): string | null {
  return document.activeElement?.getAttribute("aria-label") ?? null;
}

function tabStops(): HTMLElement[] {
  return screen.getAllByRole("gridcell").filter((square) => square.tabIndex === 0);
}

function said(): string {
  return screen.getByRole("status").textContent ?? "";
}

// Plan section 7.2, test 25: the board grid's keyboard use and square names (spec section 6.4.3, items 1 and 2,
// and plan section 3.3.6).
describe("playing the board with the keyboard", () => {
  it("has one square that Tab reaches, the first man of the bottom row", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);

    expect(tabStops()).toHaveLength(1);
    await user.tab();

    expect(focusedName()).toBe("Row 6, column 1, player 1's man");
  });

  it("moves the focus one square with each arrow key, over light squares too", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    await user.tab();

    await user.keyboard("{ArrowRight}");
    expect(focusedName()).toBe("Row 6, column 2, light square");
    await user.keyboard("{ArrowUp}");
    expect(focusedName()).toBe("Row 5, column 2, empty");
    await user.keyboard("{ArrowLeft}");
    expect(focusedName()).toBe("Row 5, column 1, light square");
    await user.keyboard("{ArrowDown}");
    expect(focusedName()).toBe("Row 6, column 1, player 1's man");

    // The square that Tab reaches follows the focus.
    expect(tabStops()).toHaveLength(1);
    expect(tabStops()[0]).toBe(document.activeElement);
  });

  it("stops at each edge of the board", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    await user.tab();

    await user.keyboard("{ArrowLeft}");
    expect(focusedName()).toBe("Row 6, column 1, player 1's man");
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(focusedName()).toBe("Row 8, column 1, player 1's man");
    await user.keyboard("{ArrowRight>8/}");
    expect(focusedName()).toBe("Row 8, column 8, light square");
    await user.keyboard("{ArrowUp>8/}");
    expect(focusedName()).toBe("Row 1, column 8, player 2's man");
  });

  it("selects with Enter, and moves to a target with Space", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    await user.tab();
    await user.keyboard("{ArrowRight}{ArrowRight}");

    await user.keyboard("{Enter}");
    expect(focusedName()).toBe("Row 6, column 3, player 1's man, selected");

    await user.keyboard("{ArrowUp}{ArrowRight}");
    expect(focusedName()).toBe("Row 5, column 4, empty, target");
    await user.keyboard(" ");

    expect(focusedName()).toBe("Row 5, column 4, player 1's man");
    expect(said()).toBe("Player 1 moved to row 5, column 4. Player 2's turn.");
  });

  it("puts the piece down with Escape", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(focusedName()).toBe("Row 6, column 1, player 1's man, selected");

    await user.keyboard("{Escape}");

    expect(focusedName()).toBe("Row 6, column 1, player 1's man");
    expect(said()).toBe("Put down.");
  });

  it("does nothing with Escape during a chain (spec section 6.1.3)", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [0, 7, M2]))} />);
    await user.click(screen.getByRole("gridcell", { name: "Row 7, column 2, player 1's man" }));
    await user.click(screen.getByRole("gridcell", { name: "Row 5, column 4, empty, target" }));

    await user.keyboard("{Escape}");

    expect(screen.getByRole("gridcell", { name: "Row 5, column 4, player 1's man, selected" })).toBeInTheDocument();
  });

  it("does nothing with Enter or Space on a light square, while a click on one clears the selection", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    await user.tab();
    await user.keyboard("{Enter}{ArrowRight}");
    expect(focusedName()).toBe("Row 6, column 2, light square");

    await user.keyboard("{Enter} ");
    expect(screen.getByRole("gridcell", { name: "Row 6, column 1, player 1's man, selected" })).toBeInTheDocument();

    await user.click(screen.getByRole("gridcell", { name: "Row 6, column 2, light square" }));
    expect(screen.queryByRole("gridcell", { name: /selected/ })).toBeNull();
  });
});

// Plan section 7.2, test 26: the live region says each move, a capture, the computer's move, a failure and the
// result (spec section 6.4.3, item 3).
describe("the board's live region", () => {
  it("is one polite region, empty at the start", () => {
    render(<PlayableBoard start={newGame(twoPlayers)} />);

    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(said()).toBe("");
  });

  it("says a capture, then the result", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([5, 2, M1], [4, 3, M2]))} />);

    await user.click(screen.getByRole("gridcell", { name: "Row 6, column 3, player 1's man" }));
    expect(said()).toBe("Selected row 6, column 3. 2 targets.");
    await user.click(screen.getByRole("gridcell", { name: "Row 4, column 5, empty, target" }));

    expect(said()).toBe(
      "Player 1 jumped to row 4, column 5, taking a man. Player 1 wins. Player 2 has no pieces left.",
    );
  });

  it("says the computer's move once it has been shown, and a failure", () => {
    const thinking = [
      { type: "select", at: at(7, 0) },
      { type: "chooseTarget", at: at(6, 1) },
    ] satisfies Action[];
    const asked = thinking.reduce(gameReducer, gameOn(boardWith([2, 1, M2], [7, 0, M1]), againstComputer));
    const move: Move = { from: at(2, 1), to: at(3, 0), captured: [], path: [at(3, 0)] };
    const moving = gameReducer(asked, { type: "computerMoveReceived", requestId: 1, move });
    const jumpShown = gameReducer(moving, { type: "computerStepShown" });
    const { rerender } = render(<Board state={asked} dispatch={() => {}} tips={[]} />);

    for (const state of [moving, jumpShown, gameReducer(jumpShown, { type: "computerStepShown" })]) {
      rerender(<Board state={state} dispatch={() => {}} tips={[]} />);
    }
    expect(said()).toBe("The computer moved row 3, column 2 to row 4, column 1. Your turn.");

    // A failure, on a board that is still waiting for the computer.
    rerender(<Board state={asked} dispatch={() => {}} tips={[]} key="again" />);
    rerender(
      <Board
        state={gameReducer(asked, { type: "computerMoveFailed", requestId: 1 })}
        dispatch={() => {}}
        tips={[]}
        key="again"
      />,
    );
    expect(said()).toBe("The computer couldn't move. Check your connection and try again.");
  });

  it("says the same words again as a new message, so a screen reader reads them again", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);
    const man = () => screen.getByRole("gridcell", { name: /Row 6, column 1, player 1's man/ });

    await user.click(man());
    await user.click(man());
    const first = screen.getByRole("status").firstElementChild;
    await user.click(man());
    await user.click(man());

    expect(said()).toBe("Put down.");
    expect(screen.getByRole("status").firstElementChild).not.toBe(first);
  });
});
