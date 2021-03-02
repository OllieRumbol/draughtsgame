import Tree from "./tree";
import KingTree from './kingTree';
import {
    checkMoveUpLeft,
    checkMoveUpRight,
    checkMoveDownLeft,
    checkMoveDownRight,
    checkTakeDown,
    checkTakeUp,
    checkKingTake
} from './checkMove';

export{
    FindAvailableMoves,
    FindAvailableTakeMoves
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