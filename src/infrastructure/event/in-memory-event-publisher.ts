import type { DomainEvent } from "@/domain/event/domain-event.js";
import type {
  DomainEventHandler,
  EventPublisher,
} from "@/domain/event/event-publisher.js";
import { logger } from "@/infrastructure/logger/logger.js";

export class InMemoryEventPublisher implements EventPublisher {
  private readonly _handlers = new Map<string, DomainEventHandler[]>();

  subscribe(eventName: string, handler: DomainEventHandler): void {
    const list = this._handlers.get(eventName) ?? [];
    list.push(handler);
    this._handlers.set(eventName, list);
  }

  async publish(events: readonly DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this._handlers.get(event.name) ?? [];
      for (const handler of handlers) {
        try {
          await handler(event);
        } catch (err) {
          logger.error(
            { err, event: event.name, aggregateId: event.aggregateId },
            "Domain event handler failed",
          );
        }
      }
    }
  }
}
