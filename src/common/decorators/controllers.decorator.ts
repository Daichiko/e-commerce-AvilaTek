import "reflect-metadata";
import { Route } from "../interfaces/route.interface";

export function Controller(routePrefix: string = ""): ClassDecorator {
  return function (target: any) {
    const routes: Route[] =
      Reflect.getMetadata("routes", target.prototype) || [];
    routes.forEach((route) => {
      route.path = `${routePrefix}${route.path}`;
    });
  };
}
