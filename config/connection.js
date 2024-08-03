require('dotenv').config();
const { MongoClient } = require('mongodb')

const uri = 'mongodb+srv://akshaymadathil3:Pq9UMD7JKiwEwVTq@cluster0.8otn68e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
