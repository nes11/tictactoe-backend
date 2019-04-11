const { expect } = require('chai');
const axios = require('axios');
const { findAll } = require('./test.helpers');

describe('/api/game/new', () => {
  it('should save a new Game doc in the db', async () => {
    const dbBefore = await findAll();
    
    const testReq = {
      currentBoard: [null, null, null, null, null, null, null, null, null],
      clickedSquareId: 4,
      player: 'X'
    };

    await axios.post('http://localhost:4000/api/game/:gameId/move', testReq);

    await axios.post('http://localhost:4000/api/game/new');

    const dbAfter = await findAll();

    expect(dbBefore).to.be.an('array')
    expect(dbAfter).to.be.an('array');
    expect(dbAfter.length).to.equal(dbBefore.length + 1);
    expect(dbAfter[dbAfter.length - 1]).to.have.property("game")
  });
});