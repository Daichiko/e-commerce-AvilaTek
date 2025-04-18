import { Request, Response } from "express";
import { OrderService } from "./order.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";
import { OrderStatus } from "../common/enum/orderStatus.enum";

/**
 * Controlador encargado de manejar las solicitudes HTTP relacionadas con las órdenes.
 */
@ClassErrorHandler
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Crea una nueva orden en el sistema.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns La nueva orden creada.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const nuevaOrden = await this.orderService.create(req.body, userId);
    return res.status(201).json(nuevaOrden);
  }

  /**
   * Obtiene una orden por su ID.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns La orden encontrada.
   * @throws ApiError Si la orden no se encuentra.
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const orden = await this.orderService.findById(req.params.id);
    return res.status(200).json(orden);
  }

  /**
   * Actualiza los datos de una orden existente.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns La orden actualizada.
   * @throws ApiError Si la orden no se encuentra o el usuario no tiene permisos.
   */
  async update(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    const ordenActualizada = await this.orderService.update(
      req.params.id,
      req.body,
      userId
    );
    return res.status(200).json(ordenActualizada);
  }

  /**
   * Actualiza el estado de una orden.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns El mensaje de éxito y la orden actualizada.
   * @throws ApiError Si el estado no es válido o la transición no es permitida.
   */
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

  /**
   * Elimina una orden del sistema.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns Estado 204 (sin contenido) si la orden fue eliminada.
   * @throws ApiError Si la orden no se encuentra o el usuario no tiene permisos.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req["TokenDecode"]?.id;

    await this.orderService.delete(req.params.id, userId);
    return res.status(204).send();
  }

  /**
   * Obtiene una lista de órdenes con paginación y filtros aplicados.
   *
   * @param req La solicitud HTTP.
   * @param res La respuesta HTTP.
   * @returns Una lista paginada de órdenes.
   * @throws ApiError Si los filtros de paginación no son válidos.
   */
  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;
    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const table = await this.orderService.table(page, size, filter);
    return res.status(200).json(table);
  }
}
