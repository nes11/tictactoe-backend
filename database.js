const { MongoClient } = require('mongodb');
const localUrl = 'mongodb://localhost:27017';

const dbName = 'tictactoe';
const gameHistory = 'tictactoe-game-history';

const getConnection = async () => {
  return MongoClient.connect(localUrl, { useNewUrlParser: true });
};

const saveNewGame = async (uuid) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .insertOne({ game: uuid });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
};

// const saveNewMove = async ({ newBoard, moveId, nextPlayer }) => {
//   try {
//     const client = await getConnection();
//     const res = await client
//       .db(dbName)
//       .collection(gameHistory)
//       .insertOne({ newBoard, moveId, nextPlayer });
//     client.close();
//     return res;
//   } catch(err) {
//     console.log('error', err);
//   }
// };

// const deleteAll = async () => {
//   try {
//     const client = await getConnection();
//     const res = await client
//       .db(dbName)
//       .collection(gameHistory)
//       .deleteMany({ });
//     client.close();
//     return res;
//   } catch(err) {
//     console.log('error', err);
//   }
// };

const findandUpdateGame = async ({ newBoard, moveId, nextPlayer, gameId }) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .findOneAndUpdate(
        { game: gameId }, 
        { '$push': { "moves": { newBoard, nextPlayer, moveId } }}
      );
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
}

const findMoveById = async (id) => {
  try {
    const client = await getConnection();
    const res = await client
      .db(dbName)
      .collection(gameHistory)
      .findOne({ moveId: id });
    client.close();
    return res;
  } catch(err) {
    console.log('error', err);
  }
}

module.exports = {
  saveNewGame,
  findandUpdateGame,
  findMoveById
};