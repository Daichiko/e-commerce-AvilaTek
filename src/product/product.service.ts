import { IProductRepository } from "./repositories/IProductRepository";
import {
  AddStockDto,
  CreateProductDto,
  UpdateProductDto,
} from "./dto/productDto";
import { validateDto } from "../common/utils/validateDto";
import { ApiError } from "../common/errors/apiError";

export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async create(dto: CreateProductDto, userId: string) {
    const dtoValidated = await validateDto(CreateProductDto, dto);
    return this.productRepository.create(dtoValidated, userId);
  }
  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ApiError("Producto no encontrado", 404, []);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto, userId: string) {
    const dtoValidated = await validateDto(UpdateProductDto, dto);

    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new ApiError("Producto no encontrado", 404, []);
    }

    if (existing.userId !== userId) {
      throw new ApiError(
        "No tienes permisos para editar este producto",
        403,
        []
      );
    }

    return this.productRepository.update(id, dtoValidated);
  }

  async delete(id: string, userId: string) {
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new ApiError("Producto no encontrado", 404, []);
    }

    if (existing.userId !== userId) {
      throw new ApiError(
        "No tienes permisos para eliminar este producto",
        403,
        []
      );
    }

    if (existing["orderItems"].length > 0) {
      throw new ApiError(
        "No puedes eliminar un producto que ya forma parte de una orden",
        400,
        []
      );
    }

    await this.productRepository.delete(id);
  }

  async table(
    page: number,
    size: number,
    filter: any
  ): Promise<{
    data: any[];
    count: number;
  }> {
    if (page <= 0 || size <= 0) {
      throw new ApiError("Los datos de paginación no son válidos", 400, []);
    }

    return this.productRepository.table(page, size, filter);
  }

  async addStock(id: string, dto: AddStockDto, userId: string) {
    const dtoValidated = await validateDto(AddStockDto, dto);

    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new ApiError("Producto no encontrado", 404, []);
    }

    if (existing.userId !== userId) {
      throw new ApiError(
        "No tienes permisos para editar este producto",
        403,
        []
      );
    }

    return this.productRepository.addStock(id, dtoValidated.quantity);
  }
}
