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

/**
 * Clase que define y configura el servidor Express.
 *
 * La clase `Server` establece la configuración del servidor, maneja las rutas y
 * expone el servidor a través de un puerto determinado. Esta clase incluye las
 * configuraciones de middleware necesarias como `morgan` para logs, `cors` para
 * el manejo de peticiones entre dominios, y `express.json()` para manejar solicitudes
 * JSON, entre otras.
 */
class Server {
  public app: express.Application;

  /**
   * Constructor de la clase Server.
   * Inicializa el servidor Express y configura el servidor.
   */
  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  /**
   * Configura el servidor Express.
   *
   * Establece configuraciones como el puerto, los middlewares de logging, CORS,
   * y el parsing de cuerpo de las peticiones.
   */
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
  }

  /**
   * Importa y configura las rutas automáticamente para el controlador dado.
   *
   * Itera sobre las rutas definidas en el controlador y las añade al servidor Express.
   * Los controladores pueden tener rutas especificadas usando decoradores como `@Route`.
   *
   * @param ControllerClass - La clase del controlador que contiene las rutas a importar.
   */
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

  /**
   * Define las rutas básicas del servidor, incluyendo las rutas para cada
   * controlador y la ruta raíz.
   */
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

  /**
   * Inicia el servidor y lo pone a escuchar en el puerto configurado.
   *
   * Este método invoca el servidor Express y se queda escuchando las peticiones
   * en el puerto configurado.
   */
  start(): void {
    this.app.listen(this.app.get("port"), () => {});
    console.log("Escuchando por el puerto ", this.app.get("port"));
  }
}

export default Server;
