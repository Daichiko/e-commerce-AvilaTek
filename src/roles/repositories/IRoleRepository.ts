import { UserRole } from "roles/repositories/userRole.entity";
import { Role } from "@prisma/client";

export interface IRoleRepository {
  create(data: Partial<Role>): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Role[];
    count: number;
  }>;
  assignRoleToUser(data: UserRole): Promise<UserRole>;
  removeRoleFromUser(data: UserRole): Promise<void>;
  findRolesByUserId(userId: string): Promise<Role[]>;
  findRolesByIds(userId: string, roleId: string): Promise<UserRole>;
  findRoleNamesByUserId(userId: string): Promise<string[]>;
}
