export class DomainException extends Error {
  public layer = "Domain";

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
