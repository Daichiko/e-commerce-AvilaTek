import Jwt from "../utils/jwt";
import { Route } from "../interfaces/route.interface";
import { NextFunction, Request, RequestHandler, Response } from "express";
import "reflect-metadata";

interface RequestExt extends Request {
  TokenDecode: any;
}

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
