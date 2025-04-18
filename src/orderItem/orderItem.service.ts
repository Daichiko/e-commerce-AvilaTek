import { IOrderItemRepository } from "./repositories/IOrderItemRepository";
import { CreateOrderItemDto, UpdateOrderItemDto } from "./dto/orderItemsDto";
import { ApiError } from "../common/errors/apiError";
import { validateDto } from "../common/utils/validateDto";
import { OrderItem } from "orderItem/repositories/orderItem.entity";
import { OrderStatus, OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { IOrderRepository } from "../order/repositories/IOrderRepository";
import { IProductRepository } from "../product/repositories/IProductRepository";

export class OrderItemService {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

  /**
   * Crea un nuevo item de orden en un pedido específico.
   *
   * @param dto - Objeto que contiene la información para crear el item de orden.
   * @returns El item de orden creado.
   * @throws ApiError Si la orden o el producto no existen, si el producto ya está en el pedido,
   * o si el pedido no está en estado de "Creación de pedido".
   */
  async create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const dtoValidated = await validateDto(CreateOrderItemDto, dto);

    const order = await this.orderRepository.findById(dtoValidated.orderId);

    if (!order) {
      throw new ApiError("Orden no encontrada", 404, []);
    }

    const product = await this.productRepository.findById(
      dtoValidated.productId
    );

    if (!product) {
      throw new ApiError("Producto no encontrado", 404, []);
    }

    const orderItem = await this.orderItemRepository.findByIds(
      order.id,
      product.id
    );

    if (orderItem) {
      throw new ApiError("Ya el producto se encuentra en el pedido", 404, []);
    }

    if (product.userId !== order.sellerId) {
      throw new ApiError(
        "No puede cargar un producto de otro vendedor al pedido",
        404,
        []
      );
    }

    if (order.status !== OrderStatus.CREACION_PEDIDO) {
      throw new ApiError(
        "No se puede cargar un producto a un pedido que no esté en borrador",
        400,
        []
      );
    }

    return this.orderItemRepository.create(dtoValidated);
  }

  /**
   * Actualiza un item de orden existente.
   *
   * @param id - ID del item de orden a actualizar.
   * @param dto - Datos a actualizar en el item de orden.
   * @returns El item de orden actualizado.
   */
  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const dtoValidated = await validateDto(UpdateOrderItemDto, dto);

    return this.orderItemRepository.update(id, dtoValidated);
  }

  /**
   * Elimina un item de orden.
   *
   * @param id - ID del item de orden a eliminar.
   * @returns Void.
   * @throws ApiError Si el item no existe o si el pedido ya no está en estado "Creación de pedido".
   */
  async delete(id: string): Promise<void> {
    const existingItem = await this.orderItemRepository.findById(id);

    if (!existingItem) {
      throw new ApiError("Item de orden no encontrado", 404, []);
    }

    if (existingItem["order"].status !== PrismaOrderStatus.CREACION_PEDIDO) {
      throw new ApiError(
        "No se puede eliminar un item de un pedido que ya pasó el estatus de creación de pedido",
        404,
        []
      );
    }

    await this.orderItemRepository.delete(id);
  }

  /**
   * Obtiene una lista de items de orden con paginación y filtros opcionales.
   *
   * @param page - Página de la paginación.
   * @param size - Número de elementos por página.
   * @param filter - Filtros opcionales para la búsqueda de items de orden.
   * @returns Un objeto con los datos de los items de orden y el número total de elementos.
   * @throws ApiError Si los datos de paginación no son válidos.
   */
  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: OrderItem[];
    count: number;
  }> {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginación no son válidos", 400, []);
    }

    return this.orderItemRepository.table(page, size, filter);
  }
}
