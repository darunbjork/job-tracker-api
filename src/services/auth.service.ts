import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { RegisterDto, LoginDto, AuthResponse, User } from '../types/user.types';

export class AuthService {
  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET;
    if(!secret) throw new Error('JWT_SECRET is not defined in environment variable');

    // * // Explicitly "use HS256" – it's safer than letting the library guess
    return Jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '30d',
      algorithm: 'HS256'
    });
  }

 // * Prisma user includes password; our User type doesn't. So we use 'any' here to strip it safely.
private mapToUserType(user: any): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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

    const safeUser = this.mapToUserType(newUser);
    return {
      user: safeUser,
      token: this.generateToken(safeUser),
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

    const safeUser = this.mapToUserType(user);
    return {
      user: safeUser,
      token: this.generateToken(safeUser),
    };
  }
}