import prisma from '../config/db';

export class AdvancedAnalyticsService {
  async getDashboardMetrics(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Total Balance (All time)
    const allTransactions = await prisma.transaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    
    // Monthly Income & Expenses
    const monthlyStats = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId, date: { gte: startOfMonth } },
      _sum: { amount: true }
    });

    let monthlyIncome = 0;
    let monthlyExpense = 0;

    monthlyStats.forEach(stat => {
      if (stat.type === 'INCOME') monthlyIncome += stat._sum.amount || 0;
      if (stat.type === 'EXPENSE') monthlyExpense += stat._sum.amount || 0;
    });

    // Highest spending transaction this month
    const highestExpense = await prisma.transaction.findFirst({
      where: { userId, type: 'EXPENSE', date: { gte: startOfMonth } },
      orderBy: { amount: 'desc' },
      include: { category: true }
    });

    // Category-wise Breakdown
    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'EXPENSE', date: { gte: startOfMonth } },
      _sum: { amount: true }
    });

    return {
      monthlyIncome,
      monthlyExpense,
      monthlySavings: monthlyIncome - monthlyExpense,
      highestExpense,
      categoryStats
    };
  }

  async generateCSVReport(userId: string) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });

    let csvContent = 'Date,Description,Type,Amount,Category,PaymentMethod\n';
    
    transactions.forEach(t => {
      csvContent += `${t.date.toISOString()},"${t.description}",${t.type},${t.amount},${t.category.name},${t.paymentMethod}\n`;
    });

    return csvContent;
  }
}

export const advancedAnalyticsService = new AdvancedAnalyticsService();
