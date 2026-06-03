import { Request, Response, NextFunction } from 'express';
import { bookService } from './bookService';
import { sendSuccess } from '../../lib/response';

export const bookController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const books = await bookService.getAllBooks();
      sendSuccess(res, books);
    } catch (err) {
      next(err);
    }
  },
};
