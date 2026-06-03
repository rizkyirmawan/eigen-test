import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bookRepository } from '../bookRepository';
import { bookService } from '../bookService';

vi.mock('../bookRepository', () => ({
  bookRepository: {
    findAll: vi.fn(),
  },
}));

describe('bookService.getAllBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return books with available stock when not borrowed', async () => {
    const mockBooks = [
      { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1, borrowedById: null, borrowedAt: null },
      { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1, borrowedById: null, borrowedAt: null },
    ];
    vi.mocked(bookRepository.findAll).mockResolvedValue(mockBooks as any);

    const result = await bookService.getAllBooks();

    expect(result).toEqual([
      { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', available: 1 },
      { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', available: 1 },
    ]);
  });

  it('should return available 0 when book is borrowed', async () => {
    const mockBooks = [
      { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', stock: 1, borrowedById: 'M001', borrowedAt: new Date() },
    ];
    vi.mocked(bookRepository.findAll).mockResolvedValue(mockBooks as any);

    const result = await bookService.getAllBooks();

    expect(result).toEqual([
      { code: 'TW-11', title: 'Twilight', author: 'Stephenie Meyer', available: 0 },
    ]);
  });

  it('should return empty array when no books', async () => {
    vi.mocked(bookRepository.findAll).mockResolvedValue([]);

    const result = await bookService.getAllBooks();

    expect(result).toEqual([]);
  });
});
