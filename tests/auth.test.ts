import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Auth Integration Tests', () => {
  // Clean DB before tests
  beforeAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
  });

  it('should fail to register with existing email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Another User'
      });

    expect(res.statusCode).toEqual(400); // Or 409 Conflict, depending on your error handling
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('User already exists with this email');
  });

  it('should login an existing user and return tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
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
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should logout a user successfully', async () => {
    // First, register and login a user to get a refresh token
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'logout@example.com',
        password: 'password123',
        name: 'Logout User'
      });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'logout@example.com',
        password: 'password123'
      });
    
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body.success).toBe(true);
    const refreshToken = loginRes.body.data.refreshToken;

    // Now, attempt to logout with the refresh token
    const logoutRes = await request(app)
      .post('/api/v1/auth/logout')
      .send({ refreshToken: refreshToken });

    expect(logoutRes.statusCode).toEqual(200);
    expect(logoutRes.body.success).toBe(true);

    // Verify the refresh token is deleted from the database
    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    expect(tokenDoc).toBeNull();
  });
});