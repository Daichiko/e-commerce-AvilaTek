import { Order } from "order/repositories/order.entity"; // Asegúrate de que la ubicación del entity sea correcta
import { CreateOrderDto, UpdateOrderDto } from "../dto/orderDto"; // DTOs que has creado

export interface IOrderRepository {
  create(data: CreateOrderDto, userId: string): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: Order[];
    count: number;
  }>;
  update(id: string, data: UpdateOrderDto): Promise<Order>;
  updateStatus(id: string, status: string): Promise<Order>;
  delete(id: string): Promise<void>;
}
