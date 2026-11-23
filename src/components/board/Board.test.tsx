import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useReducer } from "react";
import { describe, expect, it } from "vitest";
import { Board } from "@/components/board/Board";
import { type Board as BoardCells, type Position, CELL } from "@/game/board";
import { type GameState, type Settings, gameReducer, newGame } from "@/game/game-state";
import { at, boardWith } from "@/game/test-boards";

const { player1Man: M1, player2Man: M2, player1King: K1, player2King: K2 } = CELL;

const twoPlayers: Settings = { opponent: "twoPlayers", level: "easy", firstPlayer: 1 };
const againstComputer: Settings = { opponent: "computer", level: "hard", firstPlayer: 1 };

function gameOn(board: BoardCells, settings: Settings = twoPlayers, extra: Partial<GameState> = {}): GameState {
  const game = newGame(settings);
  return { ...game, board, turnStart: { ...game.turnStart, board }, ...extra };
}

// The board with the real reducer, as the Play page uses it.
function PlayableBoard({ start, tips = [] }: { start: GameState; tips?: Position[] }) {
  const [state, dispatch] = useReducer(gameReducer, start);
  return <Board state={state} dispatch={dispatch} tips={tips} />;
}

function square(name: string): HTMLElement {
  return screen.getByRole("gridcell", { name });
}

function pieces(container: HTMLElement, look: string): Element[] {
  return [...container.querySelectorAll(`[data-look="${look}"]`)];
}

// Plan section 7.2, test 38: selecting a piece marks every target square, including the landing square of a jump
// (spec section 6.1.2, item 2, and section 4.1, item 5).
describe("selecting a piece", () => {
  const board = boardWith([5, 2, M1], [4, 3, M2], [7, 0, M1]);

  it("marks every target, including the landing square of a jump", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(board)} />);

    await user.click(square("Row 6, column 3, player 1's man"));

    expect(square("Row 6, column 3, player 1's man, selected")).toBeInTheDocument();
    expect(within(square("Row 5, column 2, empty, target")).getByTestId("target")).toBeInTheDocument();
    expect(within(square("Row 4, column 5, empty, target")).getByTestId("target")).toBeInTheDocument();
    expect(screen.getAllByTestId("target")).toHaveLength(2);
  });

  it("lifts the selected piece and steps back the player's other pieces, but not the other player's", async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={gameOn(board)} />);

    await user.click(square("Row 6, column 3, player 1's man"));

    expect(pieces(container, "lifted")).toHaveLength(1);
    expect(pieces(container, "steppedBack")).toHaveLength(1);
    expect(pieces(container, "resting")).toHaveLength(1);
  });

  it("puts the piece down when it is chosen again, and clears the marks (spec section 6.1.2, item 7)", async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayableBoard start={gameOn(board)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 6, column 3, player 1's man, selected"));

    expect(screen.queryAllByTestId("target")).toHaveLength(0);
    expect(pieces(container, "resting")).toHaveLength(3);
  });

  it("selects a piece with no targets, and marks no target (spec section 6.1.2, item 6)", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} />);

    await user.click(square("Row 7, column 2, player 1's man"));

    expect(square("Row 7, column 2, player 1's man, selected")).toBeInTheDocument();
    expect(screen.queryAllByTestId("target")).toHaveLength(0);
  });

  it("makes the move when a target is chosen", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(board)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 4, column 5, empty, target"));

    expect(square("Row 4, column 5, player 1's man")).toBeInTheDocument();
    expect(square("Row 5, column 4, empty")).toBeInTheDocument();
  });

  it("clears the selection when a light square is clicked, as for any other square (spec section 6.1.2, item 5)", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(board)} />);

    await user.click(square("Row 6, column 3, player 1's man"));
    await user.click(square("Row 5, column 1, light square"));

    expect(square("Row 6, column 3, player 1's man")).toBeInTheDocument();
    expect(screen.queryAllByTestId("target")).toHaveLength(0);
  });

  it("ignores a light square during a chain, as for any square that is not a target (spec section 6.1.2, item 5)", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2]))} />);

    await user.click(square("Row 7, column 2, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));
    await user.click(square("Row 1, column 1, light square"));

    expect(square("Row 5, column 4, player 1's man, selected")).toBeInTheDocument();
  });
});

// Plan section 3.6, "How each board mark looks".
describe("the board's marks", () => {
  it("draws a king as a king, not a man (spec section 6.4.2, item 6)", () => {
    const { container } = render(<PlayableBoard start={gameOn(boardWith([5, 2, K1], [2, 3, K2], [7, 0, M1]))} />);

    expect(container.querySelectorAll('[data-piece="king"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-piece="man"]')).toHaveLength(1);
    expect(square("Row 6, column 3, player 1's king")).toBeInTheDocument();
  });

  it("marks the start and end squares of the computer's last move", () => {
    const start = gameOn(boardWith([3, 2, M2], [7, 0, M1]), againstComputer, {
      lastComputerMove: { from: at(2, 3), to: at(3, 2) },
    });
    render(<PlayableBoard start={start} />);

    expect(within(square("Row 3, column 4, empty")).getByTestId("last-move")).toBeInTheDocument();
    expect(within(square("Row 4, column 3, the computer's man")).getByTestId("last-move")).toBeInTheDocument();
    expect(screen.getAllByTestId("last-move")).toHaveLength(2);
  });

  it("marks each tip with a ring", () => {
    render(<PlayableBoard start={newGame(twoPlayers)} tips={[at(4, 1), at(4, 3)]} />);

    expect(within(square("Row 5, column 2, empty")).getByTestId("tip")).toBeInTheDocument();
    expect(screen.getAllByTestId("tip")).toHaveLength(2);
  });

  it("shows a tip and a target together on one square, as two different marks (spec section 6.6, item 12)", async () => {
    const user = userEvent.setup();
    render(<PlayableBoard start={newGame(twoPlayers)} tips={[at(4, 3)]} />);

    await user.click(square("Row 6, column 3, player 1's man"));

    const both = square("Row 5, column 4, empty, target");
    expect(within(both).getByTestId("tip")).toBeInTheDocument();
    expect(within(both).getByTestId("target")).toBeInTheDocument();
  });

  it("keeps the selected piece lifted during a chain, with only its next jump as a target", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <PlayableBoard start={gameOn(boardWith([6, 1, M1], [5, 2, M2], [3, 4, M2], [7, 6, M1]))} />,
    );

    await user.click(square("Row 7, column 2, player 1's man"));
    await user.click(square("Row 5, column 4, empty, target"));

    expect(square("Row 5, column 4, player 1's man, selected")).toBeInTheDocument();
    expect(screen.getAllByTestId("target")).toHaveLength(1);
    expect(square("Row 3, column 6, empty, target")).toBeInTheDocument();
    expect(pieces(container, "lifted")).toHaveLength(1);
    expect(pieces(container, "steppedBack")).toHaveLength(1);
  });

  it("sets 'For Ernest' with the crown into the frame, hidden from screen readers", () => {
    render(<PlayableBoard start={newGame(twoPlayers)} />);

    const mark = screen.getByText("For Ernest");
    expect(mark).toHaveAttribute("aria-hidden", "true");
    expect(mark.querySelector("svg")).not.toBeNull();
  });
});
