export type Layer =
  | "Domain"
  | "Application"
  | "Infrastructure"
  | "Presentation";

export abstract class LayeredException extends Error {
  abstract readonly layer: Layer;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
