const { expect } = require('chai');
const axios = require('axios');
const { findAll } = require('./test.helpers');

describe('/api/make-move', () => {
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
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody);
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
    const res = await axios.post('http://localhost:4000/api/make-move', testReqBody, { validateStatus: false });
    expect(res.status).to.equal(400);
    expect(res.data).to.be.an('object');
    expect(res.data).to.include({ error: 'This square has already been clicked!' })
  });

  it('should have the same documents before&after an invalid request', async () => {
    await axios.post('http://localhost:4000/api/new-game');

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

    await axios.post('http://localhost:4000/api/make-move', testReq1);
    const before = await findAll();

    await axios.post('http://localhost:4000/api/make-move', testReq2, { validateStatus: false });
    const after = await findAll();

    expect(before.length).to.equal(1);
    expect(after.length).to.equal(1);
    expect(before).to.deep.equal(after);
  });

  it('should have one more document after a valid request', async () => {
    await axios.post('http://localhost:4000/api/new-game');

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

    await axios.post('http://localhost:4000/api/make-move', testReq1);
    await axios.post('http://localhost:4000/api/make-move', testReq2);

    const dbBefore = await findAll();
    const numberOfDocsBefore = dbBefore.length;

    await axios.post('http://localhost:4000/api/make-move', testReq3);

    const dbAfter = await findAll();
    const numberOfDocsAfter = dbAfter.length;

    expect(numberOfDocsAfter).to.equal(numberOfDocsBefore + 1);
  });
});