export interface DomainEvent {
  readonly name: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly version: number;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly name: string,
    public readonly aggregateId: string,
    public readonly version: number = 1,
  ) {
    this.occurredAt = new Date();
  }
}
