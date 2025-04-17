import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "./IProductRepository";
import { Product } from "@entities/product.entity";
import { ApiError } from "../../common/errors/apiError";

const prisma = new PrismaClient();

export class ProductRepositoryPrisma implements IProductRepository {
  async create(data: Product, userId: string): Promise<Product> {
    return await prisma.product.create({
      data: {
        ...data,
        userId: userId,
        disponible: data.stock > 0,
      },
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true },
    });
  }

  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Product[];
    count: number;
  }> {
    const validFilters = ["nombre", "descripcion", "disponible", "userId"];

    const where: any = {};

    for (const key in filter) {
      if (validFilters.includes(key)) {
        const value = filter[key];

        if (key === "disponible") {
          where[key] = value === "true";
        } else if (key === "userId") {
          where[key] = value;
        } else {
          where[key] = { contains: value, mode: "insensitive" };
        }
      }
    }

    const [data, count] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.product.count({ where }),
    ]);

    return { data, count };
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const { stock, ...rest } = data;

    const updateData: Partial<Product> = {
      ...rest,
    };

    if (stock) {
      updateData.stock = stock;
      updateData.disponible = stock > 0;
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  async addStock(id: string, quantity: number): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const updatedStock = product.stock + quantity;

    return await prisma.product.update({
      where: { id },
      data: {
        stock: updatedStock,
        disponible: updatedStock > 0,
      },
    });
  }

  async updateStockWithValidation(
    orderItems: { productId: string; cantidad: number }[]
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      for (const item of orderItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new ApiError(
            `Producto con ID ${item.productId} no encontrado`,
            404,
            []
          );
        }

        const newStock = product.stock - item.cantidad;

        if (newStock < 0) {
          throw new ApiError(
            `Stock insuficiente para producto ${product.id}. Disponible: ${product.stock}, solicitado: ${item.cantidad}`,
            400,
            []
          );
        }

        await tx.product.update({
          where: { id: product.id },
          data: { stock: newStock },
        });
      }
    });
  }
}
