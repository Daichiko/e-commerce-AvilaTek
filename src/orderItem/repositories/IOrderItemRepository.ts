import { OrderItem } from "orderItem/repositories/orderItem.entity";

export interface IOrderItemRepository {
  create(data: Partial<OrderItem>): Promise<OrderItem>;
  table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: OrderItem[];
    count: number;
  }>;
  findById(id: string): Promise<OrderItem>;
  findByIds(orderId: string, productId: string): Promise<OrderItem>;
  update(id: string, data: Partial<OrderItem>): Promise<OrderItem>;
  delete(id: string): Promise<void>;
}
