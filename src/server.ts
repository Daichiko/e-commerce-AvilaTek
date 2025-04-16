import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PostgresConnectionDB } from "./common/config/connectionDB";
import env from "./common/config/config";
import { usuariosRoutes } from "./usuarios/usuarios.routes";
import { glob } from "glob";
import path from "path";

// import swaggerUi from "swagger-ui-express";
// import swaggerJsdoc from "swagger-jsdoc";
// import { swaggerSpec } from "./swagger/swaggerConfig";

class Server {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.dbConnection().catch(() => {});
    this.routes();
  }

  async dbConnection(): Promise<void> {
    try {
      await PostgresConnectionDB.initialize();
    } catch (error) {
      console.log(error);
    }
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

    definedRoutes.forEach((route) => {
      const path = `/api${route.path}`;
      const method = route.method.toLowerCase();
      const handler = route.handler[0];

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

    this.importRoutesAutomatically(usuariosRoutes);
  }

  start(): void {
    this.app.listen(this.app.get("port"), () => {});
  }
}

export default Server;
