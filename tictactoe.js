const checkSquareIsAvailable = (currentBoard, clickedSquareId) => {
  if (currentBoard[clickedSquareId] === ' ') {
    throw Error('Please go back to latest move to resume playing.')
  } else if (currentBoard[clickedSquareId] === 'X' || currentBoard[clickedSquareId] === 'O') 
    throw Error('This square is not available. Please choose an empty square.')
}; // implement try/catch here

const updateBoard = (currentBoard, clickedSquareId, player) => {
  return currentBoard.map((el, i) => i === clickedSquareId ? player : el)
}

const whoSNext = (player) => {
  return player === 'X' ? 'O' : 'X';
}

const isWinner = (newBoard) => {
  const winningSquareCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  return winningSquareCombos.some(combo => {
    const [a, b, c] = combo;
    return newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c];
  });
};

const updateGame = (currentBoard, clickedSquareId, player) => {
  const newBoard = updateBoard(currentBoard, clickedSquareId, player);
  const nextPlayer = whoSNext(player);
  return isWinner(newBoard)
    ? { newBoard, result: `${player} wins the game!` }
    : { newBoard, nextPlayer };
};

module.exports = {
  updateGame,
  checkSquareIsAvailable,
}