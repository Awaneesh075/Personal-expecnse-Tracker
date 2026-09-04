import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TransactionController {
  async createTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.addTransaction(req.user!.id, req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.getUserTransactions(req.user!.id);
      res.status(200).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionController = new TransactionController();
