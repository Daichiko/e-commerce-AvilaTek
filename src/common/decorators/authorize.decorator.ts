import { NextFunction, Request, Response } from "express";

/**
 * Decorador que restringe el acceso a rutas según los roles del usuario autenticado.
 *
 * Este decorador verifica que el token decodificado (`TokenDecode`) contenga alguno de los
 * roles permitidos antes de ejecutar el método. Si el usuario no tiene los permisos necesarios,
 * responde con un error 403.
 *
 * @param roles - Lista de roles permitidos para acceder al método decorado.
 *
 * @example
 * ```ts
 * @authorize(["admin", "seller"])
 * async someProtectedMethod(req: Request, res: Response) {
 *   // Lógica ejecutada solo si el usuario tiene el rol adecuado
 * }
 * ```
 */
function authorize(roles: string[]): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const userRoles = req["TokenDecode"]?.roles;

      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({ message: "No roles found in token" });
      }

      const hasPermission = userRoles.some((role) => roles.includes(role));

      if (!hasPermission) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      return originalMethod.apply(this, [req, res, next]);
    };

    return descriptor;
  };
}

export { authorize };
