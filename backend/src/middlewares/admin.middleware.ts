import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import prisma from '../config/db';

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Authentication required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ status: 'error', message: 'Admin privileges required' });
    }

    next();
  } catch (error) {
    next(error);
  }
};
