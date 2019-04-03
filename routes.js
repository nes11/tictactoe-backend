const express = require('express');
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4')

const { updateGame, checkSquareIsAvailable } = require('./tictactoe');
const { saveNewGame, findMoveById, findAndUpdateGame } = require('./database');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

let counter = 0;

app.post('/api/game/new', async (req, res) => {
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

app.post('/api/game/:gameId/move', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const { currentBoard, clickedSquareId, player } = req.body;

    checkSquareIsAvailable(currentBoard, clickedSquareId);

    const response = updateGame(currentBoard, clickedSquareId, player);
    const { newBoard, nextPlayer } = response;
    counter += 1;
    response.moveId = counter;
    await findAndUpdateGame({ newBoard, nextPlayer, gameId: gameId, moveId: counter });
    res.send(response);
  } catch (error) {
    console.error('err', error.message); 
    res.status(400).send({ error: error.message });
  }
});

app.get('/api/game/:gameId/move/:moveId', async (req, res) => {
  const { gameId, moveId } = req.params;
  const queriedDoc = await findMoveById(gameId, moveId);
  res.send(queriedDoc);
});

module.exports = {
  app,
}