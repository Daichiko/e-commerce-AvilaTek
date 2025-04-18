import { OrderStatus } from "@prisma/client";
import { OrderStatusTransitions } from "../enum/orderStatusTransitions.enum";

/**
 * Valida si una transición de estado de una orden es permitida.
 *
 * Utiliza la configuración de transiciones válidas definida en `OrderStatusTransitions`
 * para verificar si se puede pasar del `currentStatus` al `newStatus`.
 *
 * @param currentStatus - El estado actual de la orden.
 * @param newStatus - El nuevo estado al que se desea transicionar.
 * @returns `true` si la transición es válida, de lo contrario `false`.
 *
 * @example
 * ```ts
 * // Una transición válida: de CREACION_PEDIDO a ESPERA_DISPONIBILIDAD
 * const esValido1 = isValidStatusTransition(
 *   OrderStatus.CREACION_PEDIDO,
 *   OrderStatus.ESPERA_DISPONIBILIDAD
 * );
 * console.log(esValido1); // true
 *
 * // Una transición no válida: de ENVIADO a PROCESANDO
 * const esValido2 = isValidStatusTransition(
 *   OrderStatus.ENVIADO,
 *   OrderStatus.PROCESANDO
 * );
 * console.log(esValido2); // false
 * ```
 */
export function isValidStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const validTransitions = OrderStatusTransitions[currentStatus];
  return validTransitions ? validTransitions.includes(newStatus) : false;
}
