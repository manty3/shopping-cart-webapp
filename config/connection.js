require('dotenv').config();
const { MongoClient } = require('mongodb')

const uri = "mongodb+srv://akshaymadathil3:hLpWaXcKvr7gSwfi@dbtest.9y1822z.mongodb.net/?retryWrites=true&w=majority&appName=dbtest"
console.log('MongoDB URI:', uri);
if (!uri) {
  throw new Error('MongoDB connection string is not defined');
}
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,replicaSet: 'rs0',
  readPreference: 'primary'});
client.connect(err => {
  if (err) {
      console.error('Failed to connect to MongoDB:', err);
  } else {
      console.log('Connected to MongoDB');
  }
});
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const database = client.db('myDatabase');
    return database;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

module.exports = { connectToDatabase, client };
