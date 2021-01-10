import React, { useState, useEffect } from "react";
import Square from './Square';
import '../style/Board.css';

export default function Board(props) {
    //0 - Counter is never there
    //1 - Player 1 Counter 
    //2 - Player 2 Counter
    //3 - Player 1 King Counter
    //4 - Player 2 King Counter
    //5 - Playable space
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

    const [squares, setSquares] = useState(renderSquares());

    function renderSquares() {
        return counters.map((row, index) => {
            let y = index;
            return (
                <tr>
                    {
                        row.map((piece, index) => <td><Square state={piece} y={y} x={index} key={y+index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
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

    useEffect(() => {
        if (counterToMove != null && squareToMoveTo != null) {
            //Player1 
            if (counterToMove.state === 1) {
                if (counterToMove.height - 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        moveCounter();
                    }
                }
                //Player 1 taking player 2
                else if (counterToMove.height - 2 === squareToMoveTo.height) {
                    if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                        let res = (squareToMoveTo.height + counterToMove.height) / 2;
                        let res2 = (squareToMoveTo.width + counterToMove.width) / 2
                        if (counters[res][res2] === 2) {
                            takeCounter(res, res2);
                        }
                    }
                }
            }
            //Player 2
            else if (counterToMove.state === 2) {
                if (counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        moveCounter();
                    }
                }
                //Player 2 taking player 1
                else if (counterToMove.height + 2 === squareToMoveTo.height) {
                    if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                        let res = (squareToMoveTo.height + counterToMove.height) / 2;
                        let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
                        if (counters[res][res2] === 1) {
                            takeCounter(res, res2);
                        }
                    }
                }
            }
            //Player 1 or 2 king
            else if (counterToMove.state === 3 || counterToMove.state === 4) {
                if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        moveCounter();
                    }
                }
                else if (counterToMove.height - 2 === squareToMoveTo.height || counterToMove.height + 2 === squareToMoveTo.height) {
                    if (counterToMove.width - 2 === squareToMoveTo.width || counterToMove.width + 2 === squareToMoveTo.width) {
                        let res = (squareToMoveTo.height + counterToMove.height) / 2;
                        let res2 = (squareToMoveTo.width + counterToMove.width) / 2;
                        //Player 1 king takes player 2
                        if (counterToMove.state === 3 && (counters[res][res2] === 2 || counters[res][res2] === 4)) {
                            takeCounter(res, res2);
                        }
                        //Player 2 king takes player 1
                        else if (counterToMove.state === 4 && (counters[res][res2] === 1 || counters[res][res2] === 3)) {
                            takeCounter(res, res2);
                        }
                    }
                }
            }
            setCounterToMove(null);
            setSquareToMoveTo(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [squareToMoveTo, counterToMove, counters])

    return (
        <div className="container fluid d-flex justify-content-center">
            <table>
                <tbody className="border border-dark">
                    {squares}
                </tbody>
            </table>
        </div>
    )
}