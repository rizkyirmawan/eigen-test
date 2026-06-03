import { describe, it, expect, vi, beforeEach } from 'vitest';
import { borrowRepository } from '../borrowRepository';
import { prisma } from '../../../lib/prisma';

vi.mock('../../../lib/prisma', () => {
  const mockPrisma = {
    book: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    member: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

describe('borrowRepository.borrowBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when book not found', async () => {
    (prisma.book.findUnique as any).mockResolvedValue(null);
    (prisma.member.findUnique as any).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });

    await expect(borrowRepository.borrowBook('M001', 'INVALID')).rejects.toThrow('Book not found');
  });

  it('should throw error when member not found', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1, borrowedById: null, borrowedAt: null });
    (prisma.member.findUnique as any).mockResolvedValue(null);

    await expect(borrowRepository.borrowBook('INVALID', 'JK-45')).rejects.toThrow('Member not found');
  });

  it('should throw error when book is already borrowed', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', borrowedById: 'M002' });
    (prisma.member.findUnique as any).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Book is already borrowed');
  });

  it('should throw error when member already has 2 books', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    (prisma.member.findUnique as any).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });
    (prisma.book.findMany as any).mockResolvedValue([{ code: 'TW-11' }, { code: 'HOB-83' }]);

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Member cannot borrow more than 2 books');
  });

  it('should throw error when member is penalized', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    (prisma.member.findUnique as any).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: futureDate });
    (prisma.book.findMany as any).mockResolvedValue([]);

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Member is currently penalized');
  });

  it('should borrow book successfully', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    (prisma.member.findUnique as any).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });
    (prisma.book.findMany as any).mockResolvedValue([]);
    (prisma.book.update as any).mockResolvedValue({});

    const result = await borrowRepository.borrowBook('M001', 'JK-45');

    expect(result).toEqual({ message: 'Book borrowed successfully' });
    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { code: 'JK-45' },
      data: { borrowedById: 'M001', borrowedAt: expect.any(Date) },
    });
  });
});

describe('borrowRepository.returnBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when book not found', async () => {
    (prisma.book.findUnique as any).mockResolvedValue(null);

    await expect(borrowRepository.returnBook('M001', 'INVALID')).rejects.toThrow('Book not found');
  });

  it('should throw error when book was not borrowed by this member', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({ code: 'JK-45', borrowedById: 'M002' });

    await expect(borrowRepository.returnBook('M001', 'JK-45')).rejects.toThrow('This book was not borrowed by this member');
  });

  it('should return book successfully without penalty when within 7 days', async () => {
    (prisma.book.findUnique as any).mockResolvedValue({
      code: 'JK-45',
      borrowedById: 'M001',
      borrowedAt: new Date(),
    });
    (prisma.book.update as any).mockResolvedValue({});

    const result = await borrowRepository.returnBook('M001', 'JK-45');

    expect(result).toEqual({ message: 'Book returned successfully' });
    expect(prisma.book.update).toHaveBeenCalledWith({
      where: { code: 'JK-45' },
      data: { borrowedById: null, borrowedAt: null },
    });
  });

  it('should apply penalty when returned after more than 7 days', async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 10);

    (prisma.book.findUnique as any).mockResolvedValue({
      code: 'JK-45',
      borrowedById: 'M001',
      borrowedAt: sevenDaysAgo,
    });
    (prisma.book.update as any).mockResolvedValue({});
    (prisma.member.update as any).mockResolvedValue({});

    const result = await borrowRepository.returnBook('M001', 'JK-45');

    expect(result).toEqual({ message: 'Book returned successfully' });
    expect(prisma.member.update).toHaveBeenCalled();
    const updateCall = (prisma.member.update as any).mock.calls[0][0];
    expect(updateCall.where.code).toBe('M001');
    expect(updateCall.data.penaltyUntil).toBeInstanceOf(Date);
  });
});
