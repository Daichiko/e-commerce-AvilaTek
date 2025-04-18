import Jwt from "../utils/jwt";
import { Route } from "../interfaces/route.interface";
import { NextFunction, Response } from "express";
import "reflect-metadata";
import { RequestExt } from "../interfaces/resquestToken";

/**
 * Middleware que verifica la validez de un token JWT en la cabecera `Authorization`.
 *
 * Si el token es válido, se decodifica y se asigna a `req.TokenDecode`.
 * Si no es válido o no está presente, retorna un error 401.
 *
 * @param req - Objeto de solicitud extendido con `TokenDecode`.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función que llama al siguiente middleware.
 */
function verifyToken(req: RequestExt, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Token de acceso no encontrado" });
    return;
  }
  try {
    const decoded = Jwt.verify(token);
    req.TokenDecode = decoded;
    next();
    return;
  } catch (err) {
    res.status(401).send({ message: "Token invalido" });
    return;
  }
}

/**
 * Decorador de método que agrega verificación de token JWT al handler de una ruta.
 *
 * Se utiliza para proteger rutas que requieren autenticación. Añade el middleware
 * `verifyToken` al comienzo del array de middlewares de la ruta.
 *
 * @example
 * ```ts
 * @VerifyToken()
 * @Route("/profile", "get")
 * getProfile(req: RequestExt, res: Response) {
 *   // Solo accesible si el token es válido
 * }
 * ```
 *
 * @returns Decorador de método que modifica el arreglo de handlers para incluir la validación del token.
 */
export function VerifyToken(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes: Route[] =
      Reflect.getMetadata("routes", target.constructor.prototype) || [];

    const route = routes.find((route) =>
      route.handler.includes(descriptor.value)
    );

    if (route) {
      route.handler.unshift(verifyToken);
    }
  };
}
