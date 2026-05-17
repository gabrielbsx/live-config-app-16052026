export class InfrastructureException extends Error {
  public layer = "Infrastructure";

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
