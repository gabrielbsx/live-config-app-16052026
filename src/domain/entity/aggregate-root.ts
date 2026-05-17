import type { DomainEvent } from "../event/domain-event.js";
import { Entity, type EntityProps } from "./entity.js";

export class AggregateRoot<TProps extends EntityProps> extends Entity<TProps> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  pullDomainEvents(): readonly DomainEvent[] {
    const events = this._domainEvents;
    this._domainEvents = [];
    return events;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }
}
