const express = require('express');
const bodyParser = require('body-parser');

const { updateGame, isSquareClicked } = require('./tictactoe')

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/api', (req, res) => {
  const { currentBoard, clickedSquareId, player } = req.body;
  if (isSquareClicked(currentBoard, clickedSquareId)) {
    res.status(400).send({ error: 'This square has already been clicked!' });
  } else {
    const response = updateGame(currentBoard, clickedSquareId, player);
    res.send(response);
  }
})

module.exports = {
  app,
}