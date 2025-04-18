import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { formatValidationErrors } from "./validationFormmatter";
import { ApiError } from "../errors/apiError";

/**
 * Valida un objeto de entrada (`input`) contra una clase DTO usando class-validator.
 * Si la validación falla, lanza un `ApiError` con los detalles formateados.
 *
 * Esta función transforma el objeto plano en una instancia de la clase `dtoClass`
 * y luego aplica las reglas de validación definidas mediante decoradores.
 *
 * @template T - El tipo del DTO.
 * @param dtoClass - La clase del DTO con decoradores de validación.
 * @param input - El objeto de entrada a validar.
 * @returns Una promesa que resuelve con una instancia validada del DTO.
 * @throws {ApiError} Si la validación falla, incluyendo detalles de los errores.
 *
 * @example
 * ```ts
 * class CreateUserDto {
 *   @IsEmail()
 *   email: string;
 *
 *   @Length(6, 20)
 *   password: string;
 * }
 *
 * const data = { email: "test@example.com", password: "123456" };
 * const validatedData = await validateDto(CreateUserDto, data);
 * console.log(validatedData); // instancia de CreateUserDto
 * ```
 */
export async function validateDto<T extends object>(
  dtoClass: new () => T,
  input: object
): Promise<T> {
  const dtoInstance = plainToInstance(dtoClass, input);
  const errors = await validate(dtoInstance, { whitelist: true });

  if (errors.length > 0) {
    const details = formatValidationErrors(errors);
    throw new ApiError("Error en la validación de datos", 400, details);
  }

  return dtoInstance;
}
