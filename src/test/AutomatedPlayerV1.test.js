import { pickMoveForPlayer2 } from '../logic/automatedPlayerV1'

test("Check move left function", () => {
    let board = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [5, 0, 5, 0, 5, 0, 5, 0],
        [0, 5, 0, 5, 0, 5, 0, 5],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ];;

    let result = pickMoveForPlayer2(board);

    expect(result.takes).toEqual([]);
});