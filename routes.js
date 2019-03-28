const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4')

const { updateGame, isSquareClicked } = require('./tictactoe');
const { saveNewGame, findMoveById, findAndUpdateGame } = require('./database');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

let counter = 0;

// /api/game/new
app.post('/api/new-game', async (req, res) => {
  const uuid = uuidv4();
  const response = { 
    board: [null, null, null, null, null, null, null, null, null],
    player: 'X',
    gameId: uuid
  }
  counter = 0;
  await saveNewGame(uuid);
  res.send(response);
});

// /api/game/:gameId/move

app.post('/api/make-move', async (req, res) => {
  const { currentBoard, clickedSquareId, player, gameId } = req.body;
  if (isSquareClicked(currentBoard, clickedSquareId)) {
    res.status(400).send({ error: 'This square has already been clicked!' });
  } else {
    const response = updateGame(currentBoard, clickedSquareId, player);
    const { newBoard, nextPlayer } = response;
    counter += 1;
    response.moveId = counter;
    await findAndUpdateGame({ newBoard, nextPlayer, gameId: gameId, moveId: counter });
    res.send(response);
  };
});

app.get('/api/game/:gameId/move/:moveId', async (req, res) => {
  const { gameId, moveId } = req.params;
  const queriedDoc = await findMoveById(gameId, moveId);
  res.send(queriedDoc);
});

module.exports = {
  app,
}