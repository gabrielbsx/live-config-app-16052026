import { ValidationException } from "@/domain/exception/validation.exception.js";
import type { Validation } from "@/presentation/contract/validation.js";
import { z, ZodType } from "zod";

export abstract class ZodValidation<
  TSchema extends ZodType,
> implements Validation<z.infer<TSchema>> {
  constructor(private readonly _schema: TSchema) {}

  validate(input: unknown): z.infer<TSchema> {
    const result = this._schema.safeParse(input);

    if (!result.success) {
      throw new ValidationException(result.error.message);
    }

    return result.data;
  }
}
