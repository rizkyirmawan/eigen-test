import { Request, Response, NextFunction } from 'express';
import { memberService } from './memberService';

export const memberController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const members = await memberService.getAllMembers();
      res.json(members);
    } catch (err) {
      next(err);
    }
  },
};
