const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const buildAtlasOptions = () => ({
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
  family: 4,
  tls: true,
  tlsAllowInvalidCertificates: true,
  authMechanism: 'SCRAM-SHA-256',
  dbName: process.env.DB_NAME || 'alumnihub'
});

const connectWithUri = async (uri) => {
  await mongoose.connect(uri.trim(), buildAtlasOptions());
  return uri.trim();
};

const connectInMemory = async () => {
  mongoServer = await MongoMemoryServer.create();
  const memoryUri = mongoServer.getUri();
  await mongoose.connect(memoryUri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    connectTimeoutMS: 10000
  });
  console.log('DB connected successfully using in-memory MongoDB.');
};

const conn = async () => {
  const uri = (process.env.MONGO_URI || process.env.MONGODB_URI || '').trim();

  if (!uri) {
    console.error('MONGO_URI is not set. Please configure Backend/.env.');
    process.exit(1);
  }

  try {
    const connectionUri = await connectWithUri(uri);
    console.log('DB connected successfully using MONGO_URI.');
    console.log(`MongoDB endpoint: ${connectionUri.replace(/:[^:@]+@/, ':***@')}`);
    return connectionUri;
  } catch (error) {
    console.error('Atlas connection failed:', error.message);
    console.warn('Falling back to local in-memory MongoDB so the app remains available for local development.');
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