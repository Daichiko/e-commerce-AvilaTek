import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  @IsOptional()
  nombre?: string;

  @IsEmail({}, { message: "Debe proporcionar un correo electrónico válido" })
  @IsOptional()
  email?: string;
}
