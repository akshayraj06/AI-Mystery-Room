import mongoose from 'mongoose';
import { env } from './env.js';

let memServer = null;

export async function connectDB() {
  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 1. Try real MongoDB URI if configured
  if (env.MONGODB_URI) {
    try {
      console.log(`[DB] Attempting connection to MongoDB at ${env.MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('[DB] Connected successfully to external MongoDB');
      return mongoose.connection;
    } catch (err) {
      console.warn(`[DB] Could not connect to configured MONGODB_URI: ${err.message}`);
      if (env.isProduction) {
        throw err;
      }
      console.log('[DB] Falling back to embedded MongoDB for local development/testing...');
    }
  }

  // 2. In-memory fallback for local dev & test environments
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memServer = await MongoMemoryServer.create();
    const uri = memServer.getUri();
    await mongoose.connect(uri);
    console.log('[DB] Connected to embedded in-memory MongoDB instance');
    return mongoose.connection;
  } catch (memErr) {
    console.error('[DB] Failed to initialize in-memory database:', memErr.message);
    throw memErr;
  }
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memServer) {
    await memServer.stop();
    memServer = null;
  }
}
