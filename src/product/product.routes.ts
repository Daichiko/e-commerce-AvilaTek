import { Router } from "express";
import { Controller } from "../common/decorators/controllers.decorator";
import { Route } from "../common/decorators/routes.decorator";
import { VerifyToken } from "../common/decorators/verifyToken.decorator";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { ProductRepositoryPrisma } from "./repositories/ProductRepositoryPrisma";
import { authorize } from "../common/decorators/authorize.decorator";

@Controller("/products")
export class ProductsRoutes {
  public static router: Router;

  protected productRepository = new ProductRepositoryPrisma();
  protected productService = new ProductService(this.productRepository);
  protected productController = new ProductController(this.productService);

  @VerifyToken()
  @Route("/", "post")
  @authorize(["seller"])
  createProduct(req: any, res: any) {
    this.productController.create(req, res);
  }

  @VerifyToken()
  @Route("/table", "get")
  @authorize(["user", "seller"])
  getProductsTable(req: any, res: any) {
    this.productController.table(req, res);
  }

  @VerifyToken()
  @Route("/:id", "get")
  @authorize(["user", "seller"])
  getProductById(req: any, res: any) {
    this.productController.findById(req, res);
  }

  @VerifyToken()
  @Route("/add-stock/:id", "put")
  @authorize(["seller"])
  addStock(req: any, res: any) {
    this.productController.addStock(req, res);
  }

  @VerifyToken()
  @Route("/update/:id", "put")
  @authorize(["seller"])
  updateProduct(req: any, res: any) {
    this.productController.update(req, res);
  }

  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["seller"])
  deleteProduct(req: any, res: any) {
    this.productController.delete(req, res);
  }
}
