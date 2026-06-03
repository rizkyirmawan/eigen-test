import { Request, Response, NextFunction } from 'express';
import { bookService } from './bookService';

export const bookController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const books = await bookService.getAllBooks();
      res.json(books);
    } catch (err) {
      next(err);
    }
  },
};
