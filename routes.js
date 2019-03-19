const express = require('express');
const bodyParser = require('body-parser');

const { updateGame, isSquareClicked } = require('./tictactoe');
const { deleteAll, saveNewBoard, findMoveById } = require('./database');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

let counter = 0;

app.post('/api/make-move', async (req, res) => {
  const { currentBoard, clickedSquareId, player } = req.body;
  if (isSquareClicked(currentBoard, clickedSquareId)) {
    res.status(400).send({ error: 'This square has already been clicked!' });
  } else {
    const response = updateGame(currentBoard, clickedSquareId, player);
    const { newBoard } = response;
    counter += 1;
    await saveNewBoard({ newBoard, moveId: counter })
    res.send(response);
  };
});

app.post('/api/new-game', async (req, res) => {
  const response = { 
    board: [null, null, null, null, null, null, null, null, null],
    player: 'X'
  }
  await deleteAll();
  res.send(response);
});


module.exports = {
  app,
}