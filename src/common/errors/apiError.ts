/**
 * Representa un error personalizado para ser utilizado en respuestas de API.
 *
 * Extiende la clase base `Error` e incluye un código de estado HTTP y detalles adicionales
 * que pueden ser útiles para el cliente o para depuración.
 *
 * @example
 * ```ts
 * throw new ApiError("Usuario no encontrado", 404);
 *
 * throw new ApiError("Validación fallida", 400, [
 *   "El email no es válido",
 *   "La contraseña es obligatoria"
 * ]);
 * ```
 */
export class ApiError extends Error {
  /** Código de estado HTTP asociado al error. */
  statusCode: number;

  /** Detalles adicionales sobre el error, como mensajes de validación. */
  details: any;

  /**
   * Crea una nueva instancia de ApiError.
   *
   * @param message - Mensaje descriptivo del error.
   * @param statusCode - Código de estado HTTP correspondiente.
   * @param details - (Opcional) Detalles adicionales relacionados con el error.
   */
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }
}
