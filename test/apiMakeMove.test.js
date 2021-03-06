const { expect } = require('chai');
const axios = require('axios');
const { findAll, findOneGame } = require('./test.helpers');

describe('/api/game/:gameId/move', () => {
  it('returns the correct newBoard array', async () => {
    const testReqBody = {
      "currentBoard": [null, null, null, null, null, null, null, null, null], 
      "clickedSquareId": 2, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api/game/:gameId/move', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data.newBoard).to.deep.equal([null, null, "O", null, null, null, null, null, null]);
  });

  it("correctly alternates players", async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'X', null, null, null, null, null], 
      "clickedSquareId": 1, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api/game/:gameId/move', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'nextPlayer', 'moveId');
    expect(res.data.newBoard).to.deep.equal(['O', 'O', null, 'X', null, null, null, null, null]);
    expect(res.data.nextPlayer).to.equal('X');
  });
  
  it('declares the winner accurately', async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'O', null, null, null, null, null], 
      "clickedSquareId": 6, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api/game/:gameId/move', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'result', 'moveId');
    expect(res.data).to.not.have.key('nextPlayer')
    expect(res.data.newBoard).to.deep.equal(["O", null, null, "O", null, null, "O", null, null]);
    expect(res.data.result).to.equal('O wins the game!');
  });

  it('sends back the currentBoard and current player if the clickedSquare isn\'t null', async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'O', null, null, null, null, null], 
      "clickedSquareId": 0, 
      "player": "X" 
    };
    const res = await axios.post('http://localhost:4000/api/game/:gameId/move', testReqBody, { validateStatus: false });
    expect(res.status).to.equal(400);
    expect(res.data).to.be.an('object');
    expect(res.data).to.include({ error: 'This square is not available. Please choose an empty square.' })
  });

  it('should not update the game if the request is invalid', async () => {
    const res = await axios.post('http://localhost:4000/api/game/new');
    const gameId = res.data.gameId;

    const testReq1 = {
      currentBoard: [null, null, null, null, null, null, null, null, null],
      clickedSquareId: 4,
      player: 'X'
    };
    const testReq2 = {
      currentBoard: [null, null, null, null, 'X', null, null, null, null],
      clickedSquareId: 4,
      player: 'X'
    };

    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq1);
    const docBefore = await findOneGame(gameId);

    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq2, { validateStatus: false });
    const docAfter = await findOneGame(gameId);

    expect(docBefore.moves.length).to.equal(1);
    expect(docAfter.moves.length).to.equal(1);
    expect(docBefore).to.deep.equal(docAfter);
  });

  it('should had one element to the moves property', async () => {
    const res = await axios.post('http://localhost:4000/api/game/new');
    const gameId = res.data.gameId;

    const testReq1 = {
      currentBoard: [null, null, null, null, null, null, null, null, null],
      clickedSquareId: 4,
      player: 'X'
    };
    const testReq2 = {
      currentBoard: [null, null, null, null, 'X', null, null, null, null],
      clickedSquareId: 0,
      player: 'O'
    };
    const testReq3 = {
      currentBoard: ['O', null, null, null, 'X', null, null, null, null],
      clickedSquareId: 3,
      player: 'X'
    };

    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq1);
    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq2);

    const docBefore = await findOneGame(gameId);
    const numberOfMovesBefore = docBefore.moves.length;

    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq3);

    const docAfter = await findOneGame(gameId);
    const numberOfMovesAfter = docAfter.moves.length;

    expect(numberOfMovesAfter).to.equal(numberOfMovesBefore + 1);
  });
});