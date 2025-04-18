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

  @VerifyToken()
  @Route("/", "post")
  @authorize(["user", "seller", "admin"])
  createOrderItem(req: any, res: any) {
    this.orderItemController.create(req, res);
  }

  @VerifyToken()
  @Route("/:id", "put")
  @authorize(["user", "seller", "admin"])
  updateOrderItem(req: any, res: any) {
    this.orderItemController.update(req, res);
  }

  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["seller"])
  deleteOrderItem(req: any, res: any) {
    this.orderItemController.delete(req, res);
  }

  @VerifyToken()
  @Route("/:orderId/table", "get")
  @authorize(["user", "seller", "admin"])
  getOrderItemsTable(req: any, res: any) {
    this.orderItemController.table(req, res);
  }
}
