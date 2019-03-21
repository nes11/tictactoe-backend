const { expect } = require('chai');
const axios = require('axios');
const { findAll } = require('./test.helpers');

describe('/api/new-game', () => {
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
  });
});