export class ValidationException extends Error {
  layer = "presentation";

  constructor(message: string) {
    super(message);
    this.name = "ValidationException";
  }
}
