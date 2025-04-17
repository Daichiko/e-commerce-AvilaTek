import { ApiError } from "../errors/apiError";
import { Request, Response } from "express";

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
