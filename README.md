### Verify TypeScript works

# Start your Express development server
npx ts-node src/app.ts

# From job-tracker-api directory type check
npx tsc --version
npx tsc --noEmit 

# Verify folders exist
ls -la src/

## Database Setup (Prisma)

1. **Install Prisma dependencies** 
2. (run `npm install` after cloning):
   ```bash
   npm install prisma --save-dev
   npm install @prisma/client

3. Initialize Prisma (creates prisma/ folder and updates .env):
4. ```bash
   npx prisma init

5. Run the migration to create the Application table:
6. ```bash
   npx prisma migrate dev --name init_application

7. Generate the Prisma Client:
   ```bash
   npx prisma generate

8. View the database (optional):
9. ```bash
   npx prisma studio

Opens a browser at http://localhost:5555 to inspect and edit data.

-----------

# In short: utils/prisma.ts
```bash
Singleton = the code that makes sure you have exactly one PrismaClient (one pool manager).

Pool = the internal team of messengers (managed by PrismaClient).

Connection = a specific phone line (database session) that the pool opens when needed.
```

---

## 💡 Prisma Seed Script Troubleshooting

### Issue

The Prisma `seed.ts` script consistently failed to execute, presenting persistent `PrismaClientConstructorValidationError` errors. This issue prevented the database from being populated and stemmed from a misconfiguration or incompatibility when `ts-node` attempted to run the standalone seed script with Prisma v7.

### Solution

The robust solution involved several key steps: using the official `npx prisma db seed` command with the seed script configured in `prisma.config.ts`, importing the shared `prisma` singleton from `src/utils/prisma`, and implementing the PostgreSQL driver adapter (`@prisma/adapter-pg`) for proper client initialization. Additionally, `import 'dotenv/config';` was added to the top of `prisma/seed.ts` to ensure environment variables were loaded correctly.

### Command Solution

```bash
npx prisma db seed
```

### Code Solutions

**1. `prisma.config.ts` modification:**

```typescript
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts", // Added this line
  },
```

**2. `prisma/seed.ts` modification:**

```typescript
import 'dotenv/config'; // Added this line
import { prisma } from '../src/utils/prisma'; // Replaced local PrismaClient instantiation

async function main() {
  await prisma.application.create({
    data: {
      companyName: "Spotify",
      jobTitle: "Fullstack Developer",
      jobUrl: "https://www.spotifyjobs.com/",
      status: "Applied",
      matchScore: 9,
      notes: "Referral from Anders.",
      dateApplied: new Date(),
    },
  });
  console.log("Seed data created!");
}
```

**3. `src/utils/prisma.ts` modification:**

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter, // Added this line
  log: ['query'],
});
```