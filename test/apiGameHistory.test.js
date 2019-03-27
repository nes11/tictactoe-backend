const { expect } = require('chai');
const axios = require('axios');

describe('/api/game-history', () => {
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
    const { data: gameAfter2ndMove } = await axios.post('http://localhost:4000/api/make-move', testReq2);
    await axios.post('http://localhost:4000/api/make-move', testReq3);

    const { data: historyAtMove2 } = await axios.get('http://localhost:4000/api/game-history/2');

    expect(historyAtMove2.nextPlayer).to.equal(gameAfter2ndMove.nextPlayer)
    expect(historyAtMove2.newBoard).to.deep.equal(gameAfter2ndMove.newBoard)
  });
});
