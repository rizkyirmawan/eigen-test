import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const borrowRepository = {
  async borrowBook(memberCode: string, bookCode: string) {
    const [book, member] = await Promise.all([
      prisma.book.findUnique({ where: { code: bookCode } }),
      prisma.member.findUnique({ where: { code: memberCode } }),
    ]);

    if (!book) throw new Error('Book not found');
    if (!member) throw new Error('Member not found');

    if (book.borrowedById) throw new Error('Book is already borrowed');

    const borrowedBooks = await prisma.book.findMany({
      where: { borrowedById: memberCode },
    });
    if (borrowedBooks.length >= 2) throw new Error('Member cannot borrow more than 2 books');

    if (member.penaltyUntil && member.penaltyUntil > new Date()) {
      throw new Error('Member is currently penalized');
    }

    await prisma.book.update({
      where: { code: bookCode },
      data: { borrowedById: memberCode, borrowedAt: new Date() },
    });

    return { message: 'Book borrowed successfully' };
  },

  async returnBook(memberCode: string, bookCode: string) {
    const book = await prisma.book.findUnique({ where: { code: bookCode } });
    if (!book) throw new Error('Book not found');
    if (book.borrowedById !== memberCode) throw new Error('This book was not borrowed by this member');

    if (book.borrowedAt) {
      const diffDays = Math.floor(
        (new Date().getTime() - book.borrowedAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 7) {
        const penaltyUntil = new Date();
        penaltyUntil.setDate(penaltyUntil.getDate() + 3);
        await prisma.member.update({
          where: { code: memberCode },
          data: { penaltyUntil },
        });
      }
    }

    await prisma.book.update({
      where: { code: bookCode },
      data: { borrowedById: null, borrowedAt: null },
    });

    return { message: 'Book returned successfully' };
  },
};
