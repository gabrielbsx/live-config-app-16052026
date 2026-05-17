import z from "zod";
import { ZodValidation } from "./zod-validation.js";
import { positiveInt } from "./positive-int.utility.js";

export const zodPaginationValidationSchema = z.object({
  page: positiveInt("Page"),
  limit: positiveInt("Limit"),
});

export class ZodPaginationValidation extends ZodValidation<
  typeof zodPaginationValidationSchema
> {
  constructor() {
    super(zodPaginationValidationSchema);
  }
}
