const { expect } = require('chai');
const axios = require('axios');

describe('/api/game/:gameId/move/:moveId', () => {
  it('should have documents where (# of array elements != null) === move#', async () => {
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
    const { data: gameAfter2ndMove } = await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq2);
    
    await axios.post(`http://localhost:4000/api/game/${gameId}/move`, testReq3);
    const { data: historyAtMove2 } = await axios.get(`http://localhost:4000/api/game/${gameId}/move/${moveId}`);

    expect(historyAtMove2.nextPlayer).to.equal(gameAfter2ndMove.nextPlayer)
    expect(historyAtMove2.newBoard).to.deep.equal(gameAfter2ndMove.newBoard)
  });
});
