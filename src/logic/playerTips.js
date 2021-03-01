export { findPlayerMoves, removeDuplicates }

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
        //Check left side
        if (board[i - 1][j - 1] === 5 || board[i - 1][j - 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveUpRight(board, i, j) {
    try {
        //Check right side
        if (board[i - 1][j + 1] === 5 || board[i - 1][j + 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveDownLeft(board, i, j) {
    try {
        //Check left side
        if (board[i + 1][j - 1] === 5 || board[i + 1][j - 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function checkMoveDownRight(board, i, j) {
    try {
        //Check right side
        if (board[i + 1][j + 1] === 5 || board[i + 1][j + 1] === 6) {
            return true;
        }

        return false;
    }
    catch { return false; }
}

function factoryForMove(height, width) {
    return {
        height: height,
        width: width
    };
}

function checkTakeUp(board, i, j, playerToTake, tree) {
    try {
        //left
        if (playerToTake.includes(board[i - 1][j - 1])) {
            if (board[i - 2][j - 2] === 5 || board[i - 2][j - 2] === 6) {
                tree.Left = new Tree(factoryForMove(i - 2, j - 2));
                checkTakeUp(board, i - 2, j - 2, playerToTake, tree.Left);
            }
        }
    }
    catch { }

    try {
        //Right
        if (playerToTake.includes(board[i - 1][j + 1])) {
            if (board[i - 2][j + 2] === 5 || board[i - 2][j + 2] === 6) {
                tree.Right = new Tree(factoryForMove(i - 2, j + 2));
                checkTakeUp(board, i - 2, j + 2, playerToTake, tree.Right);
            }
        }
    }
    catch { }

    return tree;
}

function checkTakeDown(board, i, j, playerToTake, tree) {
    try {
        //left
        if (playerToTake.includes(board[i + 1][j - 1])) {
            if (board[i + 2][j - 2] === 5 || board[i + 2][j - 2] === 6) {
                tree.Left = new Tree(factoryForMove(i + 2, j - 2));
                checkTakeDown(board, i + 2, j - 2, playerToTake, tree.Left);
            }
        }
    }
    catch { }

    try {
        //Right
        if (playerToTake.includes(board[i + 1][j + 1])) {
            if (board[i + 2][j + 2] === 5 || board[i + 2][j + 2] === 6) {
                tree.Right = new Tree(factoryForMove(i + 2, j + 2));
                checkTakeDown(board, i + 2, j + 2, playerToTake, tree.Right);
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
                    tree.DownLeft = new KingTree(factoryForMove(i2 + 2, j2 - 2));
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
                    tree.DownRight = new KingTree(factoryForMove(i2 + 2, j2 + 2));
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
                    tree.UpLeft = new KingTree(factoryForMove(i2 - 2, j2 - 2));
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
                    tree.UpRight = new KingTree(factoryForMove(i2 - 2, j2 + 2));
                    checkKingTake(board, i2, j2, i2 - 2, j2 + 2, playerToTake, tree.UpRight);
                }
            }
        }
    }
    catch { }

    return tree;
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

function flattenTakeMoves(treeArray) {
    let result = [];

    treeArray.forEach(takeMoves => {
        takeMoves.slice(1).forEach(takeMove => {
            result.push(takeMove);
        });
    });

    return result;
}

function findPlayerMoves(board, tipFor) {
    let result = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j]
            if (piece === tipFor) {
                if (piece === 1) {
                    if (checkMoveUpLeft(board, i, j)) {
                        result.push(factoryForMove(i - 1, j - 1));
                    }
                    if (checkMoveUpRight(board, i, j)) {
                        result.push(factoryForMove(i - 1, j + 1));
                    }
                    let resultTree = checkTakeUp(board, i, j, [2], new Tree(factoryForMove(i, j)));
                    if (resultTree.Left != null || resultTree.Right != null) {
                        let treeArray = Tree.treeToArray(resultTree);
                        let takeMoves = flattenTakeMoves(treeArray);
                        result = result.concat(takeMoves);
                    }
                }
                else if (piece === 2) {
                    if (checkMoveDownLeft(board, i, j)) {
                        result.push(factoryForMove(i + 1, j - 1));
                    }
                    if (checkMoveDownRight(board, i, j)) {
                        result.push(factoryForMove(i + 1, j + 1));
                    }
                    let resultTree = checkTakeDown(board, i, j, [1], new Tree(factoryForMove(i, j)));
                    if (resultTree.Left != null || resultTree.Right != null) {
                        let treeArray = Tree.treeToArray(resultTree);
                        let takeMoves = flattenTakeMoves(treeArray);
                        result = result.concat(takeMoves);
                    }
                }
                else if (piece === 3 || piece === 4) {
                    if (checkMoveUpLeft(board, i, j)) {
                        result.push(factoryForMove(i - 1, j - 1));
                    }
                    if (checkMoveUpRight(board, i, j)) {
                        result.push(factoryForMove(i - 1, j + 1));
                    }
                    if (checkMoveDownLeft(board, i, j)) {
                        result.push(factoryForMove(i + 1, j - 1));
                    }
                    if (checkMoveDownRight(board, i, j)) {
                        result.push(factoryForMove(i + 1, j + 1));
                    }

                    let resultTree;
                    if (piece === 4) {
                        resultTree = checkKingTake(board, i, j, i, j, [1, 3], new KingTree(factoryForMove(i, j)));
                    }
                    else {
                        resultTree = checkKingTake(board, i, j, i, j, [2, 4], new KingTree(factoryForMove(i, j)));
                    }

                    if (resultTree.DownLeft != null || resultTree.DownRight != null || resultTree.UpLeft != null || resultTree.UpRight != null) {
                        let treeArray = KingTree.kingTreeToArray(resultTree);
                        let takeMoves = flattenTakeMoves(treeArray);
                        result = result.concat(takeMoves);
                    }
                }
            }
        }
    }

    return removeDuplicates(result);
}

//DEBUG
// const board = [
//     [0, 2, 0, 2, 0, 2, 0, 2],
//     [2, 0, 2, 0, 2, 0, 2, 0],
//     [0, 2, 0, 2, 0, 2, 0, 2],
//     [5, 0, 5, 0, 5, 0, 5, 0],
//     [0, 2, 0, 5, 0, 5, 0, 5],
//     [1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0],
// ];

// let res = findPlayerMoves(board, 1);
// console.log(res);

// let res2 = findPlayerMoves(board, 2);
// console.log(res2);

// let res3 = findPlayerMoves(board, 3);
// console.log(res3);

// let res4 = findPlayerMoves(board, 4);
// console.log(res4);