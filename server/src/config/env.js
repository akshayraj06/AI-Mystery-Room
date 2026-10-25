import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or server directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GENERATION_MAX_RETRIES: parseInt(process.env.GENERATION_MAX_RETRIES || '2', 10),
  GENERATION_TIMEOUT_MS: parseInt(process.env.GENERATION_TIMEOUT_MS || '90000', 10),
  MAX_SCENARIO_LENGTH: parseInt(process.env.MAX_SCENARIO_LENGTH || '3000', 10),
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};
