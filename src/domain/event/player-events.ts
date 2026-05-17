import { BaseDomainEvent } from "./domain-event.js";

export class PlayerCreatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super("player.created", aggregateId);
  }
}

export class PlayerUpdatedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super("player.updated", aggregateId);
  }
}

export class PlayerSoftDeletedEvent extends BaseDomainEvent {
  constructor(aggregateId: string) {
    super("player.soft-deleted", aggregateId);
  }
}
