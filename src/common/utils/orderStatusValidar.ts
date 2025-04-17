import { OrderStatus } from "@prisma/client";
import { OrderStatusTransitions } from "../enum/orderStatusTransitions.enum";

export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const validTransitions = OrderStatusTransitions[currentStatus];
  return validTransitions ? validTransitions.includes(newStatus) : false;
}
