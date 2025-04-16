// Define el decorador de montaje de rutas
import { RequestHandler, Router } from "express";
interface Route {
  path: string;
  method: "get" | "post" | "put" | "delete";
  handler: RequestHandler[];
}

export function Controller(routePrefix: string = ""): ClassDecorator {
  return function (target: any) {
    const router = Router();
    const routes: Route[] =
      Reflect.getMetadata("routes", target.prototype) || [];
    routes.forEach((route) => {
      route.path = `${routePrefix}${route.path}`;
    });

    return undefined;
  };
}
