// req needs => which square was clicked + which player 
// res needs => new state of the board + next player 
// for each request => check state of the board against winning combos
//function takes in req object (index of the square + player)

const updateBoard = (currentBoard, clickedSquareId, player) => {
  return currentBoard.map((el, i) => i === clickedSquareId ? player : el)
}

const whoSNext = (player) => {
  return player === 'X' ? 'O' : 'X';
}

const updateGame = (currentBoard, clickedSquareId, player) => {
  if (currentBoard[clickedSquareId] === null) {
    const newBoard = updateBoard(currentBoard, clickedSquareId, player);
    const nextPlayer = whoSNext(player);
    return { newBoard, nextPlayer };
  } else {
    return { currentBoard, player};
  }
}

// const updateGameHistory = (newBoard) => {
//   let gameHistory = [];
//   gameHistory.concat(newBoard);
//   return gameHistory;
// }

const winningCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4 ,7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

module.exports = {
  updateGame,
}