import type { Actor } from "./actor.js";
import type { DomainEvent } from "../event/domain-event.js";
import {
  LifecycleEvent,
  type LifecycleKind,
} from "../event/lifecycle-event.js";
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

  protected applyChange(actor: Actor, mutation: () => void): void {
    mutation();
    this.touch(actor);
    this.addDomainEvent(this.buildLifecycleEvent("updated"));
  }

  protected buildLifecycleEvent(kind: LifecycleKind): DomainEvent {
    return new LifecycleEvent(this.constructor.name, kind, this.id);
  }

  protected override onCreated(): void {
    this.addDomainEvent(this.buildLifecycleEvent("created"));
  }

  protected override onSoftDeleted(): void {
    this.addDomainEvent(this.buildLifecycleEvent("soft-deleted"));
  }
}
