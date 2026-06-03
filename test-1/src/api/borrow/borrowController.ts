import { Request, Response, NextFunction } from 'express';
import { borrowService } from './borrowService';
import { sendSuccess } from '../../lib/response';

export const borrowController = {
  async borrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberCode, bookCode } = req.body;
      const result = await borrowService.borrow(memberCode, bookCode);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  async return(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberCode, bookCode } = req.body;
      const result = await borrowService.return(memberCode, bookCode);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },
};
