import { Request, Response } from "express";
import { ProductService } from "./product.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const nuevoProducto = await this.productService.create(req.body, userId);
    return res.status(201).json(nuevoProducto);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const producto = await this.productService.findById(req.params.id);
    return res.status(200).json(producto);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const productoActualizado = await this.productService.update(
      req.params.id,
      req.body,
      userId
    );
    return res.status(200).json(productoActualizado);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    await this.productService.delete(req.params.id, userId);
    return res.status(204).send();
  }

  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const table = await this.productService.table(page, size, filter);

    return res.status(200).json(table);
  }

  async addStock(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;
    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

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
