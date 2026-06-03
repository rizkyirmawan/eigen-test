import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookRepository = {
  findAll() {
    return prisma.book.findMany();
  },

  findByCode(code: string) {
    return prisma.book.findUnique({ where: { code } });
  },

  update(code: string, data: { stock?: number; borrowedById?: string | null }) {
    return prisma.book.update({ where: { code }, data });
  },
};
