export interface DomainEvent {
  readonly name: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly name: string,
    public readonly aggregateId: string,
  ) {
    this.occurredAt = new Date();
  }
}
