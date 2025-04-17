import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "El nombre debe ser una cadena de texto" })
  @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
  nombre: string;

  @IsEmail({}, { message: "Debe proporcionar un correo electrónico válido" })
  email: string;

  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  password: string;
}
