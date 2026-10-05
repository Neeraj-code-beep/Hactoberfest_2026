import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

/**
 * Connect to MongoDB database
 * Provides graceful connection handling with reconnect listeners
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.warn('[Database] MONGODB_URI is not set in environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'lumi',
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`[Database] MongoDB Connected: host=${conn.connection.host}, database=${conn.connection.name}`);
  } catch (error) {
    logger.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
  }

  mongoose.connection.on('disconnected', () => {
    logger.warn('[Database] MongoDB connection lost.');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('[Database] MongoDB reconnected successfully.');
  });
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
