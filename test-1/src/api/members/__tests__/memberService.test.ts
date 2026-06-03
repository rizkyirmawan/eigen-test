import { describe, it, expect, vi, beforeEach } from 'vitest';
import { memberRepository } from '../memberRepository';
import { memberService } from '../memberService';

vi.mock('../memberRepository', () => ({
  memberRepository: {
    findAll: vi.fn(),
  },
}));

describe('memberService.getAllMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return members with borrowed count', async () => {
    const mockMembers = [
      {
        code: 'M001',
        name: 'Angga',
        penaltyUntil: null,
        borrowedBooks: [
          { code: 'JK-45', borrowedById: 'M001' },
        ],
      },
      {
        code: 'M002',
        name: 'Ferry',
        penaltyUntil: null,
        borrowedBooks: [],
      },
    ];
    vi.mocked(memberRepository.findAll).mockResolvedValue(mockMembers as any);

    const result = await memberService.getAllMembers();

    expect(result).toEqual([
      { code: 'M001', name: 'Angga', borrowedBooksCount: 1 },
      { code: 'M002', name: 'Ferry', borrowedBooksCount: 0 },
    ]);
  });

  it('should return empty array when no members', async () => {
    vi.mocked(memberRepository.findAll).mockResolvedValue([]);

    const result = await memberService.getAllMembers();

    expect(result).toEqual([]);
  });
});
