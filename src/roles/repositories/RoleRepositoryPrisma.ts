import { PrismaClient } from "@prisma/client";
import { IRoleRepository } from "./IRoleRepository";
import { Role } from "roles/repositories/roles.entity";
import { UserRole } from "roles/repositories/userRole.entity";

const prisma = new PrismaClient();

export class RoleRepositoryPrisma implements IRoleRepository {
  /**
   * Crea un nuevo rol en la base de datos.
   *
   * @param data Los datos del rol a crear.
   * @returns El rol creado.
   */
  async create(data: Role): Promise<Role> {
    return await prisma.role.create({ data });
  }

  /**
   * Busca un rol por su ID.
   *
   * @param id El ID del rol a buscar.
   * @returns El rol encontrado o `null` si no existe.
   */
  async findById(id: string) {
    return await prisma.role.findUnique({
      where: { id },
    });
  }

  /**
   * Busca un rol por su nombre.
   *
   * @param name El nombre del rol a buscar.
   * @returns El rol encontrado o `null` si no existe.
   */
  async findByName(name: string) {
    return await prisma.role.findUnique({
      where: { name },
    });
  }

  /**
   * Obtiene todos los roles existentes en la base de datos.
   *
   * @returns Una lista de todos los roles.
   */
  async findAll() {
    return await prisma.role.findMany();
  }

  /**
   * Obtiene una lista de roles con paginación y filtrado.
   *
   * @param page El número de página para la paginación.
   * @param size La cantidad de elementos por página.
   * @param filter Los filtros para aplicar en la búsqueda (por ejemplo, nombre o descripción).
   * @returns Un objeto que contiene la lista de roles y el total de registros.
   */
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

    // Aplica los filtros definidos
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

  /**
   * Asigna un rol a un usuario.
   *
   * @param data Los datos que contienen el ID del usuario y el ID del rol a asignar.
   * @returns El registro de la relación entre el usuario y el rol.
   */
  async assignRoleToUser(data: UserRole): Promise<UserRole> {
    return await prisma.userRoles.create({
      data: {
        userId: data.userId,
        roleId: data.roleId,
      },
    });
  }

  /**
   * Elimina un rol de un usuario.
   *
   * @param data Los datos que contienen el ID del usuario y el ID del rol a eliminar.
   * @returns Una promesa que se resuelve cuando el rol se elimina.
   */
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

  /**
   * Obtiene todos los roles asignados a un usuario.
   *
   * @param userId El ID del usuario para consultar sus roles.
   * @returns Una lista de roles asignados al usuario.
   */
  async findRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await prisma.userRoles.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

    return userRoles.map((r) => r.role);
  }

  /**
   * Verifica si un usuario tiene un rol específico.
   *
   * @param userId El ID del usuario.
   * @param roleId El ID del rol a verificar.
   * @returns El registro de la relación de usuario y rol, o `null` si no existe.
   */
  async findRolesByIds(userId: string, roleId: string): Promise<UserRole> {
    const userRoles = await prisma.userRoles.findUnique({
      where: { userId_roleId: { userId, roleId } },
    });

    return userRoles;
  }

  /**
   * Obtiene los nombres de los roles asignados a un usuario.
   *
   * @param userId El ID del usuario para consultar los nombres de sus roles.
   * @returns Una lista de los nombres de los roles asignados al usuario.
   */
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
