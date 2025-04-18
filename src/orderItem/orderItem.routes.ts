import { Router } from "express";
import { Controller } from "../common/decorators/controllers.decorator";
import { Route } from "../common/decorators/routes.decorator";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";
import { OrderItemService } from "./orderItem.service";
import { OrderItemController } from "./orderItem.controller";
import { OrderItemRepositoryPrisma } from "./repositories/OrderItemRepositoryPrisma";
import { authorize } from "../common/decorators/authorize.decorator";
import { ProductRepositoryPrisma } from "../product/repositories/ProductRepositoryPrisma";
import { OrderRepositoryPrisma } from "../order/repositories/OrderRepositoryPrisma";

/**
 * Rutas relacionadas con los items de orden.
 * Gestiona las solicitudes HTTP y mapea las rutas a sus respectivos controladores.
 */
@Controller("/order-items")
export class OrderItemRoutes {
  public static router: Router;

  protected orderItemRepository = new OrderItemRepositoryPrisma();
  protected productRepository = new ProductRepositoryPrisma();
  protected orderRepository = new OrderRepositoryPrisma();

  protected orderItemService = new OrderItemService(
    this.orderItemRepository,
    this.orderRepository,
    this.productRepository
  );
  protected orderItemController = new OrderItemController(
    this.orderItemService
  );

  /**
   * Crea un nuevo item pertenciente a una orden/pedido.
   *
   * @param req - La solicitud HTTP que contiene los datos del nuevo item de orden.
   * @param res - La respuesta HTTP donde se devolverá el item de orden creado.
   * @returns La respuesta HTTP con el item de orden creado.
   */
  @VerifyToken()
  @Route("/", "post")
  @authorize(["user"])
  createOrderItem(req: any, res: any) {
    this.orderItemController.create(req, res);
  }

  /**
   * Actualiza un item de un pedido existente.
   *
   * @param req - La solicitud HTTP que contiene los datos actualizados del item de orden.
   * @param res - La respuesta HTTP donde se devolverá el item de orden actualizado.
   * @returns La respuesta HTTP con el item de orden actualizado.
   */
  @VerifyToken()
  @Route("/:id", "put")
  @authorize(["user", "seller"])
  updateOrderItem(req: any, res: any) {
    this.orderItemController.update(req, res);
  }

  /**
   * Elimina un item de un pedido.
   *
   * @param req - La solicitud HTTP que contiene el ID del item de orden a eliminar.
   * @param res - La respuesta HTTP que indica el resultado de la eliminación.
   * @returns La respuesta HTTP con un código de estado 204 para indicar que el item de orden fue eliminado.
   */
  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["user"])
  deleteOrderItem(req: any, res: any) {
    this.orderItemController.delete(req, res);
  }

  /**
   * Obtiene una lista paginada de items relacionados con un pedido específico.
   *
   * @param req - La solicitud HTTP que contiene los parámetros de paginación y el ID de la orden.
   * @param res - La respuesta HTTP donde se devolverán los items de orden.
   * @returns La respuesta HTTP con los items de orden de la orden especificada.
   */
  @VerifyToken()
  @Route("/:orderId/table", "get")
  @authorize(["user", "seller", "admin"])
  getOrderItemsTable(req: any, res: any) {
    this.orderItemController.table(req, res);
  }
}
