import { Response } from 'express';

export function sendSuccess(res: Response, data: any, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  });
}
