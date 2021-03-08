import { evaluate, minimax } from '../logic/automatedPlayerV2'

test("Check evaluate", () => {
    let board = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ];

    let result = evaluate(board);

    expect(result).toEqual(0);
});