import { Product } from "@entities/product.entity";

export interface IProductRepository {
  create(data: Partial<Product>, userId: string): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Product[];
    count: number;
  }>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  addStock(id: string, quantity: number): Promise<Product>;
  updateStockWithValidation(
    orderItems: { productId: string; cantidad: number }[]
  ): Promise<void>;
}
