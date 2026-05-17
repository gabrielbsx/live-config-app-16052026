import type { DomainEvent } from "./domain-event.js";

export type DomainEventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent,
) => void | Promise<void>;

export interface EventPublisher {
  publish(events: readonly DomainEvent[]): Promise<void>;
  subscribe(eventName: string, handler: DomainEventHandler): void;
}
