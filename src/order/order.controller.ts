import { Request, Response } from "express";
import { OrderService } from "./order.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";
import { OrderStatus } from "../common/enum/orderStatus.enum";

@ClassErrorHandler
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const nuevaOrden = await this.orderService.create(req.body, userId);
    return res.status(201).json(nuevaOrden);
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const orden = await this.orderService.findById(req.params.id);
    return res.status(200).json(orden);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const ordenActualizada = await this.orderService.update(
      req.params.id,
      req.body,
      userId
    );
    return res.status(200).json(ordenActualizada);
  }

  async updateStatus(req: Request, res: Response): Promise<Response> {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({ message: "Estado de orden no válido" });
    }

    const orden = await this.orderService.updateStatus(orderId, status);
    return res.status(200).json({
      message: "Estado de la orden actualizado correctamente",
      orden,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    await this.orderService.delete(req.params.id, userId);
    return res.status(204).send();
  }

  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const table = await this.orderService.table(page, size, filter);
    return res.status(200).json(table);
  }
}
