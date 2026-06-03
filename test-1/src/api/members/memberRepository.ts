import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const memberRepository = {
  findAll() {
    return prisma.member.findMany({
      include: {
        borrowedBooks: true,
      },
    });
  },

  findByCode(code: string) {
    return prisma.member.findUnique({
      where: { code },
      include: { borrowedBooks: true },
    });
  },

  update(code: string, data: { penaltyUntil?: Date | null }) {
    return prisma.member.update({ where: { code }, data });
  },
};
