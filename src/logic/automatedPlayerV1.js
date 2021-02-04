class Tree {
    constructor(value) {
        this.Value = value;
        this.Left = null;
        this.Right = null
    }

}

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

function checkTakeDown(board, i, j, playerToTake, tree) {
    try {
        //left
        if (playerToTake.includes(board[i + 1][j - 1])) {
            if (board[i + 2][j - 2] === 5 || board[i + 2][j - 2] === 6) {
                tree.Left = new Tree({
                    takeHeight: i + 1,
                    takeWidth: j - 1,
                    nextHeight: i + 2,
                    nextWidth: j - 2
                })
                checkTakeDown(board, i + 2, j - 2, playerToTake, tree.Left);
            }
        }
    }
    catch { }

    try {
        //Right
        if (playerToTake.includes(board[i + 1][j + 1])) {
            if (board[i + 2][j + 2] === 5 || board[i + 2][j + 2] === 6) {
                tree.Right = new Tree({
                    takeHeight: i + 1,
                    takeWidth: j + 1,
                    nextHeight: i + 2,
                    nextWidth: j + 2
                })
                checkTakeDown(board, i + 2, j + 2, playerToTake, tree.Right);
            }
        }
    }
    catch { }

    return tree;
}

function FindAvailableTakeMoves(board) {
    let res = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === 2) {
                let resultTree = checkTakeDown(board, i, j, [1], new Tree({ currentHeight: i, currentWidth: j }));
                if (resultTree.Left != null || resultTree.Right != null) {
                    var treeArray = treeToArray(resultTree);
                    treeArray.forEach(element => {
                        res.push(element);
                    });
                }
            }
            else if (piece === 4) {

            }
        }
    }

    return res;
}

function treeToArray(mainTree) {
    function iter(tree, tempArray) {
        if (tree.Left != null && tree.Right != null) {
            return iter(tree.Left, tempArray.concat(tree.Value)) + iter(tree.Right, tempArray.concat(tree.Value));
        }
        else if (tree.Left != null) {
            return iter(tree.Left, tempArray.concat(tree.Value))
        }
        else if (tree.Right != null) {
            iter(tree.Right, tempArray.concat(tree.Value))
        }
        else {
            result.push(tempArray.concat(tree.Value));
        }
    }

    var result = [];
    iter(mainTree, []);
    return result;
}

function pickMoveForPlayer2() {
    let board = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [4, 0, 4, 0, 2, 0, 2, 0],
        [0, 1, 0, 1, 0, 1, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 5, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]
    let takeMoves = FindAvailableTakeMoves(board);
    if (takeMoves.length !== 0) {
        let randomNumber = Math.floor((Math.random() * takeMoves.length));
        var takeMove = takeMoves[randomNumber];
        let takes = [];
        for (let index = 1; index < takeMove.length; index++){
            const element = takeMove[index];
            takes.push({
                height: element.takeHeight,
                width: element.takeWidth
            })
        }
        return {
            currentHeight: takeMove[0].currentHeight,
            currentWidth: takeMove[0].currentWidth,
            nextHeight: takeMove[takeMove.length-1].nextHeight,
            nextWidth: takeMove[takeMove.length-1].nextWidth,
            take: true,
            takes: takes
        };
    }

    // let moves = FindAvailableMoves(board)
    // if (moves.length !== 0) {
    //     let randomNumber = Math.floor((Math.random() * moves.length));
    //     return (moves[randomNumber]);
    // }
}

let move = pickMoveForPlayer2();
console.log(move);


