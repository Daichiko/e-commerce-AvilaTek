import { Router } from "express";
import { Controller } from "../common/decorators/controllers.decorator";
import { Route } from "../common/decorators/routes.decorator";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderRepositoryPrisma } from "./repositories/OrderRepositoryPrisma";
import { authorize } from "../common/decorators/authorize.decorator";
import { UserRepositoryPrisma } from "../users/repositories/UserRepositoryPrisma";
import { ProductRepositoryPrisma } from "../product/repositories/ProductRepositoryPrisma";

/**
 * Controlador de rutas para manejar las operaciones relacionadas con las órdenes.
 */
@Controller("/orders")
export class OrdersRoutes {
  public static router: Router;

  protected orderRepository = new OrderRepositoryPrisma();
  protected userRepository = new UserRepositoryPrisma();
  protected productRepository = new ProductRepositoryPrisma();

  protected orderService = new OrderService(
    this.orderRepository,
    this.userRepository,
    this.productRepository
  );
  protected orderController = new OrderController(this.orderService);

  /**
   * Ruta para crear una nueva orden.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns La nueva orden creada.
   */
  @VerifyToken()
  @Route("/", "post")
  @authorize(["user"])
  createOrder(req: any, res: any) {
    this.orderController.create(req, res);
  }

  /**
   * Ruta para obtener una tabla de órdenes con paginación y filtros.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns Una lista de órdenes con paginación y filtros aplicados.
   */
  @VerifyToken()
  @Route("/table", "get")
  @authorize(["user", "seller", "admin"])
  getOrdersTable(req: any, res: any) {
    this.orderController.table(req, res);
  }

  /**
   * Ruta para obtener una orden por su ID.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns La orden encontrada.
   */
  @VerifyToken()
  @Route("/:id", "get")
  @authorize(["user", "seller", "admin"])
  getOrderById(req: any, res: any) {
    this.orderController.findById(req, res);
  }

  /**
   * Ruta para actualizar el estado de una orden.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns El mensaje de éxito y la orden con el estado actualizado.
   * @throws ApiError Si el estado no es válido o la transición no es permitida.
   */
  @VerifyToken()
  @Route("/update-status/:id", "put")
  @authorize(["seller"])
  updateOrderStatus(req: any, res: any) {
    this.orderController.updateStatus(req, res);
  }

  /**
   * Ruta para eliminar una orden.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns Estado 204 (sin contenido) si la orden fue eliminada.
   * @throws ApiError Si la orden no se encuentra o el usuario no tiene permisos.
   */
  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["seller", "user"])
  deleteOrder(req: any, res: any) {
    this.orderController.delete(req, res);
  }
}
