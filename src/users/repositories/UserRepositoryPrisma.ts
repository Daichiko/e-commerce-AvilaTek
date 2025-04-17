import { IUserRepository } from "./IUserRepository";
import { User, UserWithoutPassword } from "@entities/user.entity";
import { prisma } from "../../common/config/connectionDB";

export class UserRepositoryPrisma implements IUserRepository {
  async create(data: User): Promise<User> {
    return await prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User> {
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

  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: UserWithoutPassword[];
    count: number;
  }> {
    const validFilters = ["nombre", "email"];

    const where: any = {};

    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];

        where[key] = { contains: value, mode: "insensitive" };
      }
    }

    const [data, count] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, count };
  }

  async findById(id: string): Promise<UserWithoutPassword> {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
    });
  }

  async update(id: string, data: Partial<User>): Promise<UserWithoutPassword> {
    return await prisma.user.update({
      where: { id },
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await await prisma.user.delete({ where: { id } });
  }
}
