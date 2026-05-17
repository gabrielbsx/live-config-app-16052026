import { z } from "zod";
import { ZodValidation } from "./zod-validation.js";

export const zodPlayerIdParamSchema = z.object({
  id: z.string().uuid("id must be a valid UUID"),
});

export class ZodPlayerIdValidation extends ZodValidation<
  typeof zodPlayerIdParamSchema
> {
  constructor() {
    super(zodPlayerIdParamSchema);
  }
}
