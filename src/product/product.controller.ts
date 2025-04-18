import { Request, Response } from "express";
import { ProductService } from "./product.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

/**
 * Controlador encargado de manejar las solicitudes HTTP relacionadas con productos.
 */
@ClassErrorHandler
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Crea un nuevo producto.
   *
   * @param req Objeto de solicitud HTTP.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta con el producto creado.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;
    const nuevoProducto = await this.productService.create(req.body, userId);
    return res.status(201).json(nuevoProducto);
  }

  /**
   * Obtiene un producto por su ID.
   *
   * @param req Objeto de solicitud HTTP con el ID del producto en los parámetros.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta con los datos del producto.
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const producto = await this.productService.findById(req.params.id);
    return res.status(200).json(producto);
  }

  /**
   * Actualiza un producto existente.
   *
   * @param req Objeto de solicitud HTTP con el ID del producto en los parámetros y datos en el cuerpo.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta con el producto actualizado.
   */
  async update(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;
    const productoActualizado = await this.productService.update(
      req.params.id,
      req.body,
      userId
    );
    return res.status(200).json(productoActualizado);
  }

  /**
   * Elimina un producto si cumple las condiciones necesarias.
   *
   * @param req Objeto de solicitud HTTP con el ID del producto en los parámetros.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta vacía con estado 204 si la eliminación fue exitosa.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;
    await this.productService.delete(req.params.id, userId);
    return res.status(204).send();
  }

  /**
   * Obtiene una tabla paginada de productos con filtros opcionales.
   *
   * @param req Objeto de solicitud HTTP con parámetros de paginación y filtros.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta con la lista paginada de productos.
   */
  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const table = await this.productService.table(page, size, filter);

    return res.status(200).json(table);
  }

  /**
   * Agrega stock a un producto existente.
   *
   * @param req Objeto de solicitud HTTP con el ID del producto y la cantidad a agregar en el cuerpo.
   * @param res Objeto de respuesta HTTP.
   * @returns Respuesta con mensaje de éxito y el producto actualizado.
   */
  async addStock(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;
    const result = await this.productService.addStock(
      req.params.id,
      req.body,
      userId
    );
    return res.status(200).json({
      message: "Stock actualizado correctamente",
      result,
    });
  }
}
