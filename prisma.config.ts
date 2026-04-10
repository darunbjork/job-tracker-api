// @ts-nocheck
import "dotenv/config";
import { defineConfig } from "@prisma/client/generator";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: process.env["PRODUCTION_DATABASE_URL"],
  },
});
