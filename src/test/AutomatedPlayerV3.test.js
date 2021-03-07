import {
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

    from '../logic/automatedPlayerV3';

test('evaluate method', () => {
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

    let result = evaluate(board);

    expect(result).toEqual(0);
})