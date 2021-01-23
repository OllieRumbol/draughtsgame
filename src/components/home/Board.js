import React, { useState, useEffect } from "react";
import Square from './Square';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import '../../style/Board.css';
import { findPlayerMoves } from '../../logic/playerTips';

export default function Board(props) {
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

    function renderSquares() {
        return counters.map((row, index) => {
            let y = index;
            return (
                <tr key={y}>
                    {
                        row.map((piece, index) => <td key={y + index}><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                    }
                </tr>
            )
        })
    }

    function moveCounter() {
        counters[counterToMove.height][counterToMove.width] = 5;
        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

        kingMeCheck();
        setCounters(counters);
        setSquares(renderSquares());
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
        setCounters(counters);
        setSquares(renderSquares());
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
        else if (props.turn === false) {
            let res = findPlayerMoves(counters, 2).concat(findPlayerMoves(counters, 4));
            res.forEach(element => {
                counters[element.height][element.width] = 6;
            });
        }
    }

    function showPlayerTips() {
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

    useEffect(() => {
        if (counterToMove != null && squareToMoveTo != null) {
            //Player1 
            if (props.turn === true) {
                if (counterToMove.state === 1) {
                    if (counterToMove.height - 1 === squareToMoveTo.height) {
                        if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                            moveCounter();
                            props.setTurn(!props.turn);
                        }
                    }
                    //Player 1 taking player 2
                    else if (counterToMove.height - 2 === squareToMoveTo.height) {
                        if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                            let res = (squareToMoveTo.height + counterToMove.height) / 2;
                            let res2 = (squareToMoveTo.width + counterToMove.width) / 2
                            if (counters[res][res2] === 2) {
                                takeCounter(res, res2);
                                props.setTurn(!props.turn);
                            }
                        }
                    }
                }
            }
            //Player 2
            if (props.turn === false) {
                if (counterToMove.state === 2) {
                    if (counterToMove.height + 1 === squareToMoveTo.height) {
                        if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                            moveCounter();
                            props.setTurn(!props.turn);
                        }
                    }
                    //Player 2 taking player 1
                    else if (counterToMove.height + 2 === squareToMoveTo.height) {
                        if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                            let res = (squareToMoveTo.height + counterToMove.height) / 2;
                            let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
                            if (counters[res][res2] === 1) {
                                takeCounter(res, res2);
                                props.setTurn(!props.turn);
                            }
                        }
                    }
                }
            }
            //Player 1 or 2 king
            if (counterToMove.state === 3 || counterToMove.state === 4) {
                if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        if ((counterToMove.state === 3 && props.turn === true) || (counterToMove.state === 4 && props.turn === false)) {
                            moveCounter();
                            props.setTurn(!props.turn);
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
                                takeCounter(res, res2);
                                props.setTurn(!props.turn);
                            }
                        }
                        //Player 2 king takes player 1
                        else if (props.turn === false) {
                            console.log("hello world");
                            if (counterToMove.state === 4 && (counters[res][res2] === 1 || counters[res][res2] === 3)) {
                                takeCounter(res, res2);
                                props.setTurn(!props.turn);
                            }
                        }
                    }
                }
            }
            clearTips();
            setShowTips(true);
            setCounterToMove(null);
            setSquareToMoveTo(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [squareToMoveTo, counterToMove, counters])

    return (
        <div className="container fluid">
            <ButtonToolbar className="d-flex justify-content-center">
                <ButtonGroup className="ml-2 mr-2 mb-4">
                    <Button onClick={showPlayerTips}>{tipButtonText}</Button>
                </ButtonGroup>
            </ButtonToolbar>

            <div className="d-flex justify-content-center">
                <table>
                    <tbody className="border border-dark">
                        {squares}
                    </tbody>
                </table>
            </div>
        </div>
    )
}