import type { DomainEvent } from "./domain-event.js";

export type DomainEventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent,
) => void | Promise<void>;

/**
 * Produces events. Use cases / aggregates depend on this narrow port.
 */
export interface EventPublisher {
  publish(events: readonly DomainEvent[]): Promise<void>;
}

/**
 * Registers handlers. Composition root / wiring depends on this.
 */
export interface EventSubscriber {
  subscribe(eventName: string, handler: DomainEventHandler): void;
}

/**
 * Concrete buses typically implement both. Consumers depend on the narrow
 * port that matches their direction.
 */
export interface EventBus extends EventPublisher, EventSubscriber {}
