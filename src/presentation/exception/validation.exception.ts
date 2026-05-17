import {
  LayeredException,
  type Layer,
} from "@/domain/exception/layered.exception.js";
import type { ZodIssue } from "zod";

export class ValidationException extends LayeredException {
  readonly layer: Layer = "Presentation";

  constructor(
    message: string,
    public readonly issues?: readonly ZodIssue[],
  ) {
    super(message);
  }
}
