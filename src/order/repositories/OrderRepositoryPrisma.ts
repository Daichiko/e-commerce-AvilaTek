import { PrismaClient } from "@prisma/client";
import { IOrderRepository } from "./IOrderRepository";
import { Order } from "@entities/order.entity";
import { OrderStatus } from "../../common/enum/orderStatus.enum";

const prisma = new PrismaClient();

export class OrderRepositoryPrisma implements IOrderRepository {
  async create(data: Order, userId: string): Promise<Order> {
    return await prisma.order.create({
      data: {
        ...data,
        userId: userId,
        status: OrderStatus.CREACION_PEDIDO,
      },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await prisma.order.findUnique({
      where: { id },
      include: { orderItems: { include: { product: true } } },
    });
  }

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

  async update(id: string, data: Partial<Order>): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }
}
