
const  MongoClient  = require('mongodb').MongoClient;
const mongoose = require('mongoose')
const state = {
  db: null,
};

// MongoDB connection string
// const url = 'mongodb://127.0.0.1:27017';
// const url= 'mongodb+srv://akshaymadathil3:nEETfuGZ1xmLcsxt@webapp.x9sdfh3.mongodb.net/'

const mongoURL = process.env.MONGODB_URL;


// Database name
const dbName = 'shopping';




let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to the database. Error:', err);
        process.exit(1);
    }
    db = client.db(dbName);
    console.log('Database connection established');
});








// Create a new MongoDB client object
const client = new MongoClient(url);

// Function to establish MongoDB connection
const connect = async (cb) => {
  try {
    // Connecting to MongoDB
    await client.connect();
    // Setting up database name to the connected client
    const db = client.db(dbName);
    // Setting up database name to the state
    state.db = db;
    // Callback after connected
    return cb();
  } catch (err) {
    // Callback when an error occurs
    return cb(err);
  }

};


// Function to get the database instance
const get = () => state.db;

// Exporting functions
module.exports = {
  connect,
  get,


  
};
