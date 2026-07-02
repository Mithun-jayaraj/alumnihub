const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectWithUri = async (uri) => {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    family: 4,
    dbName: process.env.DB_NAME || 'test'
  });
};

const connectInMemory = async () => {
  mongoServer = await MongoMemoryServer.create();
  const memoryUri = mongoServer.getUri();
  await mongoose.connect(memoryUri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000
  });
  console.log('DB connected successfully using in-memory MongoDB!');
};

const conn = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (uri) {
    try {
      await connectWithUri(uri);
      console.log('DB connected successfully using MONGO_URI!');
      return;
    } catch (error) {
      console.error('DB connection error with MONGO_URI:', error.message);
      console.error('Falling back to in-memory MongoDB.');
    }
  }

  try {
    await connectInMemory();
  } catch (error) {
    console.error('In-memory MongoDB connection error:', error.message);
    process.exit(1);
  }
};

conn();
module.exports = { conn, mongoServer };