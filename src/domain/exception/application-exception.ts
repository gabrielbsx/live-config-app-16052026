export class ApplicationException extends Error {
  public layer = "Application";

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
