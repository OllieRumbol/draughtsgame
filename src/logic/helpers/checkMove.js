import Tree from "./tree";
import KingTree from './kingTree';

export {
    checkMoveUpLeft,
    checkMoveUpRight,
    checkMoveDownLeft,
    checkMoveDownRight,
    checkTakeDown,
    checkTakeUp,
    checkKingTake,
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