import { FindAvailableMoves, FindAvailableTakeMoves } from './helpers/findMove';

export {
    pickMoveForPlayer2 
}

function pickMoveForPlayer2(board) {
    let takeMoves = FindAvailableTakeMoves(board, 2);
    if (takeMoves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * takeMoves.length));
        let takeMove = takeMoves[randomNumber];
        let takes = [];
        for (let index = 1; index < takeMove.length; index++) {
            const element = takeMove[index];
            takes.push({
                height: element.takeHeight,
                width: element.takeWidth
            })
        }
        return {
            currentHeight: takeMove[0].currentHeight,
            currentWidth: takeMove[0].currentWidth,
            nextHeight: takeMove[takeMove.length - 1].nextHeight,
            nextWidth: takeMove[takeMove.length - 1].nextWidth,
            takes: takes
        };
    }

    let moves = FindAvailableMoves(board, 2)
    if (moves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * moves.length));
        return (moves[randomNumber]);
    }
}