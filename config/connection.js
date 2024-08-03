require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  tls: true,          // Use TLS (SSL) connection
  tlsAllowInvalidCertificates: true // Disable certificate validation (for development only)
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
