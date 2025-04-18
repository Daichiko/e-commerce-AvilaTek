import { OrderStatus } from "@prisma/client";

export class Order {
  id: string;
  userId: string;
  sellerId: string;
  fechaPedido: Date;
  status: OrderStatus;
}
