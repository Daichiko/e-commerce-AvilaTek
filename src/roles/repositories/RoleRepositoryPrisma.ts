import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "./IRoleRepository";
import { Role } from "@entities/roles.entity";
import { UserRole } from "@entities/userRole.entity";

const prisma = new PrismaClient();

export class RoleRepositoryPrisma implements IRoleRepository {
  async create(data: Role): Promise<Role> {
    return await prisma.role.create({ data });
  }

  async findById(id: string) {
    return await prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return await prisma.role.findUnique({
      where: { name },
    });
  }

  async findAll() {
    return await prisma.role.findMany();
  }

  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Role[];
    count: number;
  }> {
    const validFilters = ["name", "description"];

    const where: any = {};

    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];

        where[key] = { contains: value, mode: "insensitive" };
      }
    }

    const [data, count] = await Promise.all([
      prisma.role.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.role.count({ where }),
    ]);

    return { data, count };
  }

  async assignRoleToUser(data: UserRole): Promise<UserRole> {
    return await prisma.userRoles.create({
      data: {
        userId: data.userId,
        roleId: data.roleId,
      },
    });
  }

  async removeRoleFromUser(data: UserRole): Promise<void> {
    await prisma.userRoles.delete({
      where: {
        userId_roleId: {
          userId: data.userId,
          roleId: data.roleId,
        },
      },
    });
  }

  async findRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map((r) => r.role);
  }

  async findRolesByIds(userId: string, roleId: string): Promise<UserRole> {
    const userRoles = await prisma.userRoles.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });

    return userRoles;
  }

  async findRoleNamesByUserId(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map((r) => r.role.name);
  }
}
