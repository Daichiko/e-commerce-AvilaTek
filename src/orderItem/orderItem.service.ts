import { IOrderItemRepository } from "./repositories/IOrderItemRepository";
import { CreateOrderItemDto, UpdateOrderItemDto } from "./dto/orderItemsDto";
import { ApiError } from "../common/errors/apiError";
import { validateDto } from "../common/utils/validateDto";
import { OrderItem } from "@entities/orderItem.entity";
import { OrderStatus, OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { IOrderRepository } from "../order/repositories/IOrderRepository";
import { IProductRepository } from "../product/repositories/IProductRepository";

export class OrderItemService {
  constructor(
    private orderItemRepository: IOrderItemRepository,
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
  ) {}

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
      throw new ApiError("ya el producto se encuentra en el pedido", 404, []);
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
        "No se puede cargar un producto a un pedido que no este en borrador",
        400,
        []
      );
    }

    return this.orderItemRepository.create(dtoValidated);
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const dtoValidated = await validateDto(UpdateOrderItemDto, dto);

    return this.orderItemRepository.update(id, dtoValidated);
  }

  async delete(id: string): Promise<void> {
    const existingItem = await this.orderItemRepository.findById(id);

    if (!existingItem) {
      throw new ApiError("Item de orden no encontrado", 404, []);
    }

    if (existingItem["order"].status !== PrismaOrderStatus.CREACION_PEDIDO) {
      throw new ApiError(
        "No se puede eliminar un item de un pedido que ya paso el estatus de creacion de pedido",
        404,
        []
      );
    }

    await this.orderItemRepository.delete(id);
  }

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
