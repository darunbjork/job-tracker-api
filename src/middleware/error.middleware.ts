import { Request, Response, NextFunction } from 'express';
import { ApiResult } from '../types/api.types';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

const resposne: ApiResult<null> = {
  success: false,
  data: null,
  error: err.message || 'Internal server error',
};

console.error(`[Error] ${err.stack}`);
res.status(statusCode).json(resposne);
}