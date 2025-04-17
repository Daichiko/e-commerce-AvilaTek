export function isValidISODate(dateStr: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
  return isoRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
}
