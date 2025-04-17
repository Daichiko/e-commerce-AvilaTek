import { IsEmail, IsString, MinLength } from "class-validator";

export class loginDto {
  @IsEmail({}, { message: "Debe proporcionar un correo electrónico válido" })
  email: string;

  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres" })
  password: string;
}
