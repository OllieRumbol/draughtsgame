import '../style/Board.css';
import Square from './Square';

export default function Board() {
    //0 - Counter is never there
    //1 - Player 1 Counter 
    //2 - Player 2 Counter
    //3 - Player 1 King Counter
    //4 - Player 2 King Counter
    //5 - Playable space

    const counters = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [4, 0, 2, 0, 2, 0, 2, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 3, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]

    const squares = counters.map(row => {
        return (
            <tr>
                {
                    row.map(piece => <td><Square state={piece}></Square></td>)
                }
            </tr>
        )
    });

    return (
        <div className="container fluid">
            <table>
                <tbody className="border border-dark">
                    {squares}
                </tbody>
            </table>
        </div>
    )
}