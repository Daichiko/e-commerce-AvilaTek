import { OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { OrderStatus as AppOrderStatus } from "../../common/enum/orderStatus.enum";
import { ApiError } from "../../common/errors/apiError";

/**
 * Mapea un estado de orden de Prisma a un estado de orden de la aplicación.
 *
 * Esta función toma un estado de orden en formato Prisma (`PrismaOrderStatus`) y lo mapea a un estado
 * correspondiente en la aplicación (`AppOrderStatus`). Si el estado no se encuentra, se lanza un error `ApiError`.
 *
 * @param prismaStatus El estado de orden en formato Prisma que se desea mapear.
 * @returns El estado de orden correspondiente en formato de la aplicación (`AppOrderStatus`).
 *
 * @throws {ApiError} Si el estado de orden proporcionado no es válido o no se encuentra en el `switch`.
 *
 * @example
 * const prismaStatus = PrismaOrderStatus.PAGO_PENDIENTE;
 * const appStatus = mapPrismaStatusToAppStatus(prismaStatus);
 * console.log(appStatus); // PAGO_PENDIENTE
 */
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
