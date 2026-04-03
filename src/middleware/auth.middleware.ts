import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';
import { AuthRequest, ApiResult } from '../types/api.types';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET as string;
      
      const decoded = jwt.verify(token, secret) as { id: string; email: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      const response: ApiResult<null> = { success: false, data: null, error: 'Not authorized, token failed' };
      res.status(401).json(response);
    }
  } else {
    const response: ApiResult<null> = { success: false, data: null, error: 'Not authorized, no token' };
    res.status(401).json(response);
  }
};