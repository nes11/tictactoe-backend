const express = require('express');
const bodyParser = require('body-parser');

const { updateGame } = require('./tictactoe')

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/api', (req, res) => {
  const { currentBoard, clickedSquareId, player } = req.body;
  const response = updateGame(currentBoard, clickedSquareId, player);
  res.send(response);
})

module.exports = {
  app,
}