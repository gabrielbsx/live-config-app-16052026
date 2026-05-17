import z from "zod";

type PositiveIntOptions = Readonly<{ max?: number }>;

export const positiveInt = (field: string, options: PositiveIntOptions = {}) => {
  let schema = z
    .coerce
    .number()
    .int()
    .positive({ message: `${field} must be a positive integer` });

  if (options.max !== undefined) {
    schema = schema.max(options.max, {
      message: `${field} must be <= ${options.max}`,
    });
  }
  return schema;
};
