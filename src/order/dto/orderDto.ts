import { IsEnum, IsOptional, IsUUID, IsDateString } from "class-validator";
import { OrderStatus } from "@prisma/client";

export class CreateOrderDto {
  @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
  userId: string;

  @IsUUID("4", { message: "El ID del usuario debe ser un UUID válido" })
  sellerId: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: "La fecha debe tener un formato válido (ISO8601)" }
  )
  fechaPedido?: Date;
}

export class UpdateOrderDto {
  @IsDateString(
    {},
    { message: "La fecha debe tener un formato válido (ISO8601)" }
  )
  @IsOptional()
  fechaPedido?: Date;
}
