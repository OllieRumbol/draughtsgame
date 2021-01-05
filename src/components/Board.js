import '../style/Board.css';
import React, { useState } from "react";
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

    const [squares, setSquares] = useState(counters.map((row, index) => {
        let y = index;
        return (
            <tr>
                {
                    row.map((piece, index) => <td><Square state={piece} y={y} x={index}></Square></td>)
                }
            </tr>
        )
    }));

    const [counterToMove, setcounterToMove] = useState({});
    const [squareToMoveTo, setsquareToMoveTo] = useState({});

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