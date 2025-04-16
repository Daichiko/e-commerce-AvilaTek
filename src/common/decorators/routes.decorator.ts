import { RequestHandler } from "express";
import "reflect-metadata";
// Define una interfaz para representar una ruta
interface Route {
  path: string;
  method: "get" | "post" | "patch" | "put" | "delete";
  handler: RequestHandler[];
}

// Define el decorador de ruta
export function Route(
  path: string,
  method: "get" | "post" | "patch" | "put" | "delete"
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const routes: Route[] = Reflect.getMetadata("routes", target) || [];
    routes.push({
      path,
      method,
      handler: [descriptor.value.bind(new target.constructor())],
    });
    Reflect.defineMetadata("routes", routes, target);
  };
}
