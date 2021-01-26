export { findPlayerMoves }

let result = [];

function checkMoveUp(board, i, j) {
    try {
        //Check left side
        if (board[i - 1][j - 1] === 5 || board[i - 1][j - 1] === 6) {
            result.push({ height: i - 1, width: j - 1 });
        }

        //Check right side
        if (board[i - 1][j + 1] === 5 || board[i - 1][j + 1] === 6) {
            result.push({ height: i - 1, width: j + 1 });
        }
    }
    catch { }
}

function checkMoveDown(board, i, j) {
    try {
        //Check left side
        if (board[i + 1][j - 1] === 5 || board[i + 1][j - 1] === 6) {
            result.push({ height: i + 1, width: j - 1 });
        }

        //Check right side
        if (board[i + 1][j + 1] === 5 || board[i + 1][j + 1] === 6) {
            result.push({ height: i + 1, width: j + 1 });
        }
    }
    catch { }
}

function checkTakeUp(board, i, j, playerToTake) {
    try {
        //left
        if (playerToTake.includes(board[i - 1][j - 1])) {
            if (board[i - 2][j - 2] === 5 || board[i - 2][j - 2] === 6) {
                result.push({ height: i - 2, width: j - 2 });
                checkTakeUp(board, i - 2, j - 2, playerToTake)
            }
        }

        //Right
        if (playerToTake.includes(board[i - 1][j + 1])) {
            if (board[i - 2][j + 2] === 5 || board[i - 2][j + 2] === 6) {
                result.push({ height: i - 2, width: j + 2 });
                checkTakeUp(board, i - 2, j + 2, playerToTake)
            }
        }
    }
    catch { }
}

function checkTakeDown(board, i, j, playerToTake) {
    try {
        //left
        if (playerToTake.includes(board[i + 1][j - 1])) {
            if (board[i + 2][j - 2] === 5 || board[i + 2][j - 2] === 6) {
                result.push({ height: i + 2, width: j - 2 });
                checkTakeDown(board, i + 2, j - 2, playerToTake)
            }
        }

        //Right
        if (playerToTake.includes(board[i + 1][j + 1])) {
            if (board[i + 2][j + 2] === 5 || board[i + 2][j + 2] === 6) {
                result.push({ height: i + 2, width: j + 2 });
                checkTakeDown(board, i + 2, j + 2, playerToTake)
            }
        }
    }
    catch { }
}

function removeDuplicates(list) {
    let newList = [];

    list.forEach(element => {
        if (newList.length === 0) {
            newList.push(element);
        }
        else {
            let counter = 0;
            newList.forEach(element2 => {
                if (element.height === element2.height && element.width === element2.width) {
                    counter++;
                }
            });

            if (counter === 0) {
                newList.push(element);
            }
        }
    });

    return newList;
}

function findPlayerMoves(board, tipFor) {
    result = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === tipFor) {
                if (piece === 1) {
                    checkMoveUp(board, i, j);
                    checkTakeUp(board, i, j, [2])
                }
                else if (piece === 2) {
                    checkMoveDown(board, i, j);
                    checkTakeDown(board, i, j, [1]);
                }
                else if (piece === 3) {
                    checkMoveUp(board, i, j);
                    checkMoveDown(board, i, j);
                    checkTakeUp(board, i, j, [2, 4])
                    checkTakeDown(board, i, j, [2, 4]);
                }
                else if (piece === 4) {
                    checkMoveUp(board, i, j);
                    checkMoveDown(board, i, j);
                    checkTakeUp(board, i, j, [1, 3])
                    checkTakeDown(board, i, j, [1, 3]);
                }
            }
        }
    }

    return removeDuplicates(result);
}
