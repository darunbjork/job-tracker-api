// tests/auth.test.ts
// ? Integration tests for Authentication endpoints
// ? Uses supertest + Prisma
// ? Made resilient for CI environments (no real DB required for basic tests)

import request from 'supertest';
import app from '../src/app.js';
import { prisma, shutdownPrisma } from '../src/utils/prisma.js';

const testEmail = `test-${Date.now()}@example.com`;
const logoutEmail = `logout-${Date.now()}@example.com`;

describe('Auth Integration Tests', () => {

  // ? Only clean up if we have a real database connection (skip in CI without DB)
  beforeAll(async () => {
    try {
      await prisma.refreshToken.deleteMany();
      await prisma.user.deleteMany();
      // eslint-disable-next-line no-console
      console.log('✅ Test database cleaned');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('⚠️ Skipping database cleanup (no DB available in this environment)');
    }
  });

  afterAll(async () => {
    await shutdownPrisma();
  });

  it('should register a new user and return access + refresh tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,
        password: 'password123',
        name: 'Test Register User'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user).toHaveProperty('email', testEmail);
  });

  it('should fail to register with an existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: testEmail,           // already used above
        password: 'password123',
        name: 'Duplicate User'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error || res.body.message).toContain('already exists');
  });

  it('should login an existing user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should fail to login with wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should logout a user successfully and delete the refresh token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: logoutEmail,
        password: 'password123',
        name: 'Logout Test User'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: logoutEmail,
        password: 'password123'
      });

    expect(loginRes.statusCode).toEqual(200);
    const refreshToken = loginRes.body.data.refreshToken;

    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken });

    expect(logoutRes.statusCode).toEqual(200);
    expect(logoutRes.body.success).toBe(true);

    // Verify token was deleted
    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    expect(tokenDoc).toBeNull();
  });
});