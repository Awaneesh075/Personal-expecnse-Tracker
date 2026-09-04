import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export class TransactionRepository {
  async create(data: Prisma.TransactionUncheckedCreateInput) {
    return await prisma.transaction.create({ data });
  }

  async findByUserId(userId: string) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: { category: true },
    });
  }

  async findById(id: string) {
    return await prisma.transaction.findUnique({ where: { id } });
  }
}

export const transactionRepository = new TransactionRepository();
