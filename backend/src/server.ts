import app from './app';
import { config } from './config';
import { prisma } from './lib/prisma';

const server = app.listen(config.port, () => {
  console.log(`========================================`);
  console.log(`🚀 SHRAMIKK Backend running in ${config.nodeEnv} mode`);
  console.log(`👉 API Endpoint: http://localhost:${config.port}`);
  console.log(`========================================`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[${signal}] Shutting down server gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Database connection disconnected.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
