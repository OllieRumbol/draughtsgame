import { findPlayerMoves, removeDuplicates } from "../logic/playerTips";

test('player tips finding player 1 moves', () => {
    let board = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ];

    let result = findPlayerMoves(board, 1);

    expect(result.length).toEqual(4);
});

test('remove duplicates', () => {
    let moves = [{ height: 4, width: 4 }, { height: 4, width: 4 }, { height: 2, width: 3 }];

    let result = removeDuplicates(moves);

    expect(result.length).toEqual(2);
})