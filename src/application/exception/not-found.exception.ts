import { ApplicationException } from "./application.exception.js";

export class NotFoundException extends ApplicationException {
  public readonly resource: string;
  public readonly resourceId: string;

  constructor(resource: string, id: string) {
    super(`${resource} not found`);
    this.resource = resource;
    this.resourceId = id;
  }
}
