### Verify TypeScript works

# From job-tracker-api directory
npx tsc --version
npx tsc --noEmit //type check

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