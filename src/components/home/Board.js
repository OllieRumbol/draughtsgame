import React, { useState, useEffect, useContext } from "react";
import Square from "./Square";
import JumpModal from "./JumpModal";
import InvalidMoveModal from "./InvalidMoveModal";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { findPlayerMoves } from "../../logic/playerTips";
import { GetPlayerTips } from "../../logic/api";
import { MyContext } from "../../store/MyProvider";
import { startingBoard } from "../../logic/boardLib";
import "../../style/Board.css";

export default function Board(props) {
  const [counters] = useState(startingBoard);
  const [counterToMove, setCounterToMove] = useState(null);
  const [squareToMoveTo, setSquareToMoveTo] = useState(null);
  const [showTips, setShowTips] = useState(true);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [JumpModalValue, setJumpModalValue] = useState(false);
  const [listOfMoves, setListOfMoves] = useState([]);
  const [showInvalidMoveModal, setShowInvalidMoveModal] = useState(false);
  const context = useContext(MyContext);

  let tipButtonText = showTips ? "Show player tips" : "Hide player tips";

  function moveCounter() {
    counters[counterToMove.height][counterToMove.width] = 5;
    counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

    kingMeCheck();
    props.setTurn(!props.turn);
  }

  function takeCounter(height, width) {
    counters[counterToMove.height][counterToMove.width] = 5;
    counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

    if (counters[height][width] === 1 || counters[height][width] === 3) {
      props.setPlayer1Counter(props.player1Counter + 1);
    } else if (counters[height][width] === 2 || counters[height][width] === 4) {
      props.setPlayer2Counter(props.player2Counter + 1);
    }

    counters[height][width] = 5;

    kingMeCheck();
    props.setTurn(!props.turn);
  }

  function kingMeCheck() {
    //Player 1 check
    if (counterToMove.state === 1) {
      if (squareToMoveTo.height === 0) {
        counters[squareToMoveTo.height][squareToMoveTo.width] = 3;
      }
    }
    //Player 2 check
    else if (counterToMove.state === 2) {
      if (squareToMoveTo.height === 7) {
        counters[squareToMoveTo.height][squareToMoveTo.width] = 4;
      }
    }
  }

  function clearTips() {
    for (let i = 0; i < counters.length; i++) {
      for (let j = 0; j < counters[i].length; j++) {
        if (counters[i][j] === 6) {
          counters[i][j] = 5;
        }
      }
    }
  }

  async function displayTips(player) {
    try {
      const tips = await GetPlayerTips(counters, player);

      tips.forEach((element) => {
        counters[element.height][element.width] = 6;
      });
    } catch (error) {
      console.log(error);
      context.setErrorMessage(error);
      context.setDisplayErrorMessage(true);
    }
  }

  async function showPlayerTips() {
    if (showTips) {
      let player = props.turn === true ? 1 : 2;
      await displayTips(player);
      setShowTips(false);
    } else {
      clearTips();
      setShowTips(true);
    }
  }

  function noOneCanMoveCheck() {
    let player1Moves = findPlayerMoves(counters, 1);
    let player2Moves = findPlayerMoves(counters, 2);

    if (player1Moves.length === 0 && player2Moves.length === 0) {
      props.setResultsModalTitle("Tied game");
      props.setResultsModalMessage(
        "No player can move. Therefore the game ends in a tie. I hope you had fun playing."
      );
      props.setShowResultModal(true);
    } else if (player1Moves.length === 0) {
      props.setResultsModalTitle("Player 2 wins");
      props.setResultsModalMessage(
        "Player 1 can no longer move. Player 2 wins. I hope you had fun playing."
      );
      props.setShowResultModal(true);
    } else if (player2Moves.length === 0) {
      props.setResultsModalTitle("Player 1 wins");
      props.setResultsModalMessage(
        "Player 2 can no longer move. Player 1 wins. I hope you had fun playing."
      );
      props.setShowResultModal(true);
    }
  }

  function checkToJumpUpAgain(value) {
    try {
      //left
      if (
        counters[squareToMoveTo.height - 1][squareToMoveTo.width - 1] === value
      ) {
        if (
          counters[squareToMoveTo.height - 2][squareToMoveTo.width - 2] === 5 ||
          counters[squareToMoveTo.height - 2][squareToMoveTo.width - 2] === 6
        ) {
          return true;
        }
      }

      //Right
      if (
        counters[squareToMoveTo.height - 1][squareToMoveTo.width + 1] === value
      ) {
        if (
          counters[squareToMoveTo.height - 2][squareToMoveTo.width + 2] === 5 ||
          counters[squareToMoveTo.height - 2][squareToMoveTo.width + 2] === 6
        ) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  function checkToJumpDownAgain(value) {
    try {
      //left
      if (
        counters[squareToMoveTo.height + 1][squareToMoveTo.width - 1] === value
      ) {
        if (
          counters[squareToMoveTo.height + 2][squareToMoveTo.width - 2] === 5 ||
          counters[squareToMoveTo.height + 2][squareToMoveTo.width - 2] === 6
        ) {
          return true;
        }
      }

      //Right
      if (
        counters[squareToMoveTo.height + 1][squareToMoveTo.width + 1] === value
      ) {
        if (
          counters[squareToMoveTo.height + 2][squareToMoveTo.width + 2] === 5 ||
          counters[squareToMoveTo.height + 2][squareToMoveTo.width + 2] === 6
        ) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  function checkMoveCounter(value) {
    if (counterToMove.height + value === squareToMoveTo.height) {
      if (
        counterToMove.width - 1 === squareToMoveTo.width ||
        counterToMove.width + 1 === squareToMoveTo.width
      ) {
        return true;
      }
    }

    return false;
  }

  function checkTakeCounter(value, playerToTake) {
    if (counterToMove.height + value === squareToMoveTo.height) {
      if (
        counterToMove.width - 2 === squareToMoveTo.width ||
        counterToMove.width + 2 === squareToMoveTo.width
      ) {
        let res = (squareToMoveTo.height + counterToMove.height) / 2;
        let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
        if (counters[res][res2] === playerToTake) {
          return {
            result: true,
            height: res,
            width: res2,
          };
        }
      }
    }

    return {
      result: false,
    };
  }

  function undo() {
    if (listOfMoves.length !== 0) {
      if (showTips === false) {
        setShowTips(true);
      }

      let temp = listOfMoves[listOfMoves.length - 1];
      for (let i = 0; i < counters.length; i++) {
        for (let j = 0; j < counters[i].length; j++) {
          if (temp.board[i][j] === 6) {
            counters[i][j] = 5;
          } else if (counters[i][j] !== temp.board[i][j]) {
            counters[i][j] = temp.board[i][j];
          }
        }
      }

      props.setTurn(temp.turn);

      listOfMoves.pop();

      let piecesTakenPlayer1 = 12 - calculatePiecesTaken(1);
      props.setPlayer1Counter(piecesTakenPlayer1);
      let piecesTakenPlayer2 = 12 - calculatePiecesTaken(2);
      props.setPlayer2Counter(piecesTakenPlayer2);

      //setSquares(renderSquares());
    }
  }

  function saveBoard() {
    let copyBoard = [];
    for (let i = 0; i < counters.length; i++) {
      copyBoard[i] = counters[i].slice();
    }
    setListOfMoves((moves) => [
      ...moves,
      {
        turn: props.turn,
        board: copyBoard,
      },
    ]);
  }

  function calculatePiecesTaken(player) {
    let counter = 0;
    for (let i = 0; i < counters.length; i++) {
      for (let j = 0; j < counters[i].length; j++) {
        if (counters[i][j] === player || counters[i][j] === player + 2) {
          counter++;
        }
      }
    }

    return counter;
  }

  function giveUp() {
    if (props.turn === true) {
      props.setResultsModalTitle("Player 2 wins");
      props.setResultsModalMessage("Player 1 has given up on the game.");
    } else {
      props.setResultsModalTitle("Player 1 wins");
      props.setResultsModalMessage("Player 2 has given up on the game.");
    }

    props.setShowResultModal(true);
  }

  function singlePieceMove(
    turn,
    player,
    playerToTake,
    takeDirection,
    moveDirection
  ) {
    let isValidMove = false;
    if (props.turn === turn && counterToMove.state === player) {
      let canTake = checkTakeCounter(takeDirection, playerToTake);
      if (canTake.result) {
        saveBoard();
        takeCounter(canTake.height, canTake.width);
        isValidMove = true;
        if (checkToJumpUpAgain(playerToTake)) {
          setShowJumpModal(true);
        }
      } else if (checkMoveCounter(moveDirection)) {
        saveBoard();
        moveCounter();
        isValidMove = true;
      }
    }

    return isValidMove;
  }

  function kingTakeMove(turn, king, singleToTake, kingToTake) {
    let isValidMove = false;
    let takeHeight = (squareToMoveTo.height + counterToMove.height) / 2;
    let takeWidth = (squareToMoveTo.width + counterToMove.width) / 2;

    if (props.turn === turn) {
      if (
        counterToMove.state === king &&
        (counters[takeHeight][takeWidth] === singleToTake ||
          counters[takeHeight][takeWidth] === kingToTake)
      ) {
        saveBoard();
        takeCounter(takeHeight, takeWidth);
        isValidMove = true;
        if (
          checkToJumpUpAgain(singleToTake) ||
          checkToJumpUpAgain(kingToTake) ||
          checkToJumpDownAgain(singleToTake) ||
          checkToJumpDownAgain(kingToTake)
        ) {
          setShowJumpModal(true);
        }
      }
    }

    return isValidMove;
  }

  useEffect(() => {
    if (counterToMove != null && squareToMoveTo != null) {
      let validMove = false;
      //Player 1 move
      validMove = singlePieceMove(true, 1, 2, -2, -1);
      if (validMove === false) {
        //Player 2 move
        validMove = singlePieceMove(false, 2, 1, 2, 1);
      }

      //Player 1 or 2 king
      if (
        (counterToMove.state === 3 && props.turn === true) ||
        (counterToMove.state === 4 && props.turn === false)
      ) {
        //king move
        if (
          (counterToMove.height - 1 === squareToMoveTo.height ||
            counterToMove.height + 1 === squareToMoveTo.height) &&
          (counterToMove.width - 1 === squareToMoveTo.width ||
            counterToMove.width + 1 === squareToMoveTo.width)
        ) {
          saveBoard();
          moveCounter();
          validMove = true;
        } else if (
          (counterToMove.height - 2 === squareToMoveTo.height ||
            counterToMove.height + 2 === squareToMoveTo.height) &&
          (counterToMove.width - 2 === squareToMoveTo.width ||
            counterToMove.width + 2 === squareToMoveTo.width)
        ) {
          //Player 1 king take move
          if (validMove === false) {
            validMove = kingTakeMove(true, 3, 2, 4);
          }

          //Player 2 king take move
          if (validMove === false) {
            validMove = kingTakeMove(false, 4, 1, 3);
          }
        }
      }

      if (validMove === false) {
        setShowInvalidMoveModal(true);
      }

      clearTips();
      setShowTips(true);
      setCounterToMove(null);
      setSquareToMoveTo(null);
      noOneCanMoveCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squareToMoveTo, counterToMove, counters]);

  useEffect(() => {
    if (JumpModalValue) {
      props.setTurn(!props.turn);
      setJumpModalValue(false);
    }
  }, [JumpModalValue, props]);

  return (
    <div>
      <div className="d-flex justify-content-center mb-3">
        <h2>
          <span class="badge bg-dark">2 Player Mode</span>
        </h2>
      </div>

      <ButtonToolbar className="d-flex justify-content-center mb-2">
        <ButtonGroup className="ml-3 me-3 mb-4">
          <Button onClick={showPlayerTips} size="lg">
            {tipButtonText}
          </Button>
        </ButtonGroup>
        <ButtonGroup className="ml-3 me-3 mb-4">
          <Button onClick={undo} size="lg">
            Undo
          </Button>
        </ButtonGroup>
        <ButtonGroup className="ml-3 me-3 mb-4">
          <Button onClick={giveUp} variant="danger" size="lg">
            Give up
          </Button>
        </ButtonGroup>
      </ButtonToolbar>

      <JumpModal
        show={showJumpModal}
        update={setShowJumpModal}
        setJumpModalValue={setJumpModalValue}
      />
      <InvalidMoveModal
        show={showInvalidMoveModal}
        update={setShowInvalidMoveModal}
      />

      <div className="d-flex justify-content-center">
        <table className="gameBorder">
          <tbody className="border border-dark">
            {counters.map((row, index) => {
              let y = index;
              return (
                <tr key={y}>
                  {row.map((piece, index) => (
                    <td key={y + index} className="p-0">
                      <Square
                        state={piece}
                        y={y}
                        x={index}
                        setSquareToMoveTo={setSquareToMoveTo}
                        setCounterToMove={setCounterToMove}
                      ></Square>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
