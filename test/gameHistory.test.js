const { expect } = require('chai');
const axios = require('axios');
const { deleteAll } = require('../database');
const { findAll } = require('./test.helpers');

describe('Game History Storage', () => {
  it('should be empty at the start of a new game', async () => {
    const testReq = {
      currentBoard: [null, null, null, null, null, null, null, null, null], 
      clickedSquareId: 4, 
      player: 'X'
    };
    await axios.post('http://localhost:4000/api/make-move', testReq);

    await axios.post('http://localhost:4000/api/new-game');

    const res = await findAll();
    expect(res).to.be.an('array');
    expect(res.length).to.equal(0);
  })

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
  })

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
  })

  it('should have documents where (# of array elements != null) === move#', async () => {
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
    await axios.post('http://localhost:4000/api/make-move', testReq3);

    const thirdInGameHistory = await axios.post('http://localhost:4000/api/game-history', { moveId: 3 });
    const elNotNull = thirdInGameHistory.data.newBoard.filter(el => el !== null);

    expect(elNotNull.length).to.equal(thirdInGameHistory.data.moveId)
  })

  it('should respond with a specific document when provided with a move #', async () => {
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
    await axios.post('http://localhost:4000/api/make-move', testReq3);

    const queriedDoc = await axios.post('http://localhost:4000/api/game-history', { moveId: 3 });

    expect(queriedDoc.data.moveId).to.equal(3);
  })
});
