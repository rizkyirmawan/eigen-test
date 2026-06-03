import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { borrowRepository } from '../borrowRepository';

vi.mock('@prisma/client', () => {
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
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

describe('borrowRepository.borrowBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error when book not found', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.member.findUnique).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });

    await expect(borrowRepository.borrowBook('M001', 'INVALID')).rejects.toThrow('Book not found');
  });

  it('should throw error when member not found', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1, borrowedById: null, borrowedAt: null });
    vi.mocked(prisma.member.findUnique).mockResolvedValue(null);

    await expect(borrowRepository.borrowBook('INVALID', 'JK-45')).rejects.toThrow('Member not found');
  });

  it('should throw error when book is already borrowed', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', borrowedById: 'M002' });
    vi.mocked(prisma.member.findUnique).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Book is already borrowed');
  });

  it('should throw error when member already has 2 books', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    vi.mocked(prisma.member.findUnique).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });
    vi.mocked(prisma.book.findMany).mockResolvedValue([{ code: 'TW-11' }, { code: 'HOB-83' }] as any);

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Member cannot borrow more than 2 books');
  });

  it('should throw error when member is penalized', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    vi.mocked(prisma.member.findUnique).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: futureDate });
    vi.mocked(prisma.book.findMany).mockResolvedValue([]);

    await expect(borrowRepository.borrowBook('M001', 'JK-45')).rejects.toThrow('Member is currently penalized');
  });

  it('should borrow book successfully', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', borrowedById: null });
    vi.mocked(prisma.member.findUnique).mockResolvedValue({ code: 'M001', name: 'Angga', penaltyUntil: null });
    vi.mocked(prisma.book.findMany).mockResolvedValue([]);
    vi.mocked(prisma.book.update).mockResolvedValue({} as any);

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
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue(null);

    await expect(borrowRepository.returnBook('M001', 'INVALID')).rejects.toThrow('Book not found');
  });

  it('should throw error when book was not borrowed by this member', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({ code: 'JK-45', borrowedById: 'M002' });

    await expect(borrowRepository.returnBook('M001', 'JK-45')).rejects.toThrow('This book was not borrowed by this member');
  });

  it('should return book successfully without penalty when within 7 days', async () => {
    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({
      code: 'JK-45',
      borrowedById: 'M001',
      borrowedAt: new Date(),
    } as any);
    vi.mocked(prisma.book.update).mockResolvedValue({} as any);

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

    const prisma = new PrismaClient();
    vi.mocked(prisma.book.findUnique).mockResolvedValue({
      code: 'JK-45',
      borrowedById: 'M001',
      borrowedAt: sevenDaysAgo,
    } as any);
    vi.mocked(prisma.book.update).mockResolvedValue({} as any);
    vi.mocked(prisma.member.update).mockResolvedValue({} as any);

    const result = await borrowRepository.returnBook('M001', 'JK-45');

    expect(result).toEqual({ message: 'Book returned successfully' });
    expect(prisma.member.update).toHaveBeenCalled();
    const updateCall = vi.mocked(prisma.member.update).mock.calls[0][0];
    expect(updateCall.where.code).toBe('M001');
    expect(updateCall.data.penaltyUntil).toBeInstanceOf(Date);
  });
});
