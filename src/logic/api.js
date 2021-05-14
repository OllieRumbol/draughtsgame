export {
    GetAutomatedPlayerNextMove,
    GetPlayerTips
}

async function post(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    return await response.json();
}

async function GetAutomatedPlayerNextMove(version, board, depth) {
    //let url = 'http://localhost:7071/api/GetNextMove'
    let url = 'https://draughtsgamefunction20210321121511.azurewebsites.net/api/GetNextMove';
    let data = { Version: version, Board: board, Depth: depth, Player: 2 }
    const result = await post(url, data)

    if (result.successful) {
        return result.nextMove;
    }
    else {
        throw result.errorMessage;
    }
}

async function GetPlayerTips(board, tipFor) {
    //let url = 'http://localhost:7071/api/GetPotentialMoves';
    let url = 'https://draughtsgamefunction20210321121511.azurewebsites.net/api/GetPotentialMoves';
    let data = { Board: board, TipFor: tipFor };
    const result = await post(url, data);

    if (result.successful) {
        return result.potentialMoves;
    }
    else {
        throw result.errorMessage;
    }
}