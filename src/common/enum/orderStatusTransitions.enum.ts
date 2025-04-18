import { OrderStatus } from "@prisma/client";

export const OrderStatusTransitions = {
  [OrderStatus.CREACION_PEDIDO]: [OrderStatus.ESPERA_DISPONIBILIDAD],
  [OrderStatus.ESPERA_DISPONIBILIDAD]: [
    OrderStatus.PAGO_PENDIENTE,
    OrderStatus.CANCELADO_POR_VENDEDOR,
  ],
  [OrderStatus.CANCELADO_POR_VENDEDOR]: [],
  [OrderStatus.PAGO_PENDIENTE]: [OrderStatus.PROCESANDO],
  [OrderStatus.PROCESANDO]: [OrderStatus.ENVIADO],
  [OrderStatus.ENVIADO]: [OrderStatus.RECIBIDO],
  [OrderStatus.RECIBIDO]: [],
};
