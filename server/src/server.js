import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

async function bootstrap() {
  try {
    // Initialize database (with auto dev fallback if needed)
    await connectDB();

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] AI Mystery Room backend listening on port ${env.PORT} (${env.NODE_ENV})`);
      console.log(`[Server] Base API URL: http://localhost:${env.PORT}/api/v1`);
      console.log(`[Server] Health check: http://localhost:${env.PORT}/api/v1/health`);
    });

    const gracefulShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}, shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Connections closed. Exiting.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
}

bootstrap();
