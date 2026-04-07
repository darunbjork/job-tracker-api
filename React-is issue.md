## What Was Wrong & How We Fixed It

You were trying to run integration tests for an **Express + TypeScript + Prisma** API using **Jest**. Your project uses **ES Modules** (`"type": "module"` in `package.json`), which means all imports must include file extensions (`.js`), even when the source files are `.ts`. This is correct for ESM, but Jest – by default – doesn’t understand TypeScript or ESM imports without extra configuration.

### The Core Problems

| Symptom | Root Cause |
|---------|-------------|
| `SyntaxError: Cannot use import statement outside a module` | Jest wasn’t treating `.ts` files as ES Modules. |
| `Cannot find module '../src/app.js'` | Jest looked for a `.js` file that doesn’t exist (the source is `.ts`). |
| `Could not locate module ./cjs/react-is.development.js mapped as: $1.ts` | A too‑broad `moduleNameMapper` tried to rewrite **every** relative `.js` import – including internal Jest dependencies like `react-is` – into `.ts`, causing a crash. |
| Jest hung after all tests passed (“Jest did not exit”) | The Prisma client kept a connection pool open. `prisma.$disconnect()` only closed the Prisma side, but the underlying `pg` pool remained alive. |

### Step‑by‑Step Fixes

#### 1. Make Jest Understand ESM + TypeScript

**Problem:** Jest didn’t know that `.ts` files are ES Modules and needed transformation.

**Fix:** In `jest.config.js`:
- Set `extensionsToTreatAsEsm: ['.ts']`
- Configure `ts-jest` with `useESM: true`
- Add `NODE_OPTIONS=--experimental-vm-modules` to the test script (enables native Node.js ESM support for Jest)

```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  // ... other options
};
```

#### 2. Resolve `.js` Imports to `.ts` Sources (Without Breaking `node_modules`)

**Problem:** Your test files and source files import using `.js` extensions (e.g., `import app from '../src/app.js'`). Jest couldn’t find those files because they don’t exist – they are `.ts` files.

**Bad solution (what we tried first):** A `moduleNameMapper` like `'^(\\.{1,2}/.*)\\.js$': '$1.ts'`. This caught **every** relative `.js` import, including those inside `node_modules` (e.g., `react-is` uses `require('./cjs/react-is.development.js')`). Those internal files exist as `.js`, but the mapper tried to load `.ts` versions, causing the `react-is` error.

**Good solution (final):** Write a **custom Jest resolver** (`jest.resolver.cjs`) that:
- Tries the default resolution first (finds real `.js` files in `node_modules`).
- Only when that fails **and** the request ends with `.js`, it attempts to load the same path with a `.ts` extension.

```javascript
// jest.resolver.cjs
module.exports = (request, options) => {
  try {
    return options.defaultResolver(request, options);
  } catch (err) {
    if (request.endsWith('.js')) {
      const tsRequest = request.slice(0, -3) + '.ts';
      try {
        return options.defaultResolver(tsRequest, options);
      } catch (_) {}
    }
    throw err;
  }
};
```

This way, local `.js` imports resolve to your `.ts` files, but `node_modules` dependencies are left untouched. We also **removed `moduleNameMapper` entirely** from `jest.config.js`.

#### 3. Fix the “Jest did not exit” Open Handle

**Problem:** After all tests passed, Jest hung because the Prisma connection pool (via `pg.Pool`) was still open. Your `afterAll` called `prisma.$disconnect()`, but that only disconnects the Prisma client – not the underlying PostgreSQL pool.

**Fix:** Use the existing `shutdownPrisma()` function (from `src/utils/prisma.ts`) which calls **both** `prisma.$disconnect()` **and** `pool.end()`. Then call it in `afterAll`:

```typescript
// tests/auth.test.ts
import { prisma, shutdownPrisma } from '../src/utils/prisma.js';

afterAll(async () => {
  await shutdownPrisma();  // closes Prisma + the pg pool
});
```

#### 4. Avoid TypeScript / ESM Conflicts in the Setup File

**Problem:** The `jest.setup.ts` file used TypeScript (`import`), but Jest sometimes loads setup files before the transformer runs, causing `SyntaxError`.

**Fix:** Convert `jest.setup.ts` to plain JavaScript (ES Module) – rename to `jest.setup.mjs`. Now it runs natively without any transformation:

```javascript
// jest.setup.mjs
import 'dotenv/config';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test-refresh-secret';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/jobtracker_test?schema=public';
```

Update `jest.config.js` to point to `jest.setup.mjs`.

#### 5. Handle ESLint Warnings on the Resolver File (Optional)

**Problem:** `jest.resolver.cjs` uses CommonJS (`module.exports`, `require`) and an unused `e` variable, which ESLint (configured for TypeScript/ESM) flagged as errors.

**Fix:** Add `/* eslint-env node */` and `/* eslint-disable @typescript-eslint/no-unused-vars */` at the top of the file, or ignore the file in your ESLint config.

### The Final Working Configuration

- **`jest.config.js`** – ESM‑ready, no `moduleNameMapper`, uses custom resolver.
- **`jest.resolver.cjs`** – falls back from `.js` to `.ts` only when needed.
- **`jest.setup.mjs`** – pure JavaScript for environment setup.
- **`package.json`** – test script: `"test": "NODE_OPTIONS=--experimental-vm-modules jest"`
- **Test file** – imports use `.js` extensions and call `shutdownPrisma()` after all tests.

### Outcome

- All 5 authentication tests **pass**.
- Jest **exits cleanly** (no open handles).
- No more `react-is` or module resolution errors.
- The infrastructure is now ready to write and run more integration tests.

Your API’s business logic works; only the test tooling was misconfigured. 🎉