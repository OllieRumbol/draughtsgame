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

export {
    FindAvailableMoves
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
                let resultTree = checkTakeUp(board, i, j, [2], new Tree({ currentHeight: i, currentWidth: j }));
                if (resultTree.Left != null || resultTree.Right != null) {
                    let treeArray = Tree.treeToArray(resultTree);
                    results = results.concat(ProcessTreeArray(treeArray));
                }
            }
            else if (piece === 2 && player === 2) {
                if (checkMoveDownLeft(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j - 1));
                }
                if (checkMoveDownRight(board, i, j)) {
                    results.push(factoryForMove(i, j, i + 1, j + 1));
                }
                let resultTree = checkTakeDown(board, i, j, [1], new Tree({ currentHeight: i, currentWidth: j }));
                if (resultTree.Left != null || resultTree.Right != null) {
                    let treeArray = Tree.treeToArray(resultTree);
                    results = results.concat(ProcessTreeArray(treeArray));
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

                let countersToTake = piece === 3 ? [2, 4] : [1, 3];
                let resultTree = checkKingTake(board, i, j, i, j, countersToTake, new KingTree({ currentHeight: i, currentWidth: j }));
                if (resultTree.DownLeft != null || resultTree.DownRight != null || resultTree.UpLeft != null || resultTree.UpRight != null) {
                    let treeArray = KingTree.kingTreeToArray(resultTree);
                    results = results.concat(ProcessTreeArray(treeArray));
                }
            }
        }
    }

    return results;
}

function ProcessTreeArray(treeArray) {
    let takeMoves = []
    treeArray.forEach(element => {
        takeMoves = takeMoves.concat(ProcessTakeMove(element));
    });

    return takeMoves
}

function ProcessTakeMove(takeMoves) {
    let results = [];

    let takes = [];
    takeMoves.slice(1).forEach(take => {
        takes.push({
            height: take.takeHeight,
            width: take.takeWidth
        });

        results.push({
            currentHeight: takeMoves[0].currentHeight,
            currentWidth: takeMoves[0].currentWidth,
            nextHeight: take.nextHeight,
            nextWidth: take.nextWidth,
            takes: takes.slice(0)
        });
    });

    return results;
}