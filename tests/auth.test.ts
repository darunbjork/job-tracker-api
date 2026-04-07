// tests/auth.test.ts
// ? Integration tests for Authentication endpoints (Register, Login, Logout)
// ? Uses supertest to simulate real HTTP requests + direct Prisma checks
// ? Tests happy path and error cases for auth flow with refresh tokens

import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Auth Integration Tests', () => {

  // ? Clean up any leftover test data before running tests
  beforeAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user and return access + refresh tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test-register@example.com',
        password: 'password123',
        name: 'Test Register User'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toHaveProperty('email', 'test-register@example.com');
  });

  it('should fail to register with an existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test-register@example.com',   // already used above
        password: 'password123',
        name: 'Duplicate User'
      });

    expect(res.statusCode).toEqual(400);   // or 409 depending on your global error handler
    expect(res.body.success).toBe(false);
    expect(res.body.error || res.body.message).toContain('already exists');
  });

  it('should login an existing user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test-register@example.com',
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
        email: 'test-register@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should logout a user successfully and delete the refresh token', async () => {
    // Register a fresh user for logout test
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'logout-test@example.com',
        password: 'password123',
        name: 'Logout Test User'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'logout-test@example.com',
        password: 'password123'
      });

    expect(loginRes.statusCode).toEqual(200);
    const refreshToken = loginRes.body.data.refreshToken;

    // Perform logout
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken });

    expect(logoutRes.statusCode).toEqual(200);
    expect(logoutRes.body.success).toBe(true);

    // Verify the refresh token was actually deleted from DB
    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    expect(tokenDoc).toBeNull();
  });
});