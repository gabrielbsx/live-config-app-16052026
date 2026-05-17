import { LayeredException, type Layer } from "./layered.exception.js";

export class DomainException extends LayeredException {
  readonly layer: Layer = "Domain";

  static ensure(condition: unknown, message: string): asserts condition {
    if (!condition) throw new DomainException(message);
  }
}
