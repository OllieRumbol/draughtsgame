import { FindAvailableMoves, FindAvailableTakeMoves } from './helpers/findMove';

export {
    minimax,
    evaluate,
    GetAvailableBoards
}

function GetAvailableBoards(board, player) {
    let boardInfos = [];
    let takeMoves = FindAvailableTakeMoves(board, player);

    takeMoves.forEach(takeMove => {
        let tempBoard = [];
        for (let i = 0; i < board.length; i++) {
            tempBoard[i] = board[i].slice();
        }

        let takes = [];
        takeMove.slice(1).forEach(take => {
            tempBoard[take.takeHeight][take.takeWidth] = 5;
            takes.push({
                height: take.takeHeight,
                width: take.takeWidth
            })
        });

        let tempValue = tempBoard[takeMove[0].currentHeight][takeMove[0].currentWidth];
        tempBoard[takeMove[0].currentHeight][takeMove[0].currentWidth] = 5;
        tempBoard[takeMove[takeMove.length - 1].nextHeight][takeMove[takeMove.length - 1].nextWidth] = tempValue;

        boardInfos.push({
            board: tempBoard,
            currentHeight: takeMove[0].currentHeight,
            currentWidth: takeMove[0].currentWidth,
            nextHeight: takeMove[takeMove.length - 1].nextHeight,
            nextWidth: takeMove[takeMove.length - 1].nextWidth,
            takes: takes
        });
    });

    let moves = FindAvailableMoves(board, player);
    moves.forEach(move => {
        let tempBoard = [];
        for (let i = 0; i < board.length; i++) {
            tempBoard[i] = board[i].slice();
        }

        let tempValue = tempBoard[move.currentHeight][move.currentWidth];
        tempBoard[move.currentHeight][move.currentWidth] = 5;
        tempBoard[move.nextHeight][move.nextWidth] = tempValue;

        boardInfos.push({
            board: tempBoard,
            currentHeight: move.currentHeight,
            currentWidth: move.currentWidth,
            nextHeight: move.nextHeight,
            nextWidth: move.nextWidth,
            takes: move.takes
        });
    })

    return boardInfos;
}

function evaluate(board) {
    let player1Counter = 0;
    let player2Counter = 0;

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                player1Counter = player1Counter + 1;
            }
            else if (board[i][j] === 2) {
                player2Counter = player2Counter + 1;
            }
            else if (board[i][j] === 3) {
                player1Counter = player1Counter + 2;
            }
            else if (board[i][j] === 4) {
                player2Counter = player2Counter + 2;
            }
        }
    }
    return player2Counter - player1Counter;
}


function minimax(board, depth, minOrMax) {
    if (depth === 0) {
        return [evaluate(board), board];
    }

    if (minOrMax) {
        let maxEval = -1000;
        let bestMove = null;
        let player2MovesBoards = GetAvailableBoards(board, 2);
        player2MovesBoards.forEach(boardInfo => {
            let evaluation = minimax(boardInfo.board, depth - 1, false)[0];
            maxEval = Math.max(maxEval, evaluation);
            if (maxEval === evaluation) {
                bestMove = boardInfo;
            }
        });

        return [maxEval, bestMove];
    }
    else {
        let minEval = 1000;
        let bestMove = null;
        let player1MovesBoards = GetAvailableBoards(board, 1);
        player1MovesBoards.forEach(boardInfo => {
            let evaluation = minimax(boardInfo.board, depth - 1, true)[0];
            minEval = Math.min(minEval, evaluation);
            if (minEval === evaluation) {
                bestMove = boardInfo;
            }
        });

        return [minEval, bestMove];
    }
}