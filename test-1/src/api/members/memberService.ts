import type { Member } from '@prisma/client';
import { memberRepository } from './memberRepository';

export const memberService = {
  async getAllMembers() {
    const members = await memberRepository.findAll();
    return members.map((member: Member & { borrowedBooks: { borrowedById: string | null }[] }) => ({
      code: member.code,
      name: member.name,
      borrowedBooksCount: member.borrowedBooks.filter((b: { borrowedById: string | null }) => b.borrowedById !== null).length,
    }));
  },
};
