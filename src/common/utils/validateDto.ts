import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { formatValidationErrors } from "./validationFormmatter";
import { ApiError } from "../errors/apiError";

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
