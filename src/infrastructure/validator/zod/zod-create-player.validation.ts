import { z } from "zod";
import { ZodValidation } from "./zod-validation.js";

export const zodCreatePlayerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().min(1, "Nickname is required"),
  level: z.number().int().positive("Level must be a positive integer"),
  evolution: z.string().min(1, "Evolution is required"),
});

export class ZodCreatePlayerValidation extends ZodValidation<
  typeof zodCreatePlayerValidationSchema
> {
  constructor() {
    super(zodCreatePlayerValidationSchema);
  }
}
