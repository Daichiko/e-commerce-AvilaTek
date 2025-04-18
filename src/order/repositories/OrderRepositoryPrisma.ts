import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "./IOrderRepository";
import { Order } from "order/repositories/order.entity";
import { OrderStatus } from "../../common/enum/orderStatus.enum";

const prisma = new PrismaClient();

export class OrderRepositoryPrisma implements IOrderRepository {
  /**
   * Crea una nueva orden en la base de datos.
   *
   * @param data Datos de la nueva orden.
   * @param userId ID del usuario que realiza la orden.
   * @returns La orden creada.
   */
  async create(data: Order, userId: string): Promise<Order> {
    return await prisma.order.create({
      data: {
        ...data,
        userId: userId,
        status: OrderStatus.CREACION_PEDIDO,
      },
    });
  }

  /**
   * Busca una orden por su ID.
   *
   * @param id ID de la orden.
   * @returns La orden encontrada o null si no existe.
   */
  async findById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { product: true } } },
    });
  }

  /**
   * Obtiene una lista de órdenes con paginación y filtros.
   *
   * @param page Número de página para la paginación.
   * @param size Tamaño de la página.
   * @param filter Filtros de búsqueda como `userId`, `status`, `fechaInicio`, y `fechaFin`.
   * @returns Un objeto con las órdenes encontradas y el total de órdenes.
   */
  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Order[];
    count: number;
  }> {
    const validFilters = ["userId", "status", "fechaInicio", "fechaFin"];

    const where: any = {};

    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];

        if (key === "status") {
          where[key] = value.toUpperCase();
        } else if (key === "fechaInicio" || key === "fechaFin") {
          const formattedDate = new Date(value);

          if (key === "fechaInicio" && value) {
            where.fechaPedido = {
              ...(where.fechaPedido || {}),
              gte: formattedDate,
            };
          }

          if (key === "fechaFin" && value) {
            where.fechaPedido = {
              ...(where.fechaPedido || {}),
              lte: formattedDate,
            };
          }
        } else {
          where[key] = value;
        }
      }
    }

    const [data, count] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.order.count({ where }),
    ]);

    return { data, count };
  }

  /**
   * Actualiza los datos de una orden.
   *
   * @param id ID de la orden a actualizar.
   * @param data Datos a actualizar en la orden.
   * @returns La orden actualizada.
   */
  async update(id: string, data: Partial<Order>): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data,
    });
  }

  /**
   * Actualiza el estado de una orden.
   *
   * @param id ID de la orden a la cual se le actualizará el estado.
   * @param status Nuevo estado de la orden.
   * @returns La orden con el estado actualizado.
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }

  /**
   * Elimina una orden de la base de datos.
   *
   * @param id ID de la orden a eliminar.
   */
  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }
}
