const { expect } = require('chai');
const axios = require('axios');

describe('tictactoe', () => {
  it('returns the correct newBoard array', async () => {
    const testReqBody = {
      "currentBoard": [null, null, null, null, null, null, null, null, null], 
      "clickedSquareId": 2, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody);
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
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'nextPlayer');
    expect(res.data.newBoard).to.deep.equal(['O', 'O', null, 'X', null, null, null, null, null]);
    expect(res.data.nextPlayer).to.equal('X');
  });
  
  it('declares the winner accurately', async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'O', null, null, null, null, null], 
      "clickedSquareId": 6, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'result');
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
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody, { validateStatus: false });
    expect(res.status).to.equal(400);
    expect(res.data).to.be.an('object');
    expect(res.data).to.include({ error: 'This square has already been clicked!' })
  });
  
});
