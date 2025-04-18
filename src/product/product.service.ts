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

  /**
   * Crea un nuevo producto.
   *
   * @param dto Datos del producto a crear.
   * @param userId ID del usuario que lo está creando.
   * @returns El producto creado.
   * @throws ApiError Si el DTO no es válido.
   */
  async create(dto: CreateProductDto, userId: string) {
    const dtoValidated = await validateDto(CreateProductDto, dto);
    return this.productRepository.create(dtoValidated, userId);
  }

  /**
   * Busca un producto por su ID.
   *
   * @param id ID del producto.
   * @returns El producto encontrado.
   * @throws ApiError Si el producto no existe.
   */
  async findById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ApiError("Producto no encontrado", 404, []);
    }
    return product;
  }

  /**
   * Actualiza un producto existente.
   *
   * @param id ID del producto.
   * @param dto Datos del producto a actualizar.
   * @param userId ID del usuario solicitante.
   * @returns El producto actualizado.
   * @throws ApiError Si el producto no existe o el usuario no tiene permisos.
   */
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

  /**
   * Elimina un producto si no ha sido utilizado en ninguna orden.
   *
   * @param id ID del producto.
   * @param userId ID del usuario solicitante.
   * @throws ApiError Si el producto no existe, tiene ordenes asociadas o el usuario no tiene permisos.
   */
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

  /**
   * Obtiene una lista paginada de productos con filtros opcionales.
   *
   * @param page Página actual (>=1).
   * @param size Cantidad de elementos por página.
   * @param filter Filtros opcionales por campos válidos.
   * @returns Lista de productos y total de coincidencias.
   * @throws ApiError Si los parámetros de paginación no son válidos.
   */
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

  /**
   * Agrega stock a un producto existente.
   *
   * @param id ID del producto.
   * @param dto DTO con la cantidad a agregar.
   * @param userId ID del usuario que realiza la acción.
   * @returns El producto actualizado con nuevo stock.
   * @throws ApiError Si el producto no existe o el usuario no tiene permisos.
   */
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
