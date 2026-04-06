// ✅ 1. Load environment variables BEFORE any other imports
require('dotenv').config();

// ✅ 2. Import app and utilities (now safe to use process.env)
import app from './app';
import { prisma } from './utils/prisma';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// ✅ 3. Graceful Shutdown (Cleanly close Prisma connections)
const shutdown = async () => {
  logger.info('Shutting down server...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Prisma disconnected. Process exited.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);