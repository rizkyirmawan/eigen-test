import { Request, Response, NextFunction } from 'express';
import { borrowService } from './borrowService';

export const borrowController = {
  async borrow(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberCode, bookCode } = req.body;
      const result = await borrowService.borrow(memberCode, bookCode);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async return(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberCode, bookCode } = req.body;
      const result = await borrowService.return(memberCode, bookCode);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
