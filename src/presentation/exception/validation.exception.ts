export class ValidationException extends Error {
  public readonly layer = "Presentation";

  constructor(
    message: string,
    public readonly issues?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
