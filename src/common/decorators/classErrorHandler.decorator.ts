import { ApiError } from "../errors/apiError";
import { Request, Response } from "express";

/**
 * Decorador de clase para manejar errores automáticamente en todos los métodos asíncronos del controlador.
 *
 * Este decorador intercepta todos los métodos definidos en la clase decorada, envolviéndolos en un bloque
 * `try/catch`. Si ocurre un error, se responde adecuadamente:
 * - Si el error es una instancia de `ApiError`, se envía el código de estado y detalles correspondientes.
 * - Si es otro tipo de error, se responde con un error genérico 500.
 *
 * También registra el error en la consola para facilitar el debugging.
 *
 * @param constructor - El constructor de la clase objetivo.
 *
 * @example
 * ```ts
 * @ClassErrorHandler
 * export class UserController {
 *   async getUser(req: Request, res: Response) {
 *     // cualquier error lanzado aquí será capturado por el decorador
 *   }
 * }
 * ```
 */
export default function ClassErrorHandler(constructor: Function) {
  const methods = Object.getOwnPropertyNames(constructor.prototype);

  methods.forEach((method) => {
    const originalMethod = constructor.prototype[method];

    if (typeof originalMethod === "function") {
      constructor.prototype[method] = async function (
        req: Request,
        res: Response,
        ...args: any[]
      ) {
        try {
          const result = await originalMethod.apply(this, [req, res, ...args]);
          return result;
        } catch (error) {
          console.error(
            `Error en ${constructor.name}.${method}:`,
            error.message
          );

          if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
              message: error.message,
              details: error.details ?? [],
            });
          }

          return res.status(500).json({
            message: "Error interno del servidor",
          });
        }
      };
    }
  });
}
