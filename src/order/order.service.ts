import { IOrderRepository } from "./repositories/IOrderRepository";
import { CreateOrderDto, UpdateOrderDto } from "./dto/orderDto";
import { ApiError } from "../common/errors/apiError";
import { validateDto } from "../common/utils/validateDto";
import { OrderStatus } from "../common/enum/orderStatus.enum";
import { OrderItem, OrderStatus as PrismaOrderStatus } from "@prisma/client";
import { isValidStatusTransition } from "../common/utils/orderStatusValidar";
import { mapPrismaStatusToAppStatus } from "../common/utils/mapPrismaStatusToAppStatus";
import { isValidISODate } from "../common/utils/isValidISODate";
import { IUserRepository } from "../users/repositories/IUserRepository";
import { IProductRepository } from "../product/repositories/IProductRepository";

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private userRepository: IUserRepository,
    private productRepository: IProductRepository
  ) {}

  async create(dto: CreateOrderDto, userId: string) {
    const dtoValidated = await validateDto(CreateOrderDto, dto);

    const user = await this.userRepository.findById(dtoValidated.userId);

    if (!user) {
      throw new ApiError("Usuario no encontrado", 404, []);
    }

    const seller = await this.userRepository.findById(dtoValidated.sellerId);

    if (!seller) {
      throw new ApiError("Vendedor no encontrado", 404, []);
    }

    return this.orderRepository.create(dtoValidated, userId);
  }

  async findById(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new ApiError("Orden no encontrada", 404, []);
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto, userId: string) {
    const dtoValidated = await validateDto(UpdateOrderDto, dto);

    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new ApiError("Orden no encontrada", 404, []);
    }

    if (existing.userId !== userId) {
      throw new ApiError("No tienes permisos para editar esta orden", 403, []);
    }

    if (existing.status !== OrderStatus.CREACION_PEDIDO) {
      throw new ApiError(
        "No se puede actualizar una orden que no esté en estado CREACION_PEDIDO",
        400,
        []
      );
    }

    return this.orderRepository.update(id, dtoValidated);
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new ApiError("Orden no encontrada", 404, []);
    }

    const prismaStatusOrder = mapPrismaStatusToAppStatus(status);

    const isTransitionValid = isValidStatusTransition(
      order.status,
      prismaStatusOrder
    );

    if (!isTransitionValid) {
      throw new ApiError(
        `No se puede cambiar el estado de ${order.status} a ${status}. Transición no permitida.`,
        400,
        []
      );
    }

    if (prismaStatusOrder === PrismaOrderStatus.PAGO_PENDIENTE) {
      await this.updateProducts(order["orderItems"]);
    }

    return this.orderRepository.updateStatus(id, prismaStatusOrder);
  }

  private async updateProducts(orderItems: OrderItem[]) {
    const orders = orderItems.map((item) => ({
      productId: item["product"].id,
      cantidad: item.cantidad,
    }));

    try {
      await this.productRepository.updateStockWithValidation(orders);
    } catch (error) {
      throw new ApiError(
        "La existencia de uno de los stock no es suficiente",
        404,
        []
      );
    }
  }

  async delete(id: string, userId: string) {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new ApiError("Orden no encontrada", 404, []);
    }

    if (order.userId !== userId) {
      throw new ApiError(
        "No tienes permisos para eliminar esta orden",
        403,
        []
      );
    }

    await this.orderRepository.delete(id);
  }

  async table(page: number, size: number, filter: any) {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginación no son válidos", 400, []);
    }

    const { fechaInicio, fechaFin, status } = filter;

    if (fechaInicio && !isValidISODate(fechaInicio)) {
      throw new ApiError(
        "El formato de fechaInicio no es válido. Debe ser YYYY-MM-DD",
        400,
        []
      );
    }

    if (fechaFin && !isValidISODate(fechaFin)) {
      throw new ApiError(
        "El formato de fechaFin no es válido. Debe ser YYYY-MM-DD",
        400,
        []
      );
    }

    if (status) {
      if (!Object.values(OrderStatus).includes(status)) {
        throw new ApiError(
          `El estado '${status}' no es válido. Debe ser uno de: ${Object.values(
            OrderStatus
          ).join(", ")}`,
          400,
          []
        );
      }
      filter["status"] = mapPrismaStatusToAppStatus(status);
    }

    return this.orderRepository.table(page, size, filter);
  }
}
