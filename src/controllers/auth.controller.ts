import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { RegisterDto, LoginDto, AuthResponse } from '../types/user.types.js';
import { ApiResult } from '../types/api.types.js';

const authService = new AuthService();

export class AuthController {
  async register(req: Request<{}, {}, RegisterDto>, res: Response): Promise<void> {
    try {
      const data: AuthResponse = await authService.register(req.body);
      
      const response: ApiResult<AuthResponse> = {
        success: true,
        data,
        error: null,
      };
      
      res.status(201).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const response: ApiResult<null> = {
        success: false,
        data: null,
        error: errorMessage,
      };
      
      res.status(400).json(response);
    }
  }

  async login(req: Request<{}, {}, LoginDto>, res: Response): Promise<void> {
    try {
      const data: AuthResponse = await authService.login(req.body);
      
      const response: ApiResult<AuthResponse> = {
        success: true,
        data,
        error: null,
      };
      
      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const response: ApiResult<null> = {
        success: false,
        data: null,
        error: errorMessage,
      };
      
      res.status(401).json(response); 
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body; // Assuming refreshToken is sent in the body
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }

      await authService.logout(refreshToken);

      const response: ApiResult<null> = {
        success: true,
        data: null,
        error: null,
      };

      res.status(200).json(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      const response: ApiResult<null> = {
        success: false,
        data: null,
        error: errorMessage,
      };

      res.status(400).json(response);
    }
  }
}