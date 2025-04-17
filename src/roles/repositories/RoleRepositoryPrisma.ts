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

  async delete(id: string) {
    await prisma.role.delete({
      where: { id },
    });
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

  async findRolesByUserId(userId: string): Promise<UserRole[]> {
    console.log("userId: ", userId);
    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
    });

    return userRoles;
  }

  async findRoleNamesByUserId(userId: string): Promise<string[]> {
    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
    });

    const roles = [];

    for (const userRole of userRoles) {
      const role = await prisma.role.findUnique({
        where: { id: userRole.roleId },
      });
      roles.push(role);
    }

    return roles.map((r) => r.name);
  }
}
