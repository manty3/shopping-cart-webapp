const mongoose = require('mongoose');
require('dotenv').config();
const MongoStore = require('connect-mongo');

const state = {
  db: process.env.MONGODB_URL_LOCAL +"/shopping",
};

// MongoDB connection string from environment variable
const URL = process.env.MONGODB_URL_LOCAL;

if (!URL) {
  console.error('MONGODB_URL_LOCAL environment variable is not set.');
  process.exit(1);
}

console.log("MongoDB URL:", URL);

// Database name
const dbName = 'shopping';

// Function to establish MongoDB connection using mongoose
const connectMongoose = async () => {
  try {
    const connection = await mongoose.createConnection(URL, { useNewUrlParser: true, useUnifiedTopology: true });
    state.db = connection;
    console.log('Database connection established using mongoose');
  } catch (err) {
    console.error('Failed to connect to the database using mongoose. Error:', err);
  }
};

// Function to establish MongoDB connection
const connect = () => {
  connectMongoose();
};

// Function to get the database instance
const get = () => state.db;

// Exporting functions
module.exports = {
  connect,
  get,
};