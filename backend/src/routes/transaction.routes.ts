import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTransactionSchema } from '../validators/transaction.validator';

const router = Router();

router.use(authenticate); // Protect all transaction routes

router.post('/', validate(createTransactionSchema), transactionController.createTransaction);
router.get('/', transactionController.getTransactions);

export default router;
