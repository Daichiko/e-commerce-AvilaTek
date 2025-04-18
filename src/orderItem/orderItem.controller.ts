import { Request, Response } from "express";
import { OrderItemService } from "./orderItem.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const nuevaOrdenItem = await this.orderItemService.create(req.body);
    return res.status(201).json(nuevaOrdenItem);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const ordenItemActualizado = await this.orderItemService.update(
      req.params.id,
      req.body
    );
    return res.status(200).json(ordenItemActualizado);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await this.orderItemService.delete(req.params.id);
    return res.status(204).send();
  }

  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;

    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const result = await this.orderItemService.table(page, size, filter);
    return res.status(200).json(result);
  }
}
