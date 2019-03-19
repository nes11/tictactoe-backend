const { MongoClient } = require('mongodb');
const localUrl = 'mongodb://localhost:27017';

const dbName = 'tictactoe';
const gameHistory = 'tictactoe-game-history';

const getConnection = async () => {
  return MongoClient.connect(localUrl, { useNewUrlParser: true });
};

const saveNewBoard = async ({ newBoard, moveId }) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .insertOne({ newBoard, moveId });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
};

const deleteAll = async () => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .deleteMany({ });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
};

const findMoveById = async (id) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .findOne({ moveId: { $eq: id } });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
}

module.exports = {
  saveNewBoard,
  deleteAll,
  findMoveById
};