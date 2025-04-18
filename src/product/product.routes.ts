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

  /**
   * Ruta para crear un nuevo producto.
   * Requiere autenticación y rol de "seller".
   *
   * @param req Solicitud HTTP con los datos del producto.
   * @param res Respuesta HTTP con el producto creado.
   */
  @VerifyToken()
  @Route("/", "post")
  @authorize(["seller"])
  createProduct(req: any, res: any) {
    this.productController.create(req, res);
  }

  /**
   * Ruta para obtener una tabla de productos con paginación y filtros.
   * Disponible para usuarios autenticados con rol "user" o "seller".
   *
   * @param req Solicitud HTTP con parámetros de paginación y filtros.
   * @param res Respuesta HTTP con los productos paginados.
   */
  @VerifyToken()
  @Route("/table", "get")
  @authorize(["user", "seller"])
  getProductsTable(req: any, res: any) {
    this.productController.table(req, res);
  }

  /**
   * Ruta para obtener un producto específico por su ID.
   * Disponible para usuarios autenticados con rol "user" o "seller".
   *
   * @param req Solicitud HTTP con el ID del producto como parámetro.
   * @param res Respuesta HTTP con los datos del producto.
   */
  @VerifyToken()
  @Route("/:id", "get")
  @authorize(["user", "seller"])
  getProductById(req: any, res: any) {
    this.productController.findById(req, res);
  }

  /**
   * Ruta para agregar stock a un producto existente.
   * Requiere autenticación y rol de "seller".
   *
   * @param req Solicitud HTTP con el ID del producto y la cantidad a agregar.
   * @param res Respuesta HTTP con el producto actualizado.
   */
  @VerifyToken()
  @Route("/add-stock/:id", "put")
  @authorize(["seller"])
  addStock(req: any, res: any) {
    this.productController.addStock(req, res);
  }

  /**
   * Ruta para actualizar un producto existente.
   * Requiere autenticación y rol de "seller".
   *
   * @param req Solicitud HTTP con el ID del producto y los datos actualizados.
   * @param res Respuesta HTTP con el producto actualizado.
   */
  @VerifyToken()
  @Route("/update/:id", "put")
  @authorize(["seller"])
  updateProduct(req: any, res: any) {
    this.productController.update(req, res);
  }

  /**
   * Ruta para eliminar un producto.
   * Requiere autenticación y rol de "seller".
   *
   * @param req Solicitud HTTP con el ID del producto a eliminar.
   * @param res Respuesta HTTP indicando el estado de la eliminación.
   */
  @VerifyToken()
  @Route("/:id", "delete")
  @authorize(["seller"])
  deleteProduct(req: any, res: any) {
    this.productController.delete(req, res);
  }
}
