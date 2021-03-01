export {
    minimax,
    evaluate,
    GetAvailableBoards,
    FindAvailableTakeMoves,
    checkKingTake,
    checkTakeUp,
    checkTakeDown,
    FindAvailableMoves,
    checkMoveDownRight,
    checkMoveDownLeft,
    checkMoveUpRight,
    checkMoveUpLeft
}

class Tree {
    constructor(value) {
        this.Value = value;
        this.Left = null;
        this.Right = null;
    }

    static treeToArray(mainTree) {
        function iter(tree, tempArray) {
            if (tree.Left != null && tree.Right != null) {
                return iter(tree.Left, tempArray.concat(tree.Value)) + iter(tree.Right, tempArray.concat(tree.Value));
            }
            else if (tree.Left != null) {
                return iter(tree.Left, tempArray.concat(tree.Value))
            }
            else if (tree.Right != null) {
                return iter(tree.Right, tempArray.concat(tree.Value))
            }
            else {
                result.push(tempArray.concat(tree.Value));
            }
        }

        let result = [];
        iter(mainTree, []);
        return result;
    }
}

class KingTree {
    constructor(value) {
        this.Value = value;
        this.DownLeft = null;
        this.DownRight = null;
        this.UpLeft = null;
        this.UpRight = null;
    }

    static kingTreeToArray(mainTree) {
        function iter(tree, tempArray) {
            if (tree.DownLeft != null && tree.DownRight != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null && tree.UpLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownRight != null && tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.DownRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.DownRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownRight != null && tree.UpLeft != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value)) + iter(tree.UpLeft, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null && tree.UpRight != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.UpLeft != null && tree.UpRight != null) {
                return iter(tree.UpLeft, tempArray.concat(tree.Value)) + iter(tree.UpRight, tempArray.concat(tree.Value));
            }
            else if (tree.DownLeft != null) {
                return iter(tree.DownLeft, tempArray.concat(tree.Value))
            }
            else if (tree.DownRight != null) {
                return iter(tree.DownRight, tempArray.concat(tree.Value))
            }
            else if (tree.UpLeft != null) {
                return iter(tree.UpLeft, tempArray.concat(tree.Value))
            }
            else if (tree.UpRight != null) {
                return iter(tree.UpRight, tempArray.concat(tree.Value))
            }
            else {
                result.push(tempArray.concat(tree.Value));
            }
        }

        let result = [];
        iter(mainTree, []);
        return result;
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

function factoryForMove(height, width, moveHeight, moveWidth) {
    return {
        currentHeight: height,
        currentWidth: width,
        nextHeight: moveHeight,
        nextWidth: moveWidth,
        takes: []
    }
}

function FindAvailableMoves(board, player) {
    let results = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === 1 && player === 1) {
                if (checkMoveUpLeft(board, i, j)) {
                    results.push(factoryForMove(i, j, i - 1, j - 1));
                }
                if (checkMoveUpRight(board, i, j)) {
                    results.push(factoryForMove(i, j, i - 1, j + 1));
                }
            }
            else if (piece === 2 && player === 2) {
                if (checkMoveDownLeft(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j - 1));
                }
                if (checkMoveDownRight(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j + 1));
                }
            }
            else if ((piece === 3 && player === 1) || (piece === 4 && player === 2)) {
                if (checkMoveDownLeft(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j - 1));
                }
                if (checkMoveDownRight(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j + 1));
                }
                if (checkMoveUpLeft(board, i, j)) {
                    results.push(factoryForMove(i, j, i - 1, j - 1));
                }
                if (checkMoveUpRight(board, i, j)) {
                    results.push(factoryForMove(i, j, i - 1, j + 1));
                }
            }
        }
    }

    return results;
}

function factoryForTakeMove(takeHeight, takeWidth, nextHeight, nextWidth) {
    return {
        takeHeight: takeHeight,
        takeWidth: takeWidth,
        nextHeight: nextHeight,
        nextWidth: nextWidth
    }
}

function checkTakeDown(board, i, j, playerToTake, tree) {
    try {
        //left
        if (playerToTake.includes(board[i + 1][j - 1])) {
            if (board[i + 2][j - 2] === 5 || board[i + 2][j - 2] === 6) {
                tree.Left = new Tree(factoryForTakeMove(i + 1, j - 1, i + 2, j - 2));
                checkTakeDown(board, i + 2, j - 2, playerToTake, tree.Left);
            }
        }
    }
    catch { }

    try {
        //Right
        if (playerToTake.includes(board[i + 1][j + 1])) {
            if (board[i + 2][j + 2] === 5 || board[i + 2][j + 2] === 6) {
                tree.Right = new Tree(factoryForTakeMove(i + 1, j + 1, i + 2, j + 2));
                checkTakeDown(board, i + 2, j + 2, playerToTake, tree.Right);
            }
        }
    }
    catch { }

    return tree;
}

function checkTakeUp(board, i, j, playerToTake, tree) {
    try {
        //left
        if (playerToTake.includes(board[i - 1][j - 1])) {
            if (board[i - 2][j - 2] === 5 || board[i - 2][j - 2] === 6) {
                tree.Left = new Tree(factoryForTakeMove(i - 1, j - 1, i - 2, j - 2));
                checkTakeUp(board, i - 2, j - 2, playerToTake, tree.Left);
            }
        }
    }
    catch { }

    try {
        //Right
        if (playerToTake.includes(board[i - 1][j + 1])) {
            if (board[i - 2][j + 2] === 5 || board[i - 2][j + 2] === 6) {
                tree.Right = new Tree(factoryForTakeMove(i - 1, j + 1, i - 2, j + 2));
                checkTakeUp(board, i - 2, j + 2, playerToTake, tree.Right);
            }
        }
    }
    catch { }

    return tree;
}

function checkKingTake(board, i, j, i2, j2, playerToTake, tree) {
    try {
        //Down left
        if (playerToTake.includes(board[i2 + 1][j2 - 1])) {
            if (board[i2 + 2][j2 - 2] === 5 || board[i2 + 2][j2 - 2] === 6) {
                if (i !== i2 + 2 || j !== j2 - 2) {
                    tree.DownLeft = new KingTree(factoryForTakeMove(i2 + 1, j2 - 1, i2 + 2, j2 - 2));
                    checkKingTake(board, i2, j2, i2 + 2, j2 - 2, playerToTake, tree.DownLeft);
                }
            }
        }
    }
    catch { }

    try {
        //Down Right
        if (playerToTake.includes(board[i2 + 1][j2 + 1])) {
            if (board[i2 + 2][j2 + 2] === 5 || board[i2 + 2][j2 + 2] === 6) {
                if (i !== i2 + 2 || j !== j2 + 2) {
                    tree.DownRight = new KingTree(factoryForTakeMove(i2 + 1, j2 + 1, i2 + 2, j2 + 2));
                    checkKingTake(board, i2, j2, i2 + 2, j2 + 2, playerToTake, tree.DownRight);
                }
            }
        }
    }
    catch { }

    try {
        //Up left
        if (playerToTake.includes(board[i2 - 1][j2 - 1])) {
            if (board[i2 - 2][j2 - 2] === 5 || board[i2 - 2][j2 - 2] === 6) {
                if (i !== i2 - 2 || j !== j2 - 2) {
                    tree.UpLeft = new KingTree(factoryForTakeMove(i2 - 1, j2 - 1, i2 - 2, j2 - 2));
                    checkKingTake(board, i2, j2, i2 - 2, j2 - 2, playerToTake, tree.UpLeft);
                }
            }
        }
    }
    catch { }

    try {
        //Up Right
        if (playerToTake.includes(board[i2 - 1][j2 + 1])) {
            if (board[i2 - 2][j2 + 2] === 5 || board[i2 - 2][j2 + 2] === 6) {
                if (i !== i2 - 2 || j !== j2 + 2) {
                    tree.UpRight = new KingTree(factoryForTakeMove(i2 - 1, j2 + 1, i2 - 2, j2 + 2));
                    checkKingTake(board, i2, j2, i2 - 2, j2 + 2, playerToTake, tree.UpRight);
                }
            }
        }
    }
    catch { }

    return tree;
}

function FindAvailableTakeMoves(board, player) {
    let res = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === 1 && player === 1) {
                let resultTree = checkTakeUp(board, i, j, [2], new Tree({ currentHeight: i, currentWidth: j }));
                if (resultTree.Left != null || resultTree.Right != null) {
                    let treeArray = Tree.treeToArray(resultTree);
                    treeArray.forEach(element => {
                        res.push(element);
                    });
                }
            }
            else if (piece === 2 && player === 2) {
                let resultTree = checkTakeDown(board, i, j, [1], new Tree({ currentHeight: i, currentWidth: j }));
                if (resultTree.Left != null || resultTree.Right != null) {
                    let treeArray = Tree.treeToArray(resultTree);
                    treeArray.forEach(element => {
                        res.push(element);
                    });
                }
            }
            else if (piece === 3 && player === 1) {
                let resultTree = checkKingTake(board, i, j, i, j, [2, 4], new KingTree({ currentHeight: i, currentWidth: j }));
                if (resultTree.DownLeft != null || resultTree.DownRight != null || resultTree.UpLeft != null || resultTree.UpRight != null) {
                    let treeArray = KingTree.kingTreeToArray(resultTree);
                    treeArray.forEach(element => {
                        res.push(element);
                    });
                }
            }
            else if (piece === 4 && player === 2) {
                let resultTree = checkKingTake(board, i, j, i, j, [1, 3], new KingTree({ currentHeight: i, currentWidth: j }));
                if (resultTree.DownLeft != null || resultTree.DownRight != null || resultTree.UpLeft != null || resultTree.UpRight != null) {
                    let treeArray = KingTree.kingTreeToArray(resultTree);
                    treeArray.forEach(element => {
                        res.push(element);
                    });
                }
            }
        }
    }

    return res;
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
    let player1TakeMoves = GetPiecesTaken(FindAvailableTakeMoves(board, 1));
    let player2TakeMoves = GetPiecesTaken(FindAvailableTakeMoves(board, 2));

    // 1 point: If the king can be taken
    // 2 points: If the single piece can be taken
    // 3 points: If the single piece cant be taken
    // 4 points: If king can't be taken
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 1) {
                if (CanPieceBeTaken(player2TakeMoves, i, j)) {
                    player1Counter = player1Counter + 2;
                }
                else {
                    player1Counter = player1Counter + 3;
                }
            }
            else if (board[i][j] === 2) {
                if (CanPieceBeTaken(player1TakeMoves, i, j)) {
                    player2Counter = player2Counter + 2;
                }
                else {
                    player2Counter = player2Counter + 3;
                }
            }
            else if (board[i][j] === 3) {
                if (CanPieceBeTaken(player2TakeMoves, i, j)) {
                    player1Counter = player1Counter + 1;
                }
                else {
                    player1Counter = player1Counter + 4;
                }
            }
            else if (board[i][j] === 4) {
                if (CanPieceBeTaken(player1TakeMoves, i, j)) {
                    player2Counter = player2Counter + 1;
                }
                else {
                    player2Counter = player2Counter + 4;
                }
            }
        }
    }

    return player2Counter - player1Counter;
}

function GetPiecesTaken(takeMoves) {
    let results = [];

    takeMoves.forEach(takeMove => {
        takeMove.slice(1).forEach(take => {
            results.push({
                height: take.takeHeight,
                width: take.takeWidth
            })
        });
    });

    return results;
}

function CanPieceBeTaken(takes, height, width) {
    let result = false;
    takes.forEach(element => {
        if (element.height === height && element.width === width) {
            result = true;
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

