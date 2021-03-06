import { FindAvailableMoves } from './helpers/findMove';

export { findPlayerMoves, removeDuplicates, filterMoves }

function findPlayerMoves(board, tipFor) {
    let moves = FindAvailableMoves(board, tipFor);
    let filteredMoves = filterMoves(moves);
    return removeDuplicates(filteredMoves);
}

function filterMoves(moves) {
    let result = [];

    moves.forEach(move => {
        result.push({
            height: move.nextHeight,
            width: move.nextWidth
        });
    });

    return result;
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

//DEBUG
// const board = [
//     [0, 2, 0, 2, 0, 2, 0, 2],
//     [2, 0, 2, 0, 2, 0, 2, 0],
//     [0, 2, 0, 2, 0, 2, 0, 2],
//     [5, 0, 5, 0, 5, 0, 5, 0],
//     [0, 5, 0, 5, 0, 5, 0, 5],
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