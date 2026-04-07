import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { RegisterDto, LoginDto, AuthResponse, User } from '../types/user.types';

export class AuthService {
  private mapToUserType(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async generateTokens(userId: string) {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_SECRET;

    if (!jwtSecret) throw new Error('JWT_SECRET is not defined in environment variable');
    if (!refreshSecret) throw new Error('REFRESH_SECRET is not defined in environment variable');

    const accessToken = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: userId }, refreshSecret, { expiresIn: '7d' });

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(oldRefreshToken: string) {
    // 1. Verify token exists in DB
    const tokenDoc = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true }
    });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    // 2. Delete old token (Rotation)
    await prisma.refreshToken.delete({ where: { id: tokenDoc.id } });

    // 3. Generate new pair
    return this.generateTokens(tokenDoc.userId);
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email}});
    if(existingUser) {
      throw new Error('User already exists with this email');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword, 
      },
    });

    const { accessToken, refreshToken } = await this.generateTokens(newUser.id);
    const safeUser = this.mapToUserType(newUser);

    return {
      user: safeUser,
      accessToken,
      refreshToken
    };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if(!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if(!isMatch) {
      throw new Error('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    const safeUser = this.mapToUserType(user);

    return {
      user: safeUser,
      accessToken,
      refreshToken
    };
  }
}