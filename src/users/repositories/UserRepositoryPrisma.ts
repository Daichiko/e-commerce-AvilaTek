import { IUserRepository } from "./IUserRepository";
import { User, UserWithoutPassword } from "users/repositories/user.entity";
import { prisma } from "../../common/config/connectionDB";

export class UserRepositoryPrisma implements IUserRepository {
  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * @param data Los datos del usuario a crear.
   * @returns El usuario creado con su información completa.
   */
  async create(data: User): Promise<UserWithoutPassword> {
    return await prisma.user.create({
      data,
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
    });
  }

  /**
   * Busca un usuario por su correo electrónico.
   *
   * @param email El correo electrónico del usuario a buscar.
   * @returns El usuario correspondiente al correo electrónico, incluyendo los roles del usuario.
   */
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

  /**
   * Recupera una lista de usuarios paginados con filtro opcional.
   *
   * @param page El número de página para la paginación.
   * @param size El número de elementos por página.
   * @param filter Filtros opcionales a aplicar en la búsqueda (ej. "nombre", "email").
   * @returns Un objeto con los usuarios encontrados y el número total de registros.
   */
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

    // Aplica los filtros a la búsqueda.
    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];
        where[key] = { contains: value, mode: "insensitive" };
      }
    }

    // Recupera los datos paginados y el conteo total de usuarios con los filtros aplicados.
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

  /**
   * Encuentra un usuario por su ID.
   *
   * @param id El ID del usuario a buscar.
   * @returns El usuario sin la contraseña.
   */
  async findById(id: string): Promise<UserWithoutPassword> {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
    });
  }

  /**
   * Actualiza un usuario por su ID.
   *
   * @param id El ID del usuario a actualizar.
   * @param data Los datos a actualizar en el usuario.
   * @returns El usuario actualizado sin la contraseña.
   */
  async update(id: string, data: Partial<User>): Promise<UserWithoutPassword> {
    return await prisma.user.update({
      where: { id },
      select: { id: true, nombre: true, email: true, fechaCreacion: true },
      data,
    });
  }

  /**
   * Elimina un usuario por su ID.
   *
   * @param id El ID del usuario a eliminar.
   * @returns Void, no retorna nada.
   */
  async delete(id: string): Promise<void> {
    await await prisma.user.delete({ where: { id } });
  }
}
