const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
require('dotenv').config();
const MongoStore = require('connect-mongo');

const state = {
  db: process.env.MONGODB_URL_LOCAL + "/shopping",
};

// MongoDB connection string from environment variable
const URL = process.env.MONGODB_URL_LOCAL;

if (!URL,{ useNewUrlParser: true, useUnifiedTopology: true}) {
  console.error('MONGODB_URL_LOCAL environment variable is not set.');
  process.exit(1);
}

console.log("MongoDB URL:", URL);

// Database name
const dbName = 'shopping';

// Function to establish MongoDB connection using MongoClient
const connectMongoClient = (cb) => {
  MongoClient.connect(URL, (err, client) => {
    if (err) {
      console.error('Failed to connect to the database. Error:', err);
      return cb(err);
    }
    state.db = client.db(dbName);
    console.log('Database connection established using MongoClient');
    cb();
  });
};

// Function to establish MongoDB connection using mongoose
const connectMongoose = async (cb) => {
  try {
    await mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    state.db = mongoose.connection;
    console.log('Database connection established using mongoose');
    cb();
  } catch (err) {
    console.error('Failed to connect to the database using mongoose. Error:', err);
    cb(err);
  }
};

// Function to establish MongoDB connection
const connect = (cb) => {
  // Choose one of the connection methods: MongoClient or mongoose
  // Uncomment the desired method and comment out the other

  // connectMongoClient(cb);
  connectMongoose(cb);
};

// Function to get the database instance
const get = () => state.db;

// Exporting functions
module.exports = {
  connect,
  get,
};
