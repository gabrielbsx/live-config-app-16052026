import { DomainException } from "./domain.exception.js";

export class LevelCapExceededException extends DomainException {
  constructor(cap: number) {
    super(`Level cap exceeded (max ${cap})`);
  }
}
