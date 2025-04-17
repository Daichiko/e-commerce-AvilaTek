export function formatValidationErrors(errors: any[]): string[] {
  return errors.flatMap((error) =>
    error.constraints
      ? Object.values(error.constraints)
      : error.children?.length
      ? formatValidationErrors(error.children)
      : []
  );
}
