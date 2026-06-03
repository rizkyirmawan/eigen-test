import { Request, Response, NextFunction } from 'express';
import { memberService } from './memberService';
import { sendSuccess } from '../../lib/response';

export const memberController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const members = await memberService.getAllMembers();
      sendSuccess(res, members);
    } catch (err) {
      next(err);
    }
  },
};
