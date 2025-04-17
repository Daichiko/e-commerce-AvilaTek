import { IsString, IsOptional, MinLength } from "class-validator";

export class CreateRoleDto {
  @IsString({ message: "El nombre del rol debe ser una cadena de texto" })
  @MinLength(3, {
    message: "El nombre del rol debe tener al menos 3 caracteres",
  })
  name: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  @MinLength(5, { message: "La descripción debe tener al menos 5 caracteres" })
  description?: string;
}

export class UpdateRoleDto {
  @IsString({ message: "El nombre del rol debe ser una cadena de texto" })
  @MinLength(3, {
    message: "El nombre del rol debe tener al menos 3 caracteres",
  })
  @IsOptional()
  name?: string;

  @IsString({ message: "La descripción debe ser una cadena de texto" })
  @IsOptional()
  @MinLength(5, { message: "La descripción debe tener al menos 5 caracteres" })
  description?: string;
}

export class AssignRoleToUserDto {
  @IsString({ message: "El ID del usuario debe ser una cadena de texto" })
  userId: string;

  @IsString({ message: "El ID del rol debe ser una cadena de texto" })
  roleId: string;
}
