import { OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { OrderStatus as AppOrderStatus } from "../../common/enum/orderStatus.enum";
import { ApiError } from "../../common/errors/apiError";

export function mapPrismaStatusToAppStatus(
  prismaStatus: PrismaOrderStatus
): AppOrderStatus {
  switch (prismaStatus) {
    case PrismaOrderStatus.CREACION_PEDIDO:
      return AppOrderStatus.CREACION_PEDIDO;
    case PrismaOrderStatus.ESPERA_DISPONIBILIDAD:
      return AppOrderStatus.ESPERA_DISPONIBILIDAD;
    case PrismaOrderStatus.CANCELADO_POR_VENDEDOR:
      return AppOrderStatus.CANCELADO_POR_VENDEDOR;
    case PrismaOrderStatus.PAGO_PENDIENTE:
      return AppOrderStatus.PAGO_PENDIENTE;
    case PrismaOrderStatus.PROCESANDO:
      return AppOrderStatus.PROCESANDO;
    case PrismaOrderStatus.ENVIADO:
      return AppOrderStatus.ENVIADO;
    case PrismaOrderStatus.RECIBIDO:
      return AppOrderStatus.RECIBIDO;
    default:
      throw new ApiError("Status de orden no encontrado", 404, []);
  }
}
