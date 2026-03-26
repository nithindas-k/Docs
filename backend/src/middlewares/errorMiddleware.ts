import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES, MESSAGES } from '../constants';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: MESSAGES.SERVER_ERROR,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
