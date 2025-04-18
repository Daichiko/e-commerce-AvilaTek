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

  @VerifyToken()
  @Route("/", "post")
  @authorize(["user"])
  createOrder(req: any, res: any) {
    this.orderController.create(req, res);
  }

  @VerifyToken()
  @Route("/table", "get")
  @authorize(["user", "seller", "admin"])
  getOrdersTable(req: any, res: any) {
    this.orderController.table(req, res);
  }

  @VerifyToken()
  @Route("/:id", "get")
  @authorize(["user", "seller", "admin"])
  getOrderById(req: any, res: any) {
    this.orderController.findById(req, res);
  }

  @VerifyToken()
  @Route("/update/:id", "put")
  @authorize(["user", "seller"])
  updateOrder(req: any, res: any) {
    this.orderController.update(req, res);
  }

  @VerifyToken()
  @Route("/update-status/:id", "put")
  @authorize(["seller"])
  updateOrderStatus(req: any, res: any) {
    this.orderController.updateStatus(req, res);
  }

  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["seller"])
  deleteOrder(req: any, res: any) {
    this.orderController.delete(req, res);
  }
}
