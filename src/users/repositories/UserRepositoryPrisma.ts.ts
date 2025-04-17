import { IUserRepository } from "./IUserRepository";
import { User } from "@entities/user.entity";
import { prisma } from "../../common/config/connectionDB";

export class UserRepositoryPrisma implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[] | null> {
    return await prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await await prisma.user.delete({ where: { id } });
  }
}
