const  MongoClient  = require('mongodb').MongoClient;

const state = {
  db: null,
};

// MongoDB connection string
const url = "mongodb+srv://akshaymadathil3:<Pq9UMD7JKiwEwVTq>@cluster0.8otn68e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
