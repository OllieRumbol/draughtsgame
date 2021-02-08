import React, { useState, useEffect } from 'react';
import Square from './Square';
import JumpModal from './JumpModal';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { findPlayerMoves } from '../../logic/playerTips';
import { pickMoveForPlayer2 } from '../../logic/automatedPlayerV1';

export default function PcBoard(props) {
    //0 - Counter is never there
    //1 - Player 1 Counter 
    //2 - Player 2 Counter
    //3 - Player 1 King Counter
    //4 - Player 2 King Counter
    //5 - Playable space
    //6 - Show player tip
    const start = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]

    const [counters, setCounters] = useState(start);

    const [counterToMove, setCounterToMove] = useState(null);
    const [squareToMoveTo, setSquareToMoveTo] = useState(null);

    const [showTips, setShowTips] = useState(true);
    let tipButtonText = showTips ? "Show player tips" : "Hide player tips";

    const [squares, setSquares] = useState(renderSquares());

    const [showJumpModal, setShowJumpModal] = useState(false);
    const [JumpModalValue, setJumpModalValue] = useState(null);

    const [listOfMoves, setListOfMoves] = useState([]);

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

    function checkMoveCounter(value) {
        if (counterToMove.height + value === squareToMoveTo.height) {
            if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                return true;
            }
        }

        return false;
    }

    function moveCounter() {
        counters[counterToMove.height][counterToMove.width] = 5;
        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

        kingMeCheck();
        setCounters(counters);
        setSquares(renderSquares());
        props.setTurn(false);
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

    function takeCounter(res, res2) {
        counters[counterToMove.height][counterToMove.width] = 5;
        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

        if (counters[res][res2] === 2 || counters[res][res2] === 4) {
            props.setPlayer2Counter(props.player2Counter + 1);
        }

        counters[res][res2] = 5;

        kingMeCheck();
        setCounters(counters);
        setSquares(renderSquares());
        props.setTurn(false);
    }

    function kingMeCheck() {
        //Player 1 check
        if (counterToMove.state === 1) {
            if (squareToMoveTo.height === 0) {
                counters[squareToMoveTo.height][squareToMoveTo.width] = 3;
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

        setCounters(counters);
        setSquares(renderSquares());
    }

    function displayTips() {
        if (props.turn === true) {
            let res = findPlayerMoves(counters, 1).concat(findPlayerMoves(counters, 3));
            res.forEach(element => {
                counters[element.height][element.width] = 6;
            });
        }
    }

    function showPlayerTips() {
        if (props.turn) {
            if (showTips) {
                displayTips();
                setShowTips(false);
            }
            else {
                clearTips();
                setShowTips(true);
            }

            setCounters(counters);
            setSquares(renderSquares());
        }
    }

    function noOneCanMoveCheck() {
        let player1Moves = findPlayerMoves(counters, 1).concat(findPlayerMoves(counters, 3));
        let player2Moves = findPlayerMoves(counters, 2).concat(findPlayerMoves(counters, 4));

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

        return counter
    }

    function player2Go() {
        setTimeout(() => {
            let player2Move = pickMoveForPlayer2(counters);
            if (player2Move !== null && player2Move !== {} && player2Move !== undefined) {
                if (player2Move.take) {
                    player2Move.takes.forEach(element => {
                        counters[element.height][element.width] = 5;
                    });
                    props.setPlayer1Counter(props.player1Counter + player2Move.takes.length);
                }

                let tempValue = counters[player2Move.currentHeight][player2Move.currentWidth];
                counters[player2Move.currentHeight][player2Move.currentWidth] = 5;
                counters[player2Move.nextHeight][player2Move.nextWidth] = tempValue;

                if (player2Move.nextHeight === 7) {
                    counters[player2Move.nextHeight][player2Move.nextWidth] = 4;
                }

                setCounters(counters);
                setSquares(renderSquares());
                props.setTurn(true);
            }
        }, 500)
    }

    useEffect(() => {
        noOneCanMoveCheck();
        let player2ToGoNext = true;
        let validMove = false;
        //Player1 
        if (props.turn) {
            if (counterToMove != null && squareToMoveTo != null) {
                if (counterToMove.state === 1) {
                    let canTake = checkTakeCounter(-2, 2);
                    if (canTake.result) {
                        saveBoard();
                        takeCounter(canTake.height, canTake.width);
                        validMove = true;
                        if (checkToJumpUpAgain(2)) {
                            player2ToGoNext = false;
                            setShowJumpModal(true);
                        }
                    }
                    else if (checkMoveCounter(-1)) {
                        saveBoard();
                        moveCounter();
                        validMove = true;
                    }
                }
                else if (counterToMove.state === 3) {
                    if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                        if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                            saveBoard();
                            moveCounter();
                            validMove = true;
                        }
                    }
                    else if (counterToMove.height - 2 === squareToMoveTo.height || counterToMove.height + 2 === squareToMoveTo.height) {
                        if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                            let res = (squareToMoveTo.height + counterToMove.height) / 2;
                            let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
                            //Player 1 king takes player 2
                            if (counters[res][res2] === 2 || counters[res][res2] === 4) {
                                saveBoard();
                                takeCounter(res, res2);
                                validMove = true;
                                if (checkToJumpUpAgain(2) || checkToJumpUpAgain(4) || checkToJumpDownAgain(2) || checkToJumpDownAgain(4)) {
                                    player2ToGoNext = false;
                                    setShowJumpModal(true);
                                }
                            }
                        }
                    }
                }

                clearTips();
                setShowTips(true);
                setCounterToMove(null);
                setSquareToMoveTo(null);

                if (player2ToGoNext && validMove) {
                    player2Go();
                }
                else if(validMove === false){
                    alert("Invalid move");
                }   
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [squareToMoveTo, counterToMove, counters])

    useEffect(() => {
        if (JumpModalValue) {
            props.setTurn(true);
            setJumpModalValue(null);
        }
        else if (JumpModalValue === false) {
            player2Go();
            setJumpModalValue(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JumpModalValue, props])

    return (
        <Container fluid>
            <div className="d-flex justify-content-center mb-3">
                <h2>PC Mode</h2>
            </div>

            <ButtonToolbar className="d-flex justify-content-center">
                <ButtonGroup className="ml-2 mr-2 mb-4">
                    <Button onClick={showPlayerTips}>{tipButtonText}</Button>
                </ButtonGroup>
                <ButtonGroup className="ml-2 mr-2 mb-4">
                    <Button onClick={undo}>Undo</Button>
                </ButtonGroup>
            </ButtonToolbar>

            <JumpModal show={showJumpModal} update={setShowJumpModal} setJumpModalValue={setJumpModalValue} />

            <div className="d-flex justify-content-center">
                <table className="gameBorder">
                    <tbody className="border border-dark">
                        {squares}
                    </tbody>
                </table>
            </div>
        </Container>
    )
}