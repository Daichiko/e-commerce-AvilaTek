import { Route } from "../interfaces/route.interface";
import "reflect-metadata";

/**
 * Decorador de método que define una ruta HTTP para un controlador.
 *
 * Este decorador registra metadatos sobre el endpoint (ruta, método HTTP y handler) en la clase objetivo,
 * lo cual es útil para sistemas de enrutamiento personalizados donde las rutas se procesan dinámicamente.
 *
 * @param path - Ruta del endpoint relativa al prefijo del controlador (por ejemplo: "/create", "/:id").
 * @param method - Método HTTP asociado a la ruta ("get", "post", "patch", "put" o "delete").
 *
 * @example
 * ```ts
 * @Controller("/orders")
 * export class OrderRoutes {
 *   @Route("/", "post")
 *   createOrder(req: Request, res: Response) {
 *     // Ruta completa: POST /orders/
 *   }
 * }
 * ```
 */
export function Route(
  path: string,
  method: "get" | "post" | "patch" | "put" | "delete"
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const constructor = target.constructor;
    if (!constructor.instance) {
      constructor.instance = new constructor();
    }
    const routes: Route[] = Reflect.getMetadata("routes", target) || [];
    routes.push({
      path,
      method,
      handler: [descriptor.value],
    });
    Reflect.defineMetadata("routes", routes, target);
  };
}
