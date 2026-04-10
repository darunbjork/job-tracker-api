// @ts-nocheck
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
 datasources: {
    db: {
      kind: "postgres",
      url: process.env.PRODUCTION_DATABASE_URL,
    },
  },
});
