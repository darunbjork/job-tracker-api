import { Request, Response, NextFunction } from 'express';
import { ApiResult } from '../types/api.types';
import logger from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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