import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

// Protect all admin routes with authentication AND admin role check
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getSystemStats);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/users', adminController.getAllUsers);

export default router;
