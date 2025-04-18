import { Request, Response } from "express";
import { OrderItemService } from "./orderItem.service";
import ClassErrorHandler from "../common/decorators/classErrorHandler.decorator";

@ClassErrorHandler
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  /**
   * Crea un nuevo item de orden.
   *
   * @param req - La solicitud HTTP que contiene los datos del nuevo item de orden.
   * @param res - La respuesta HTTP donde se devolverá el item de orden creado.
   * @returns La respuesta HTTP con el item de orden creado.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const nuevaOrdenItem = await this.orderItemService.create(req.body);
    return res.status(201).json(nuevaOrdenItem);
  }

  /**
   * Actualiza un item de orden existente.
   *
   * @param req - La solicitud HTTP que contiene los datos actualizados del item de orden.
   * @param res - La respuesta HTTP donde se devolverá el item de orden actualizado.
   * @returns La respuesta HTTP con el item de orden actualizado.
   */
  async update(req: Request, res: Response): Promise<Response> {
    const ordenItemActualizado = await this.orderItemService.update(
      req.params.id,
      req.body
    );
    return res.status(200).json(ordenItemActualizado);
  }

  /**
   * Elimina un item de orden.
   *
   * @param req - La solicitud HTTP que contiene el ID del item de orden a eliminar.
   * @param res - La respuesta HTTP que indica el resultado de la eliminación.
   * @returns La respuesta HTTP con un código de estado 204 para indicar que el item de orden fue eliminado.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    await this.orderItemService.delete(req.params.id);
    return res.status(204).send();
  }

  /**
   * Obtiene una lista paginada de items de orden, con filtros opcionales.
   *
   * @param req - La solicitud HTTP que contiene los parámetros de paginación y los filtros.
   * @param res - La respuesta HTTP donde se devolverán los items de orden.
   * @returns La respuesta HTTP con los items de orden paginados.
   */
  async table(req: Request, res: Response): Promise<Response> {
    const { pageQuery, sizeQuery, ...filter } = req.query;

    const page = pageQuery ? parseInt(pageQuery as string, 10) : 1;
    const size = sizeQuery ? parseInt(sizeQuery as string, 10) : 10;

    const result = await this.orderItemService.table(page, size, filter);
    return res.status(200).json(result);
  }
}
