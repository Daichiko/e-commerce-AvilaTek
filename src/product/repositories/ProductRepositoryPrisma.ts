import { PrismaClient } from "@prisma/client";
import { IProductRepository } from "./IProductRepository";
import { Product } from "product/repositories/product.entity";
import { ApiError } from "../../common/errors/apiError";

const prisma = new PrismaClient();

export class ProductRepositoryPrisma implements IProductRepository {
  /**
   * Crea un nuevo producto en la base de datos.
   *
   * @param data Datos del producto.
   * @param userId ID del usuario creador.
   * @returns El producto creado.
   */
  async create(data: Product, userId: string): Promise<Product> {
    return await prisma.product.create({
      data: {
        ...data,
        userId: userId,
        disponible: data.stock > 0,
      },
    });
  }

  /**
   * Busca un producto por su ID.
   *
   * @param id ID del producto.
   * @returns El producto encontrado o `null` si no existe.
   */
  async findById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true },
    });
  }

  /**
   * Devuelve una tabla paginada de productos, con posibilidad de aplicar filtros.
   *
   * @param page Página actual.
   * @param size Cantidad de elementos por página.
   * @param filter Filtros a aplicar: nombre, descripcion, disponible, userId.
   * @returns Un objeto con la lista de productos y el conteo total.
   */
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

  /**
   * Actualiza los datos de un producto.
   *
   * @param id ID del producto.
   * @param data Datos parciales para actualizar.
   * @returns El producto actualizado.
   */
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

  /**
   * Elimina un producto por su ID.
   *
   * @param id ID del producto a eliminar.
   */
  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  /**
   * Agrega stock a un producto específico.
   *
   * @param id ID del producto.
   * @param quantity Cantidad de stock a agregar.
   * @returns El producto con el nuevo stock actualizado.
   * @throws Error Si el producto no existe.
   */
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

  /**
   * Valida y actualiza el stock de los productos al realizar una orden.
   *
   * @param orderItems Lista de productos con su cantidad solicitada.
   * @throws ApiError Si un producto no existe o no hay suficiente stock.
   */
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
          data: { stock: newStock, disponible: newStock > 0 },
        });
      }
    });
  }
}
