import {
  IsString,
  IsNumber,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
  MinLength,
  IsUUID,
} from "class-validator";

export class CreateProductDto {
  @IsString({ message: "El nombre del producto debe ser una cadena de texto" })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres" })
  nombre: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @MinLength(5, { message: "La descripción debe tener al menos 5 caracteres" })
  descripcion: string;

  @IsNumber({}, { message: "El precio debe ser un número" })
  @Min(0, { message: "El precio no puede ser negativo" })
  precio: number;

  @IsInt({ message: "El stock debe ser un número entero" })
  @Min(0, { message: "El stock no puede ser negativo" })
  stock: number;
}

export class UpdateProductDto {
  @IsString({ message: "El nombre del producto debe ser una cadena de texto" })
  @MinLength(2, { message: "El nombre debe tener al menos 2 caracteres" })
  @IsOptional()
  nombre?: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @MinLength(5, { message: "La descripción debe tener al menos 5 caracteres" })
  @IsOptional()
  descripcion?: string;

  @IsNumber({}, { message: "El precio debe ser un número" })
  @Min(0, { message: "El precio no puede ser negativo" })
  @IsOptional()
  precio?: number;

  @IsInt({ message: "El stock debe ser un número entero" })
  @Min(0, { message: "El stock no puede ser negativo" })
  @IsOptional()
  stock?: number;
}

export class AddStockDto {
  @IsNumber({}, { message: "La cantidad debe ser un número" })
  @Min(1, { message: "La cantidad debe ser mayor a 0" })
  quantity: number;
}
