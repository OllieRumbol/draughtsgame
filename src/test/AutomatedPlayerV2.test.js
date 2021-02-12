import { evaluate } from '../logic/automatedPlayerV2'

test("Check evaluate", () => {
    let board = [
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ];

    let result = evaluate(board);

    expect(result).toEqual(0);
});