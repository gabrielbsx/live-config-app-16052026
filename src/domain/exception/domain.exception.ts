export class DomainException extends Error {
  public layer = "Domain";

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }

  static ensure(condition: unknown, message: string): asserts condition {
    if (!condition) throw new DomainException(message);
  }
}
