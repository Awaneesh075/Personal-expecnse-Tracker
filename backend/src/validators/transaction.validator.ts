import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE']),
    description: z.string().min(1, 'Description is required'),
    categoryId: z.string().uuid('Invalid category ID'),
    paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'UPI', 'OTHER']).optional(),
    isRecurring: z.boolean().optional(),
    recurrenceRule: z.string().optional(),
  }),
});
