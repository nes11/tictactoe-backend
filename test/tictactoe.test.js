const { expect } = require('chai');
const axios = require('axios');

describe('tictactoe', () => {
  it('returns the correct newBoard array', async () => {
    const testReqBody = {
      "currentBoard": [null, null, null, null, null, null, null, null, null], 
      "clickedSquareId": 2, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data.newBoard[2]).to.be.equal('O');
  });

  it("correctly alternates players", async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'X', null, null, null, null, null], 
      "clickedSquareId": 1, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'nextPlayer');
    expect(res.data.newBoard[1]).to.be.equal('O');
    expect(res.data.nextPlayer).to.be.equal('X');
  })
  
  it('declares the winner accurately', async () => {
    const testReqBody = {
      "currentBoard": ['O', null, null, 'O', null, null, null, null, null], 
      "clickedSquareId": 6, 
      "player": "O" 
    };
    const res = await axios.post('http://localhost:4000/api', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');
    expect(res.data).to.have.all.keys('newBoard', 'result');
    expect(res.data.newBoard).to.be.deep.equal(["O", null, null, "O", null, null, "O", null, null]);
    expect(res.data.result).to.be.equal('O wins the game!');

  })
});



