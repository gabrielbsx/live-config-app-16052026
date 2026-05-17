import { ApplicationException } from "./application.exception.js";

export class NotFoundException extends ApplicationException {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
  }
}
