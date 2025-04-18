import { PrismaClient } from "@prisma/client";
import { IOrderItemRepository } from "./IOrderItemRepository";
import { OrderItem } from "orderItem/repositories/orderItem.entity";

const prisma = new PrismaClient();

/**
 * Implementación del repositorio de OrderItem utilizando Prisma.
 * Contiene métodos para realizar operaciones CRUD sobre los elementos de la orden.
 */
export class OrderItemRepositoryPrisma implements IOrderItemRepository {
  /**
   * Crea un nuevo item de orden.
   *
   * @param data - Datos del item de orden a crear.
   * @returns El item de orden creado.
   */
  async create(data: OrderItem): Promise<OrderItem> {
    return await prisma.orderItem.create({
      data: {
        ...data,
      },
    });
  }

  /**
   * Busca un item de orden por su ID.
   *
   * @param id - ID del item de orden a buscar.
   * @returns El item de orden encontrado o null si no existe.
   */
  async findById(id: string): Promise<OrderItem> {
    return await prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  /**
   * Busca un item de orden por los IDs de la orden y el producto.
   *
   * @param orderId - ID de la orden a la que pertenece el item.
   * @param productId - ID del producto del item.
   * @returns El item de orden encontrado o null si no existe.
   */
  async findByIds(orderId: string, productId: string): Promise<OrderItem> {
    return await prisma.orderItem.findUnique({
      where: { orderId_productId: { orderId: orderId, productId: productId } },
      include: { order: true },
    });
  }

  /**
   * Obtiene una lista de items de orden con paginación y filtros opcionales.
   *
   * @param page - Página de la paginación.
   * @param size - Número de elementos por página.
   * @param filter - Filtros opcionales para la búsqueda.
   * @returns Un objeto con los datos de los items de orden y el número total de elementos.
   */
  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: OrderItem[];
    count: number;
  }> {
    const validFilters = ["orderId"];

    const where: any = {};

    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];
        where[key] = value;
      }
    }

    const [data, count] = await Promise.all([
      prisma.orderItem.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.orderItem.count({ where }),
    ]);

    return { data, count };
  }

  /**
   * Actualiza un item de orden existente.
   *
   * @param id - ID del item de orden a actualizar.
   * @param data - Datos a actualizar en el item de orden.
   * @returns El item de orden actualizado.
   */
  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    return await prisma.orderItem.update({
      where: { id },
      data,
    });
  }

  /**
   * Elimina un item de orden.
   *
   * @param id - ID del item de orden a eliminar.
   * @returns Void.
   */
  async delete(id: string): Promise<void> {
    await prisma.orderItem.delete({
      where: { id },
    });
  }
}
