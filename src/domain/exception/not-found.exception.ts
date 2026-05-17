import { DomainException } from "./domain.exception.js";

export class NotFoundException extends DomainException {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
  }
}
