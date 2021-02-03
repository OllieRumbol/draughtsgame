
function checkMoveUpLeft(board, i, j) {
    try {
        if (board[i - 1][j - 1] === 5 || board[i - 1][j - 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveUpRight(board, i, j) {
    try {
        if (board[i - 1][j + 1] === 5 || board[i - 1][j + 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveDownLeft(board, i, j) {
    try {
        if (board[i + 1][j - 1] === 5 || board[i + 1][j - 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveDownRight(board, i, j) {
    try {
        if (board[i + 1][j + 1] === 5 || board[i + 1][j + 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function FindAvailableMoves(board) {
    let results = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === 2) {
                if (checkMoveDownLeft(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i + 1,
                        nextWidth: j - 1,
                        take: false
                    })
                }
                if (checkMoveDownRight(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i + 1,
                        nextWidth: j + 1,
                        take: false
                    })
                }
            }
            else if (piece === 4) {
                if (checkMoveDownLeft(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i + 1,
                        nextWidth: j - 1,
                        take: false
                    })
                }
                if (checkMoveDownRight(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i + 1,
                        nextWidth: j + 1,
                        take: false
                    })
                }
                if (checkMoveUpLeft(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i - 1,
                        nextWidth: j - 1,
                        take: false
                    })
                }
                if (checkMoveUpRight(board, i, j)) {
                    results.push({
                        currentHeight: i,
                        currentWidth: j,
                        nextHeight: i - 1,
                        nextWidth: j + 1,
                        take: false
                    })
                }
            }
        }
    }

    return results;
}

function pickMoveForPlayer2() {
    let board = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 4, 0, 4, 0, 4, 0],
        [0, 1, 0, 5, 0, 5, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 5, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]
    let takeMoves = FindAvailableTakeMoves(board);
    if (takeMoves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * takeMoves.length));
        return (takeMoves[randomNumber]);
    }

    // let moves = FindAvailableMoves(board)
    // if (moves.length !== 0) {
    //     let randomNumber = Math.floor((Math.random() * moves.length));
    //     return (moves[randomNumber]);
    // }
}

console.log(pickMoveForPlayer2());


