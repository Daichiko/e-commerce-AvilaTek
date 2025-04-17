import { NextFunction, Request, Response } from "express";

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
