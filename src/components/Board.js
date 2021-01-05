import '../style/Board.css';
import Square from './Square';

export default function Board() {
    const squares = [];

    for (let index = 0; index < 8; index++) {
        if (index % 2 === 0) {
            squares.push(<tr>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
            </tr>
            );
        }
        else {
            squares.push(<tr>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
                <td><Square></Square></td>
                <td><Square isBlack="true"></Square></td>
            </tr>
            );
        }


    }

    return (
        <div className="container fluid">
            <table>
                <tbody class="border border-dark">
                    {squares}
                </tbody>
            </table>
        </div>
    )
}