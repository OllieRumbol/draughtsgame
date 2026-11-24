// What the live region says when the game changes (spec section 6.4.3, item 3, and plan section 3.3.6): each move,
// including the computer's moves and captures, the start of each turn, a failure and the result. It also says
// what a selection did, as the design does. The wording follows the design (docs/design/site.html). Squares are
// named as the board names them (spec section 6.4.3, item 2), in lower case inside a sentence.
import {
  type Board,
  type Player,
  type Position,
  BOARD_SIZE,
  cellAt,
  isKing,
  otherPlayer,
  ownerOf,
  samePosition,
} from "@/game/board";
import type { GameState, Result, Settings } from "@/game/game-state";
import { nextSteps } from "@/game/rules";

// Spec section 6.1.9, item 1.
const FAILED = "The computer couldn't move. Check your connection and try again.";

// The sentence for the change from one state of the game to the next, or null when there is nothing to say.
// `chosen` is the square the player last chose on the board. It tells putting the piece down apart from choosing
// another square, which also clears the selection. A piece is selected only by choosing its square, so for Escape
// it is still the selected piece.
export function announcement(previous: GameState, next: GameState, chosen: Position | null): string | null {
  if (previous === next) {
    return null;
  }

  const before = previous.phase;
  const after = next.phase;

  if (isUndo(previous, next)) {
    return `Undone. ${turnOf(next.settings, next.toMove)}.`;
  }

  if (before.kind === "turn") {
    if (!sameBoard(previous.board, next.board)) {
      return personStep(previous, next);
    }
    if (after.kind === "turn" && next.toMove === previous.toMove) {
      return selectionChange(previous, next, chosen);
    }
    // "End turn" during a chain, or Give up.
    return whatComesNext(next);
  }

  if (before.kind === "computerMoving" && after.kind !== "computerMoving") {
    if (after.kind === "over" && after.result.reason === "gaveUp") {
      return resultSentence(next.settings, after.result);
    }
    return computerMove(previous, next);
  }

  if (after.kind !== before.kind) {
    // The computer is asked again ("Try again"), its move fails, or the person gives up while it thinks.
    if (after.kind === "computerThinking" || after.kind === "computerFailed" || after.kind === "over") {
      return whatComesNext(next);
    }
  }

  return null;
}

// "You win", "The computer wins", or "Player 1 wins" (spec section 6.3).
export function resultTitle(settings: Settings, result: Result): string {
  return `${playerName(settings, result.winner)} ${verb(settings, result.winner, "win", "wins")}`;
}

// The result and its reason (spec section 6.3).
export function resultSentence(settings: Settings, result: Result): string {
  const title = resultTitle(settings, result);
  const loser = playerName(settings, otherPlayer(result.winner));
  switch (result.reason) {
    case "gaveUp":
      return `${loser} gave up. ${title}.`;
    case "noMoves":
      return `${title}. ${loser} can't move.`;
    case "noPieces":
      return `${title}. ${loser} ${verb(settings, otherPlayer(result.winner), "have", "has")} no pieces left.`;
  }
}

// Undo removes one or more finished turns, or, during a chain, goes back to the start of the turn.
function isUndo(previous: GameState, next: GameState): boolean {
  if (next.history.length < previous.history.length) {
    return true;
  }
  const before = previous.phase;
  const after = next.phase;
  return (
    before.kind === "turn" &&
    before.chain !== null &&
    after.kind === "turn" &&
    after.chain === null &&
    next.history.length === previous.history.length &&
    !sameBoard(previous.board, next.board)
  );
}

// "Selected row 6, column 3. 2 targets." The design says "Put down." only when the player chooses the selected
// piece again or presses Escape, and nothing when another square clears the selection.
function selectionChange(previous: GameState, next: GameState, chosen: Position | null): string | null {
  const before = previous.phase.kind === "turn" ? previous.phase.selected : null;
  const after = next.phase.kind === "turn" ? next.phase.selected : null;
  if (after === null) {
    const putDown = before !== null && chosen !== null && samePosition(before, chosen);
    return putDown ? "Put down." : null;
  }
  if (before !== null && before.row === after.row && before.col === after.col) {
    return null;
  }

  const count = nextSteps(next.board, after, null).length;
  const targets = count === 0 ? "No moves." : `${count} ${count === 1 ? "target" : "targets"}.`;
  return `Selected ${place(after)}. ${targets}`;
}

// The person's move or jump, then what comes next: "Player 1 jumped to row 4, column 5, taking a man.
// Player 2's turn." A man that becomes a king is said too.
function personStep(previous: GameState, next: GameState): string | null {
  const from = previous.phase.kind === "turn" ? previous.phase.selected : null;
  const mover = previous.toMove;
  const to = findSquare((position) => isEmptyIn(previous.board, position) && ownerIn(next.board, position) === mover);
  if (from === null || to === null) {
    return null;
  }

  const captured = findSquare(
    (position) => ownerIn(previous.board, position) === otherPlayer(mover) && isEmptyIn(next.board, position),
  );
  const crowned = !isKing(cellAt(previous.board, from)) && isKing(cellAt(next.board, to));

  const actor = next.settings.opponent === "computer" ? "You" : `Player ${mover}`;
  const taking = captured === null ? "" : `, taking a ${pieceKind(previous.board, captured)}`;
  const whose = next.settings.opponent === "computer" ? "Your" : "The";
  const step = `${actor} ${captured === null ? "moved" : "jumped"} to ${place(to)}${taking}.`;
  const crowning = crowned ? ` ${whose} man becomes a king.` : "";

  const inChain = next.phase.kind === "turn" && next.phase.chain !== null;
  const then = inChain ? "You can jump again, or end your turn." : whatComesNext(next);
  return `${step}${crowning} ${then}`;
}

// The computer's whole move, once it has been shown: "The computer jumped row 1, column 2 to row 5, column 6,
// taking 2 pieces. Your turn." A king's chain can end where it began (spec section 6.6, item 2): "The computer
// jumped from row 2, column 3 and back again, taking 4 pieces." The owner approved this on 2026-11-24.
// The board from before the move is turnStart.
function computerMove(previous: GameState, next: GameState): string | null {
  if (previous.phase.kind !== "computerMoving") {
    return null;
  }
  const { move } = previous.phase;
  const before = previous.turnStart.board;
  const taken = move.captured.length;
  const crowned = !isKing(cellAt(before, move.from)) && isKing(cellAt(next.board, move.to));

  let taking = "";
  if (taken === 1) {
    taking = `, taking your ${pieceKind(before, move.captured[0])}`;
  } else if (taken > 1) {
    taking = `, taking ${taken} pieces`;
  }
  const verbPart = taken === 0 ? "moved" : "jumped";
  const route = samePosition(move.from, move.to)
    ? `from ${place(move.from)} and back again`
    : `${place(move.from)} to ${place(move.to)}`;
  const crowning = crowned ? ". Its man becomes a king." : ".";
  return `The computer ${verbPart} ${route}${taking}${crowning} ${whatComesNext(next)}`;
}

// The start of the next turn, the computer thinking, a failure, or the result.
function whatComesNext(next: GameState): string {
  switch (next.phase.kind) {
    case "turn":
      return `${turnOf(next.settings, next.toMove)}.`;
    case "computerThinking":
    case "computerMoving":
      return "The computer is thinking.";
    case "computerFailed":
      return FAILED;
    case "over":
      return resultSentence(next.settings, next.phase.result);
  }
}

// "Your turn" in a computer game, or "Player 2's turn" (the design).
function turnOf(settings: Settings, player: Player): string {
  return settings.opponent === "computer" ? "Your turn" : `Player ${player}'s turn`;
}

// Spec section 6.1.11, item 2.
function playerName(settings: Settings, player: Player): string {
  if (settings.opponent === "computer") {
    return player === 1 ? "You" : "The computer";
  }
  return `Player ${player}`;
}

// "You win" and "You have", but "The computer wins" and "Player 2 has".
function verb(settings: Settings, player: Player, forYou: string, forOthers: string): string {
  return settings.opponent === "computer" && player === 1 ? forYou : forOthers;
}

function place(position: Position): string {
  return `row ${position.row + 1}, column ${position.col + 1}`;
}

function pieceKind(board: Board, position: Position): string {
  return isKing(cellAt(board, position)) ? "king" : "man";
}

function ownerIn(board: Board, position: Position): Player | null {
  return ownerOf(cellAt(board, position));
}

function isEmptyIn(board: Board, position: Position): boolean {
  return ownerIn(board, position) === null;
}

function findSquare(matches: (position: Position) => boolean): Position | null {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (matches({ row, col })) {
        return { row, col };
      }
    }
  }
  return null;
}

function sameBoard(a: Board, b: Board): boolean {
  return findSquare((position) => cellAt(a, position) !== cellAt(b, position)) === null;
}
