/**
 * Verifica si una cadena de texto representa una fecha válida en formato ISO (YYYY-MM-DD).
 *
 * Esta función valida si la fecha proporcionada tiene el formato correcto y si es una fecha válida.
 * El formato esperado es el estándar ISO 8601: `YYYY-MM-DD`.
 *
 * @param dateStr La cadena de texto que representa la fecha a verificar.
 * @returns `true` si la cadena de texto es una fecha válida en formato ISO, de lo contrario, `false`.
 *
 * @example
 * const isValid = isValidISODate("2025-04-17");
 * console.log(isValid); // true
 *
 * const isInvalid = isValidISODate("2025-04-31");
 * console.log(isInvalid); // false
 */
export function isValidISODate(dateStr: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
}
