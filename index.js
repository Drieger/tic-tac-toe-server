// Board of game must be indicated in a single sequence of 9 numbers
// Players are represented with number 1 and 2
// Empty cells are represented with number 0

const http = require('http');
const url  = require('url');
const querystring = require('querystring');

isWinner = function(board, player) {
    // Win conditions
    // [0] == [1] == [2] == player
    // [3] == [4] == [5] == player
    // [6] == [7] == [8] == player
    // [0] == [3] == [6] == player
    // [1] == [4] == [7] == player
    // [2] == [5] == [8] == player
    // [0] == [4] == [8] == player
    // [2] == [4] == [6] == player
    if (board[0] == player && board[1] == board[0] && board[2] == board[0])
        return true;
    if (board[3] == player && board[4] == board[3] && board[5] == board[3])
        return true;
    if (board[6] == player && board[7] == board[6] && board[8] == board[6])
        return true;
    if (board[0] == player && board[3] == board[0] && board[6] == board[0])
        return true;
    if (board[1] == player && board[4] == board[1] && board[7] == board[1])
        return true;
    if (board[2] == player && board[5] == board[2] && board[8] == board[2])
        return true;
    if (board[0] == player && board[4] == board[0] && board[8] == board[0])
        return true;
    if (board[2] == player && board[4] == board[2] && board[6] == board[2])
        return true;
    return false;
}

gameScore = function(board, player) {
    let other = player == '1' ? '2' : '1';
    if (isWinner(board, player))
        return 10;
    if (isWinner(board, other))
        return -10;
    return 0;
}

availablePlays = function(board, player) {
    let plays = [];

    // Generate all possible plays
    for (let i in board) {
        if (board[i] == '0') {
            let copy = board.slice();
            copy[i] = player;
            plays.push(copy);
        }
    }
    return plays;
}

http.createServer((request, response) => {

    let query  = url.parse(request.url).query;
    let board  = querystring.parse(query).board;
    let player = querystring.parse(query).player;

    // Handle wrong requests
    if (!board || !player) {
      response.writeHead(400, {'Content-Type': 'application/json'});
      response.write(JSON.stringify({error: 'Missing fields, you must provide a board and player params'}));
      response.end()
    }
    // Handle correct requests
    else {
      board = board.split('');
      response.writeHead(200, {'Content-Type': 'application/json'})
      response.write(JSON.stringify({board: board, player: player, plays: availablePlays(board, player)}));
      response.end();
    }

}).listen(3030);
