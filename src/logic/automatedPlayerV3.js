import { FindAvailableMoves } from './helpers/findMove';

export {
    minimax,
    evaluate,
    GetAvailableBoards,
}

function GetAvailableBoards(board, player) {
    let boardInfos = [];
    let moves = FindAvailableMoves(board, player);

    moves.forEach(move => {
        let tempBoard = [];
        for (let i = 0; i < board.length; i++) {
            tempBoard[i] = board[i].slice();
        }

        move.takes.forEach(take => {
            tempBoard[take.height][take.width] = 5;
        });

        let tempValue = tempBoard[move.currentHeight][move.currentWidth];
        tempBoard[move.currentHeight][move.currentWidth] = 5;
        tempBoard[move.nextHeight][move.nextWidth] = tempValue;

        move.board = tempBoard

        boardInfos.push(move);
    });

    return boardInfos;
}

function evaluate(board) {
    let player1Counter = 0;
    let player2Counter = 0;
    let player1TakeMoves = GetPiecesTaken(FindAvailableMoves(board, 1));
    let player2TakeMoves = GetPiecesTaken(FindAvailableMoves(board, 2));

    const numberOfRows = 7;
    const kingBonusPoints = 2;

    //Spaces in between points to differentiate between pieces
    // 2 point: If the king can be taken
    // 4 points: If the single piece can be taken
    // 6 points: If the single piece cant be taken
    // 8 points: If king can't be taken

    // Award points based on the row the piece is on, more points a piece gets the further the piece travels
    // Kings get points for the number of rows on the board plus 2

    for (let i = 0; i < board.length; i++) {
        for (let j = 1 - (i % 2); j < board[i].length; j++) {
            if (board[i][j] === 1) {
                if (CanPieceBeTaken(player2TakeMoves, i, j)) {
                    player1Counter = player1Counter + 4 + (numberOfRows - i);
                }
                else {
                    player1Counter = player1Counter + 6 + (numberOfRows - i);
                }
            }
            else if (board[i][j] === 2) {
                if (CanPieceBeTaken(player1TakeMoves, i, j)) {
                    player2Counter = player2Counter + 4 + i;
                }
                else {
                    player2Counter = player2Counter + 6 + i;
                }
            }
            else if (board[i][j] === 3) {
                if (CanPieceBeTaken(player2TakeMoves, i, j)) {
                    player1Counter = player1Counter + 2 + numberOfRows + kingBonusPoints;
                }
                else {
                    player1Counter = player1Counter + 8 + numberOfRows + kingBonusPoints;
                }
            }
            else if (board[i][j] === 4) {
                if (CanPieceBeTaken(player1TakeMoves, i, j)) {
                    player2Counter = player2Counter + 2 + numberOfRows + kingBonusPoints;
                }
                else {
                    player2Counter = player2Counter + 8 + numberOfRows + kingBonusPoints;
                }
            }
        }
    }

    return player2Counter - player1Counter;
}

function GetPiecesTaken(moves) {
    let results = [];

    moves.forEach(move => {
        move.takes.forEach(take => {
            results.push(take);
        });
    });

    return results;
}

function CanPieceBeTaken(takes, height, width) {
    let result = false;
    takes.forEach(element => {
        if (element.height === height && element.width === width) {
            result = true;
            //break
            return false;
        }
    });

    return result;
}

// function findBiggest(moves) {
//     let maxValue = -1000;
//     moves.forEach(element => {
//         maxValue = Math.max(maxValue, element[0]);
//     });

//     return maxValue;
// }

// function findSmallest(moves) {
//     let minValue = 1000;
//     moves.forEach(element => {
//         minValue = Math.min(minValue, element[0]);
//     });

//     return minValue;
// }

// function filterMoves(moves, value) {
//     return moves.filter(move => {
//         return move[0] === value;
//     });
// }

// function minimax(board, depth, minOrMax) {
//     if (depth === 0) {
//         return [evaluate(board), board];
//     }

//     if (minOrMax) {
//         let moves = [];
//         let bestMove = [-1000, null];
//         let player2MovesBoards = GetAvailableBoards(board, 2);
//         player2MovesBoards.forEach(boardInfo => {
//             let move = minimax(boardInfo.board, depth - 1, false)[0];
//             moves.push([move, boardInfo]);
//         });

//         if (moves.length !== 0) {
//             let biggestValue = findBiggest(moves);
//             let biggestMoves = filterMoves(moves, biggestValue);
//             let randomNumber = Math.floor((Math.random() * biggestMoves.length));

//             bestMove = biggestMoves[randomNumber];
//         }

//         return bestMove;
//     }
//     else {
//         let moves = [];
//         let bestMove = [1000, null]
//         let player1MovesBoards = GetAvailableBoards(board, 1);
//         player1MovesBoards.forEach(boardInfo => {
//             let move = minimax(boardInfo.board, depth - 1, true)[0];
//             moves.push([move, boardInfo]);
//         });

//         if (moves.length !== 0) {
//             let smallestValue = findSmallest(moves);
//             let smallestMoves = filterMoves(moves, smallestValue);
//             let randomNumber = Math.floor((Math.random() * smallestMoves.length));
//             bestMove = smallestMoves[randomNumber];
//         }

//         return bestMove;
//     }
// }

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

// FOR DEBUG
// let board = [
//     [0, 2, 0, 2, 0, 5, 0, 5],
//     [2, 0, 5, 0, 2, 0, 2, 0],
//     [0, 2, 0, 2, 0, 2, 0, 2],
//     [2, 0, 2, 0, 5, 0, 2, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 5, 0, 5, 0, 5, 0, 5],
//     [1, 0, 1, 0, 1, 0, 1, 0]
// ];

// //let result = minimax(board, 2, true);
// // //let result = evaluate(board);

// //console.log(result);

