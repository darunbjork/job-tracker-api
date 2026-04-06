import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { ApiResult } from '../types/api.types';

export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
       
        const errorMessage = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        
        const response: ApiResult<null> = {
          success: false,
          data: null,
          error: errorMessage,
        };
        
        res.status(400).json(response);
      } else {
        next(error);
      }
    }
  };