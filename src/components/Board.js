import '../style/Board.css';
import React, { useState, useEffect } from "react";
import Square from './Square';

export default function Board() {
    //0 - Counter is never there
    //1 - Player 1 Counter 
    //2 - Player 2 Counter
    //3 - Player 1 King Counter
    //4 - Player 2 King Counter
    //5 - Playable space
    const [counters, setCounters] = useState([
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [4, 0, 2, 0, 2, 0, 2, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 3, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]);

    const [counterToMove, setCounterToMove] = useState(null);
    const [squareToMoveTo, setSquareToMoveTo] = useState(null);

    const [squares, setSquares] = useState(counters.map((row, index) => {
        let y = index;
        return (
            <tr>
                {
                    row.map((piece, index) => <td><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                }
            </tr>
        )
    }));

    useEffect(() => {
        if (counterToMove != null && squareToMoveTo != null) {
            //Player1 
            if (counterToMove.state === 1) {
                if (counterToMove.height - 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        counters[counterToMove.height][counterToMove.width] = 5;
                        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

                        setCounters(counters);
                        setSquares(counters.map((row, index) => {
                            let y = index;
                            return (
                                <tr>
                                    {
                                        row.map((piece, index) => <td><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                                    }
                                </tr>
                            )
                        }))
                    }
                }
            }
            //Player 2
            else if (counterToMove.state === 2) {
                if (counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        counters[counterToMove.height][counterToMove.width] = 5;
                        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

                        setCounters(counters);
                        setSquares(counters.map((row, index) => {
                            let y = index;
                            return (
                                <tr>
                                    {
                                        row.map((piece, index) => <td><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                                    }
                                </tr>
                            )
                        }))
                    }
                }
            }
            //Player 1 king
            else if (counterToMove.state === 3) {
                if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        counters[counterToMove.height][counterToMove.width] = 5;
                        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

                        setCounters(counters);
                        setSquares(counters.map((row, index) => {
                            let y = index;
                            return (
                                <tr>
                                    {
                                        row.map((piece, index) => <td><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                                    }
                                </tr>
                            )
                        }))
                    }
                }
            }
            //Player 2 king
            else if (counterToMove.state === 4) {
                if (counterToMove.height - 1 === squareToMoveTo.height || counterToMove.height + 1 === squareToMoveTo.height) {
                    if (counterToMove.width - 1 === squareToMoveTo.width || counterToMove.width + 1 === squareToMoveTo.width) {
                        counters[counterToMove.height][counterToMove.width] = 5;
                        counters[squareToMoveTo.height][squareToMoveTo.width] = counterToMove.state;

                        setCounters(counters);
                        setSquares(counters.map((row, index) => {
                            let y = index;
                            return (
                                <tr>
                                    {
                                        row.map((piece, index) => <td><Square state={piece} y={y} x={index} setSquareToMoveTo={setSquareToMoveTo} setCounterToMove={setCounterToMove}></Square></td>)
                                    }
                                </tr>
                            )
                        }))
                    }
                }
            }
            setCounterToMove(null);
            setSquareToMoveTo(null);
        }
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