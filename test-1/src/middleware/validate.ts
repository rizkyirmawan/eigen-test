import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { AppError } from './errorHandler';

export function validate(schema: z.ZodObject<any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        next(new AppError(400, messages.join('; ')));
      } else {
        next(err);
      }
    }
  };
}

export const borrowSchema = z.object({
  memberCode: z.string().min(1, 'memberCode is required'),
  bookCode: z.string().min(1, 'bookCode is required'),
});
