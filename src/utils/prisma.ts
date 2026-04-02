// ? This ensures we only have one instance of the Prisma client running (a singleton), which prevents "too many connections" errors in development.

// ! This code doesn't directly connect to the database—it sets up the Prisma client that will later connect to the database when you run a query.                                                    
// * A pool of connections is like a team of dedicated messengers that your app can send to the database. In code, new PrismaClient() creates that team (the pool) and. But it is not the actual connection. First-time user runs a query (like prisma.application.findMany()), Prisma will connect to the database and start using the pool.

//* Import the Prisma Client constructor from the Prisma package.
//* This is what we use to talk to our database.
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: ['query'], // 'query' means log every SQL statement to the console
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;




//?  Prisma's log: ['query'] is a database‑specific logging feature that prints the raw SQL statements Prisma executes. It's purely for debugging database queries – you see things like SELECT * FROM "Application" WHERE id = $1.