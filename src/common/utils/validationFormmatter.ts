/**
 * Formatea los errores de validación devueltos por `class-validator` en una lista de mensajes legibles.
 *
 * Esta función recorre los errores de validación y extrae los mensajes de las constraints.
 * Si hay errores anidados (children), los procesa recursivamente.
 *
 * @param errors - Un arreglo de errores de validación generados por `class-validator`.
 * @returns Un arreglo de strings con mensajes de error legibles.
 *
 * @example
 * ```ts
 * const errors = [
 *   {
 *     property: "email",
 *     constraints: {
 *       isEmail: "El email no es válido"
 *     }
 *   },
 *   {
 *     property: "password",
 *     constraints: {
 *       minLength: "La contraseña debe tener al menos 6 caracteres"
 *     }
 *   }
 * ];
 *
 * const messages = formatValidationErrors(errors);
 * console.log(messages);
 * // ["El email no es válido", "La contraseña debe tener al menos 6 caracteres"]
 * ```
 */
export function formatValidationErrors(errors: any[]): string[] {
  return errors.flatMap((error) =>
    error.constraints
      ? Object.values(error.constraints)
      : error.children?.length
      ? formatValidationErrors(error.children)
      : []
  );
}
