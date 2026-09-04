import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/generate-report', analyticsController.triggerReportGeneration);

export default router;
