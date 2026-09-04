import { transactionRepository } from '../repositories/transaction.repository';
import { smartCategoryService } from './smart-category.service';
import { budgetService } from './budget.service';

export class TransactionService {
  async addTransaction(userId: string, data: any) {
    let finalCategoryId = data.categoryId;

    // Smart Categorization if categoryId is not provided (or as a fallback)
    if (!finalCategoryId && data.description) {
      const detected = await smartCategoryService.detectCategory(data.description, userId);
      if (detected) {
        finalCategoryId = detected;
      } else {
        throw { statusCode: 400, message: 'Category is required and could not be auto-detected.' };
      }
    }

    const transaction = await transactionRepository.create({
      ...data,
      categoryId: finalCategoryId,
      userId,
    });

    // Run Budget Check asynchronously in the background so it doesn't block the request
    if (transaction.type === 'EXPENSE') {
      budgetService.checkBudgetUsage(userId, finalCategoryId, transaction.amount).catch(console.error);
    }

    return transaction;
  }

  async getUserTransactions(userId: string) {
    return await transactionRepository.findByUserId(userId);
  }
}

export const transactionService = new TransactionService();
