export { findPlayer1Moves }

let result = [];

function checkMove(board, i, j) {
    try {
        //Check left side
        if (board[i - 1][j - 1] === 5) {
            console.log("Found left");
            result.push({ height: i - 1, width: j - 1 });
        }

        //Check right side
        if (board[i - 1][j + 1] === 5) {
            console.log("Found right");
            result.push({ height: i - 1, width: j + 1 });
        }
    }
    catch { }
}

function checkTake(board, i, j, playerToTake) {
    try {
        //left
        if (board[i - 1][j - 1] === playerToTake) {
            if (board[i - 2][j - 2] === 5) {
                console.log("Found take left");
                result.push({ height: i - 2, width: j - 2 });
                checkTake(board, i - 2, j - 2, playerToTake)
            }
        }

        //Right
        if (board[i - 1][j + 1] === playerToTake) {
            if (board[i - 2][j + 2] === 5) {
                console.log("Found take right");
                result.push({ height: i - 2, width: j + 2 });
                checkTake(board, i - 2, j + 2, playerToTake)
            }
        }
    }
    catch { }
}

function findPlayer1Moves(board, tipFor, pieceToTake) {
    result = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === tipFor) {
                checkMove(board, i, j);
                checkTake(board, i, j, pieceToTake)
            }
        }
    }

    return result;
}
