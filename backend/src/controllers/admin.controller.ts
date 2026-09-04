import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export class AdminController {
  async getSystemStats(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUsers = await prisma.user.count();
      const totalTransactions = await prisma.transaction.count();
      const totalCategories = await prisma.category.count();

      res.status(200).json({
        status: 'success',
        data: {
          totalUsers,
          totalTransactions,
          totalCategories
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { user: { select: { email: true, name: true } } }
      });

      res.status(200).json({ status: 'success', data: logs });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true }
      });
      res.status(200).json({ status: 'success', data: users });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
