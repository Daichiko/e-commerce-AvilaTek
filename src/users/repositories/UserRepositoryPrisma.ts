import { IUserRepository } from "./IUserRepository";
import { User, UserWithoutPassword } from "@entities/user.entity";
import { prisma } from "../../common/config/connectionDB";

export class UserRepositoryPrisma implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        UserRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findAll(
    page: number,
    size: number
  ): Promise<UserWithoutPassword[] | null> {
    return await prisma.user.findMany({
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
      skip: (page - 1) * size,
      take: size,
    });
  }

  async findById(id: string): Promise<UserWithoutPassword | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return await prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await await prisma.user.delete({ where: { id } });
  }
}
