import "reflect-metadata";
import { Route } from "../interfaces/route.interface";

/**
 * Decorador de clase que asigna un prefijo común a todas las rutas definidas en un controlador.
 *
 * Este decorador busca la metadata de rutas asociada al prototipo de la clase (generalmente creada
 * mediante el decorador `@Route`) y antepone un prefijo común (`routePrefix`) a cada una de ellas.
 *
 * Es útil para estructurar rutas de manera modular, agrupando endpoints relacionados bajo una misma ruta base.
 *
 * @param routePrefix - Prefijo de ruta que se aplicará a todas las rutas de la clase. Por defecto es una cadena vacía.
 *
 * @example
 * ```ts
 * @Controller("/users")
 * export class UserRoutes {
 *   @Route("/", "get")
 *   getAllUsers(req: Request, res: Response) {
 *     // esta ruta será expuesta como GET /users/
 *   }
 * }
 * ```
 */
export function Controller(routePrefix: string = ""): ClassDecorator {
  return function (target: any) {
    const routes: Route[] =
      Reflect.getMetadata("routes", target.prototype) || [];
    routes.forEach((route) => {
      route.path = `${routePrefix}${route.path}`;
    });
  };
}
