import { PrismaClient } from "@prisma/client";
import { IOrderItemRepository } from "./IOrderItemRepository";
import { OrderItem } from "orderItem/repositories/orderItem.entity";

const prisma = new PrismaClient();

export class OrderItemRepositoryPrisma implements IOrderItemRepository {
  async create(data: OrderItem): Promise<OrderItem> {
    return await prisma.orderItem.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: string): Promise<OrderItem> {
    return await prisma.orderItem.findUnique({
      where: { id },
      include: { order: true },
    });
  }

  async findByIds(orderId: string, productId: string): Promise<OrderItem> {
    return await prisma.orderItem.findUnique({
      where: { orderId_productId: { orderId: orderId, productId: productId } },
      include: { order: true },
    });
  }

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

  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    return await prisma.orderItem.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.orderItem.delete({
      where: { id },
    });
  }
}
