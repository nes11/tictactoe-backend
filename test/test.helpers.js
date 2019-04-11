const { MongoClient } = require('mongodb');
const localUrl = 'mongodb://localhost:27017';

const dbName = 'tictactoe';
const gameHistory = 'tictactoe-game-history';

const getConnection = async () => {
  return MongoClient.connect(localUrl, { useNewUrlParser: true });
};

const findAll = async () => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .find({ }).toArray();
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
};

const findOneGame = async (gameId) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .findOne({ game : gameId });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
};

module.exports = {
  findAll,
  findOneGame,
}