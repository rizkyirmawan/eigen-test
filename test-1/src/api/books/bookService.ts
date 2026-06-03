import type { Book } from '@prisma/client';
import { bookRepository } from './bookRepository';

export const bookService = {
  async getAllBooks() {
    const books = await bookRepository.findAll();
    return books.map((book: Book) => ({
      code: book.code,
      title: book.title,
      author: book.author,
      available: book.borrowedById ? 0 : book.stock,
    }));
  },
};
