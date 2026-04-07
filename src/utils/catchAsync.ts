// src/utils/catchAsync.ts
// ? Utility to wrap async controller functions and automatically pass errors to next()
// ? This eliminates the need for try/catch in every controller method
// ? Fully typed - no 'any' used

import { Request, Response, NextFunction } from 'express';

export const catchAsync = <T = unknown>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
