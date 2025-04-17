import { IsUUID, IsInt, Min, IsOptional } from "class-validator";

export class CreateOrderItemDto {
  @IsUUID("4", { message: "El ID de la orden debe ser un UUID válido" })
  orderId: string;

  @IsUUID("4", { message: "El ID del producto debe ser un UUID válido" })
  productId: string;

  @IsInt({ message: "La cantidad debe ser un número entero" })
  @Min(1, { message: "La cantidad debe ser al menos 1" })
  cantidad: number;
}

export class UpdateOrderItemDto {
  @IsInt({ message: "La cantidad debe ser un número entero" })
  @Min(1, { message: "La cantidad debe ser al menos 1" })
  @IsOptional()
  cantidad?: number;
}
