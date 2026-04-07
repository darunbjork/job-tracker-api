// jest.setup.ts
// This file runs before every test file.

import 'dotenv/config'; // Loads .env file for tests

// Ensure JWT_SECRET and REFRESH_SECRET are set for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.REFRESH_SECRET = process.env.REFRESH_SECRET || 'test-refresh-secret';

// You might also want to set a test database URL if not already handled
// process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/testdb';
