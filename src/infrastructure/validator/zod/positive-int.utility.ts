import z from "zod";

export const positiveInt = (field: string) =>
  z.coerce
    .number()
    .int()
    .positive({ message: `${field} must be a positive integer` });
