// src/middleware/validate.middleware.ts
// ? Validation middleware using Zod
// ? Validates request body, query, and params against a Zod schema
// ? Returns consistent ApiResult error format on validation failure
// ? Fully typed - no 'any' used (strict compliance)

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResult } from '../types/api.types.js';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');

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
};
