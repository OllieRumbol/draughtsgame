export{
    evaluate
}

function evaluate(board) {
    let player1Counter = 0;
    let player2Counter = 0;

    for (let i = 0; i < board.length; i++) {
        for (let y = 0; i < board.length[i]; y++) {
            if (board[i][j] === 1) {
                player1Counter++;
            }
            else if (board[i][j] === 2) {
                player2Counter++;
            }
            else if (board[i][j] === 3) {
                player1Counter+=2;
            }
            else if (board[i][j] === 4) {
                player2Counter+=2;
            }
        }
    }

    return player2Counter - player1Counter;
}