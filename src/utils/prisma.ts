// ? This ensures we only have one instance of the Prisma client running (a singleton), which prevents "too many connections" errors in development.
// ! This code doesn't directly connect to the database—it sets up the Prisma client + connection pool that will connect when you first run a query.
// * A pool of connections is like a team of dedicated messengers that your app can reuse.
// * new Pool() creates that team with a maximum of 20 messengers.
// * new PrismaClient() uses this pool through the adapter so Prisma doesn't create its own connection pool.
// * The actual database connection happens only when you run your first query (e.g. prisma.application.findMany()).

//* Import the Prisma Client constructor from the Prisma package.
//* This is what we use to talk to our database.
import logger from './logger';
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // ! ← only the address is used here, not the connection
  max: 20,                    // maximum number of connections in the pool
  idleTimeoutMillis: 30000,   // close idle connections after 30 seconds
});
logger.info(`DATABASE_URL seen by application: ${process.env.DATABASE_URL ? '✓ Loaded' : '✗ Missing'}`);

// ? Listen for unexpected errors on the pool (e.g. network issues) so we can log them
pool.on('error', () => {
  
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// ? In development we reuse the same Prisma instance across hot reloads
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  // ? Log all query details in development for easier debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// ? Gracefully shuts down the Prisma client and closes the underlying connection pool.
// ? This is important when your app is stopping (e.g. during server shutdown, tests, or hot reload in development)
// ? to prevent connection leaks and allow the database to release resources cleanly.
export async function shutdownPrisma() {
  await prisma.$disconnect();
  await pool.end();
}