import { Route } from "../interfaces/route.interface";
import "reflect-metadata";

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
    const instance = constructor.instance;

    const routes: Route[] = Reflect.getMetadata("routes", target) || [];
    routes.push({
      path,
      method,
      handler: [descriptor.value.bind(instance)],
    });
    Reflect.defineMetadata("routes", routes, target);
  };
}
