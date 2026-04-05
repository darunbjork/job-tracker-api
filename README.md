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

---

## Authentication Infrastructure Foundation
```bash
**What happened:** I integrated a `User` model into our database schema and linked `Application` records to specific users. During this process, a migration error occurred because the new `userId` column in `Application` was mandatory, but existing records lacked this value.

**What I did:** I had to reset the development database using `npx prisma migrate reset` to clear all existing data, which allowed the new `add_user_model` migration to be applied successfully. I also installed essential security libraries (`bcrypt`, `jsonwebtoken`) and updated TypeScript types (`src/types/user.types.ts`, `src/types/application.types.ts`) to reflect the new schema.

**Why I did it:** Resetting the development database was necessary to resolve data conflicts and apply the new schema changes cleanly. These updates provide the foundational database structure and strict typing required for implementing robust authentication and ensuring that users can only access their own job applications, a critical security measure.



***
```bash
When you call Jwt.sign(), you pass algorithm: 'HS256' to tell the library exactly which cryptographic method to use for signing the token.

Why specify it explicitly?

The library has a default (also HS256), but attackers could try to trick your server by sending a token claiming a different algorithm (e.g., none or RS256). If your server just uses the default, it might accidentally accept a malicious token.
By forcing HS256, you eliminate that risk. You are saying: "I will only accept tokens signed with this specific algorithm."
What does HS256 mean?

HS = HMAC (Hash‑based Message Authentication Code) with a shared secret (the same string on both the server that creates the token and the server that verifies it).
256 = SHA‑256, the hashing function used inside.
In simple words: It’s like agreeing on a secret handshake and explicitly saying “this is the only handshake we use.” No one can trick you with a different handshake.



-----------
```bash
- **Hashing is one‑way** – you cannot reverse a hash to get the original password.

- **Salt** is random extra data mixed into the password before hashing, so the same password gives different hashes for different users.

- The **cost factor** (10, 12, etc.) controls how slow the hashing is.

- Higher cost = slower = harder for attackers to guess passwords, but also slower for your app. A good balance is usually 10–12.

--------

```bash
The process is:

Generate a random salt (using bcrypt.genSalt(10)).
Combine the plain password with the salt.
Run the combined string through the bcrypt hashing algorithm (one‑way).
The final stored hash includes the salt, cost factor, and the hash itself.
So "add salt, then hash" is exactly right.


--------------------

```bash
Final simple summary:

.env → DATABASE_URL = the address + login info
Singleton file → creates one PrismaClient + one connection pool
Repository file (this one) → just uses the prisma singleton to run queries
Real connection → happens automatically inside the pool the first time any query runs

----------------------------------------

Full Flow (super simple): ⭐️⭐️⭐️

.env file
→ Contains DATABASE_URL (just the address + username + password)

Singleton file (prisma.ts)
→ Creates one PrismaClient + one connection pool using that URL.
→ But it does not open the real connection yet.

Repository (your ApplicationRepository)
→ Just calls methods like prisma.application.create(...)

When a ***route is called*** (e.g. POST /applications or GET /applications)
→ Repository runs a query → only then the real connection to the database is opened using the pool from the singleton.