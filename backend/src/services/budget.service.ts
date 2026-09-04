import prisma from '../config/db';

export class BudgetService {
  async checkBudgetUsage(userId: string, categoryId: string, amountAdded: number) {
    const budget = await prisma.budget.findFirst({
      where: { userId, categoryId }
    });

    if (!budget) return;

    // Calculate current spending for this category in the current period
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const aggregations = await prisma.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: 'EXPENSE',
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    });

    const totalSpent = (aggregations._sum.amount || 0) + amountAdded;
    const usagePercentage = (totalSpent / budget.amount) * 100;

    // Trigger alerts if thresholds crossed
    if (usagePercentage >= 100) {
      await this.createNotification(userId, `You have exceeded your budget for this category! (${usagePercentage.toFixed(1)}%)`, 'ALERT');
    } else if (usagePercentage >= 80) {
      await this.createNotification(userId, `You have used ${usagePercentage.toFixed(1)}% of your budget for this category.`, 'WARNING');
    }
  }

  private async createNotification(userId: string, message: string, type: string) {
    // Prevent duplicate notifications in a short timeframe by checking recent ones
    const recent = await prisma.notification.findFirst({
      where: { userId, message, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
    });
    
    if (!recent) {
      await prisma.notification.create({
        data: { userId, message, type }
      });
    }
  }
}

export const budgetService = new BudgetService();
