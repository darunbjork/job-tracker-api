import { Request, Response, NextFunction } from 'express';
import { ApiResult } from '../types/api.types.js';
import logger from '../utils/logger.js';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // ✅ Log the error to our file system via Winston
  logger.error(`${err.message} - ${req.method} ${req.originalUrl} - Remote IP: ${req.ip}`);

  const response: ApiResult<null> = {
    success: false,
    data: null,
    error: err.message || 'Internal Server Error',
  };

  res.status(statusCode).json(response);
};