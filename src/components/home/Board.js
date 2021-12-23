import React, { useState, useEffect, useContext } from "react";
import Square from './Square';
import JumpModal from './JumpModal';
import InvalidMoveModal from './InvalidMoveModal';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { findPlayerMoves } from '../../logic/playerTips';
import { GetPlayerTips } from '../../logic/api';
import { MyContext } from '../../store/MyProvider';
import { startingBoard } from '../../logic/boardLib';
import '../../style/Board.css';

export default function Board(props) {
    const [counters] = useState(startingBoard);
    const [counterToMove, setCounterToMove] = useState(null);
    const [squareToMoveTo, setSquareToMoveTo] = useState(null);
    const [squares, setSquares] = useState(renderSquares());
    const [showTips, setShowTips] = useState(true);
    const [showJumpModal, setShowJumpModal] = useState(false);
    const [JumpModalValue, setJumpModalValue] = useState(false);
    const [listOfMoves, setListOfMoves] = useState([]);
    const [showInvalidMoveModal, setShowInvalidMoveModal] = useState(false);
    const context = useContext(MyContext);

    let tipButtonText = showTips ? "Show player tips" : "Hide player tips";

    function renderSquares() {
        return counters.map((row, index) => {
            let y = index;
            return (
                <tr key={y}>
                    {
                        row.map((piece, index) => <td key={y + index} className="p-0"><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                    }
                </tr>
            )
        })
    }

    function moveCounter() {
        counters[counterToMove.height][counterToMove.width] = 5;
        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

        kingMeCheck();
        setSquares(renderSquares());
        props.setTurn(!props.turn);
    }

    function takeCounter(res, res2) {
        counters[counterToMove.height][counterToMove.width] = 5;
        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

        if (counters[res][res2] === 1 || counters[res][res2] === 3) {
            props.setPlayer1Counter(props.player1Counter + 1);
        }
        else if (counters[res][res2] === 2 || counters[res][res2] === 4) {
            props.setPlayer2Counter(props.player2Counter + 1);
        }

        counters[res][res2] = 5;

        kingMeCheck();
        setSquares(renderSquares());
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

        setSquares(renderSquares());
    }

    async function displayTips(player) {
        try {
            const tips = await GetPlayerTips(counters, player);

            tips.forEach(element => {
                counters[element.height][element.width] = 6;
            });

            setSquares(renderSquares());
        }
        catch (error) {
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
        }
        else {
            clearTips();
            setShowTips(true);
        }
    }

    function noOneCanMoveCheck() {
        let player1Moves = findPlayerMoves(counters, 1);
        let player2Moves = findPlayerMoves(counters, 2);

        if (player1Moves.length === 0 && player2Moves.length === 0) {
            props.setResultsModalTitle("Tied game");
            props.setResultsModalMessage("No player can move. Therefore the game ends in a tie. I hope you had fun playing.");
            props.setShowResultModal(true);
        } else if (player1Moves.length === 0) {
            props.setResultsModalTitle("Player 2 wins");
            props.setResultsModalMessage("Player 1 can no longer move. Player 2 wins. I hope you had fun playing.");
            props.setShowResultModal(true);
        } else if (player2Moves.length === 0) {
            props.setResultsModalTitle("Player 1 wins");
            props.setResultsModalMessage("Player 2 can no longer move. Player 1 wins. I hope you had fun playing.");
            props.setShowResultModal(true);
        }
    }

    function checkToJumpUpAgain(value) {
        try {
            //left
            if (counters[squareToMoveTo.height - 1][squareToMoveTo.width - 1] === value) {
                if (counters[squareToMoveTo.height - 2][squareToMoveTo.width - 2] === 5 || counters[squareToMoveTo.height - 2][squareToMoveTo.width - 2] === 6) {
                    return true;
                }
            }

            //Right
            if (counters[squareToMoveTo.height - 1][squareToMoveTo.width + 1] === value) {
                if (counters[squareToMoveTo.height - 2][squareToMoveTo.width + 2] === 5 || counters[squareToMoveTo.height - 2][squareToMoveTo.width + 2] === 6) {
                    return true;
                }
            }

            return false;
        }
        catch {
            return false;
        }
    }

    function checkToJumpDownAgain(value) {
        try {
            //left
            if (counters[squareToMoveTo.height + 1][squareToMoveTo.width - 1] === value) {
                if (counters[squareToMoveTo.height + 2][squareToMoveTo.width - 2] === 5 || counters[squareToMoveTo.height + 2][squareToMoveTo.width - 2] === 6) {
                    return true;
                }
            }

            //Right
            if (counters[squareToMoveTo.height + 1][squareToMoveTo.width + 1] === value) {
                if (counters[squareToMoveTo.height + 2][squareToMoveTo.width + 2] === 5 || counters[squareToMoveTo.height + 2][squareToMoveTo.width + 2] === 6) {
                    return true;
                }
            }

            return false;
        }
        catch {
            return false;
        }
    }

    function checkMoveCounter(value) {
        if (counterToMove.height + value === squareToMoveTo.height) {
            if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                return true;
            }
        }

        return false;
    }

    function checkTakeCounter(value, playerToTake) {
        if (counterToMove.height + value === squareToMoveTo.height) {
            if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                let res = (squareToMoveTo.height + counterToMove.height) / 2;
                let res2 = (squareToMoveTo.width + counterToMove.width) / 2
                if (counters[res][res2] === playerToTake) {
                    return {
                        result: true,
                        height: res,
                        width: res2
                    }
                }
            }
        }

        return {
            result: false
        }
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
                    }
                    else if (counters[i][j] !== temp.board[i][j]) {
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

            setSquares(renderSquares());
        }
    }

    function saveBoard() {
        let copyBoard = [];
        for (let i = 0; i < counters.length; i++) {
            copyBoard[i] = counters[i].slice();
        }
        setListOfMoves(moves => [...moves, {
            turn: props.turn,
            board: copyBoard
        }]);
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
        }
        else {
            props.setResultsModalTitle("Player 1 wins");
            props.setResultsModalMessage("Player 2 has given up on the game.");
        }

        props.setShowResultModal(true);
    }

    useEffect(() => {
        if (counterToMove != null && squareToMoveTo != null) {
            let validMove = false;
            //Player1 
            if (props.turn === true) {
                if (counterToMove.state === 1) {
                    let canTake = checkTakeCounter(-2, 2);
                    if (canTake.result) {
                        saveBoard();
                        takeCounter(canTake.height, canTake.width);
                        validMove = true;
                        if (checkToJumpUpAgain(2)) {
                            setShowJumpModal(true);
                        }
                    }
                    else if (checkMoveCounter(-1)) {
                        saveBoard();
                        moveCounter();
                        validMove = true;
                    }
                }
            }
            //Player 2
            if (props.turn === false) {
                if (counterToMove.state === 2) {
                    let canTake = checkTakeCounter(2, 1);
                    if (canTake.result) {
                        saveBoard();
                        takeCounter(canTake.height, canTake.width);
                        validMove = true;
                        if (checkToJumpDownAgain(1)) {
                            setShowJumpModal(true);
                        }
                    }
                    else if (checkMoveCounter(1)) {
                        saveBoard();
                        moveCounter();
                        validMove = true;
                    }

                }
            }
            //Player 1 or 2 king
            if (counterToMove.state === 3 || counterToMove.state === 4) {
                if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        if ((counterToMove.state === 3 && props.turn === true) || (counterToMove.state === 4 && props.turn === false)) {
                            saveBoard();
                            moveCounter();
                            validMove = true;
                        }
                    }
                }
                else if (counterToMove.height - 2 === squareToMoveTo.height || counterToMove.height + 2 === squareToMoveTo.height) {
                    if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                        let res = (squareToMoveTo.height + counterToMove.height) / 2;
                        let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
                        //Player 1 king takes player 2
                        if (props.turn === true) {
                            if (counterToMove.state === 3 && (counters[res][res2] === 2 || counters[res][res2] === 4)) {
                                saveBoard();
                                takeCounter(res, res2);
                                validMove = true;
                                if (checkToJumpUpAgain(2) || checkToJumpUpAgain(4) || checkToJumpDownAgain(2) || checkToJumpDownAgain(4)) {
                                    setShowJumpModal(true);
                                }
                            }
                        }
                        //Player 2 king takes player 1
                        else if (props.turn === false) {
                            if (counterToMove.state === 4 && (counters[res][res2] === 1 || counters[res][res2] === 3)) {
                                saveBoard();
                                takeCounter(res, res2);
                                validMove = true;
                                if (checkToJumpUpAgain(1) || checkToJumpUpAgain(3) || checkToJumpDownAgain(1) || checkToJumpDownAgain(3)) {
                                    setShowJumpModal(true);
                                }
                            }
                        }
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
    }, [squareToMoveTo, counterToMove, counters])

    useEffect(() => {
        if (JumpModalValue) {
            props.setTurn(!props.turn);
            setJumpModalValue(false);
        }
    }, [JumpModalValue, props])

    return (
        <div className="container fluid">

            <div className="d-flex justify-content-center mb-3">
                <h2>2 Player Mode</h2>
            </div>

            <ButtonToolbar className="d-flex justify-content-center mb-2">
                <ButtonGroup className="ml-3 me-3 mb-4">
                    <Button onClick={showPlayerTips} size="lg">{tipButtonText}</Button>
                </ButtonGroup>
                <ButtonGroup className="ml-3 me-3 mb-4">
                    <Button onClick={undo} size="lg">Undo</Button>
                </ButtonGroup>
                <ButtonGroup className="ml-3 me-3 mb-4">
                    <Button onClick={giveUp} variant="danger" size="lg">Give up</Button>
                </ButtonGroup>
            </ButtonToolbar>

            <JumpModal show={showJumpModal} update={setShowJumpModal} setJumpModalValue={setJumpModalValue} />
            <InvalidMoveModal show={showInvalidMoveModal} update={setShowInvalidMoveModal} />

            <div className="d-flex justify-content-center">
                <table className="gameBorder">
                    <tbody className="border border-dark">
                        {squares}
                    </tbody>
                </table>
            </div>
        </div>
    )
}