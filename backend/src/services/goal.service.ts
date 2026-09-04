import prisma from '../config/db';

export class GoalService {
  async getGoalProgress(userId: string, goalId: string) {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId, userId }
    });

    if (!goal) throw { statusCode: 404, message: 'Goal not found' };

    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    
    // Calculate required monthly savings
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const monthsRemaining = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());
    
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const requiredMonthlySaving = monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;

    return {
      ...goal,
      progressPercentage: percentage,
      monthsRemaining,
      requiredMonthlySaving
    };
  }
}

export const goalService = new GoalService();
