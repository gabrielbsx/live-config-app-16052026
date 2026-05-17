import z from "zod";
import { ZodValidation } from "./zod-validation.js";
import { positiveInt } from "./positive-int.utility.js";

export const PAGINATION_LIMITS = {
  PAGE_MAX: 10_000,
  LIMIT_MAX: 100,
} as const;

export const zodPaginationValidationSchema = z.object({
  page: positiveInt("Page", { max: PAGINATION_LIMITS.PAGE_MAX }),
  limit: positiveInt("Limit", { max: PAGINATION_LIMITS.LIMIT_MAX }),
});

export class ZodPaginationValidation extends ZodValidation<
  typeof zodPaginationValidationSchema
> {
  constructor() {
    super(zodPaginationValidationSchema);
  }
}
