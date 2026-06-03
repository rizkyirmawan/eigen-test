import { borrowRepository } from './borrowRepository';

export const borrowService = {
  async borrow(memberCode: string, bookCode: string) {
    return borrowRepository.borrowBook(memberCode, bookCode);
  },

  async return(memberCode: string, bookCode: string) {
    return borrowRepository.returnBook(memberCode, bookCode);
  },
};
