import prisma from '../config/db';
import { Prisma } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }
}

export const userRepository = new UserRepository();
