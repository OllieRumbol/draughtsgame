import { FindAvailableMoves } from './helpers/findMove';

export {
    pickMoveForPlayer2
}

function pickMoveForPlayer2(board) {
    let moves = FindAvailableMoves(board, 2);

    let takeMoves = moves.filter(m => m.takes.length > 0);
    if (takeMoves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * takeMoves.length));
        return (takeMoves[randomNumber]);
    }

    if (moves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * moves.length));
        return (moves[randomNumber]);
    }
}