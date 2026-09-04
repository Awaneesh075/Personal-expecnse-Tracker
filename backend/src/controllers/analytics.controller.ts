import { Request, Response, NextFunction } from 'express';
import { reportQueue } from '../services/queue.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AnalyticsController {
  async triggerReportGeneration(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const job = await reportQueue.add('generate-monthly-report', {
        userId: req.user!.id,
      });
      
      res.status(202).json({ 
        status: 'success', 
        message: 'Report generation queued',
        jobId: job.id 
      });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
