const { expect } = require('chai');
const axios = require('axios');

const testReqBody = {
	"currentBoard": [null, null, null, null, "X", "O", null, null, null], 
	"clickedSquareId": 2, 
	"player": "O" 
};

describe('tictactoe', () => {
  it('should give the right response', async () => {
    const res = await axios.post('http://localhost:4000/api', testReqBody);
    expect(res.status).to.equal(200);
    expect(res.data).to.be.an('object');

  }); 
});
