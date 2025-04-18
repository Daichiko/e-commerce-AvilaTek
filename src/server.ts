import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import env from "./common/config/config";
import { UsersRoutes } from "./users/users.routes";
import { RolesRoutes } from "./roles/roles.routes";
import { ProductsRoutes } from "./product/product.routes";
import { OrdersRoutes } from "./order/order.routes";
import { OrderItemRoutes } from "./orderItem/orderItem.routes";

// import swaggerUi from "swagger-ui-express";
// import swaggerJsdoc from "swagger-jsdoc";
// import { swaggerSpec } from "./swagger/swaggerConfig";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set("port", env.appConfig.port ?? 3000);
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: "*",
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    // this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // this.app.get("/api-docs.json", (req, res) => {
    //   res.setHeader("Content-Type", "application/json");
    //   res.send(swaggerSpec);
    // });

    // console.log(
    //   `Version 1 Docs are available on http://localhost:${env.appConfig.port}/api-docs`
    // );
  }

  importRoutesAutomatically(ControllerClass: any): void {
    const definedRoutes: any[] =
      Reflect.getMetadata("routes", ControllerClass.prototype) || [];

    const instance = new ControllerClass();

    definedRoutes.forEach((route) => {
      const path = `/api/${env.appConfig.apiVersion}${route.path}`;
      const method = route.method.toLowerCase();
      const handler = route.handler.map((fn: any) => fn.bind(instance));

      if (this.app[method]) {
        this.app[method](path, handler);
      } else {
        console.error(
          `Error: Method '${method}' is not valid for path '${path}'`
        );
      }
    });
  }

  routes(): void {
    this.app.get("/", (req, res) => {
      res.json({
        message: "Hello World",
      });
    });

    this.importRoutesAutomatically(UsersRoutes);
    this.importRoutesAutomatically(RolesRoutes);
    this.importRoutesAutomatically(ProductsRoutes);
    this.importRoutesAutomatically(OrdersRoutes);
    this.importRoutesAutomatically(OrderItemRoutes);
  }

  start(): void {
    this.app.listen(this.app.get("port"), () => {});
    console.log("Escuchando por el puerto ", this.app.get("port"));
  }
}

export default Server;
