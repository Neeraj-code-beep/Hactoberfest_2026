import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Provides graceful connection handling with reconnect listeners
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lumi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[Database Warning] Lumi will run in offline/preview mode until MongoDB is reachable.');
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] MongoDB connection lost.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[Database] MongoDB reconnected successfully.');
  });
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
